// server.js
const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const { connectDB } = require("./src/config/db");
const { initSockets } = require("./src/sockets/eventSocket");
// import 'connect' as initRedis and also expose getClient if needed
const { connect: initRedis, getClient } = require("./src/config/redis");

const eventRoutes = require("./src/routes/events");
const authRoutes = require("./src/routes/auth");
const { errorHandler, notFound } = require("./src/middleware/errorMiddleware");

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Wrap startup in async IIFE so we can await DB + Redis before listening
(async function start() {
  try {
    await connectDB();
    console.log("MongoDB connected");

    // call initRedis **once** and await it
    await initRedis();
    console.log("Redis initialized");

    // Register routes
    app.use("/api/events", eventRoutes);
    app.use("/api/auth", authRoutes);

    app.get("/", (req, res) => res.send("API is running..."));

    app.use(notFound);
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    const _dirname = path.resolve();

    const server = http.createServer(app);
    initSockets(server);

    // Serve client build if available
    const clientBuildPath = path.join(_dirname, "/client/build");
    if (fs.existsSync(clientBuildPath)) {
      app.use(express.static(clientBuildPath));
      app.use((req, res) => res.sendFile(path.join(clientBuildPath, "index.html")));
    } else {
      app.use((req, res) => res.status(404).send("Not Found"));
    }

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err && err.message ? err.message : err);
    process.exit(1);
  }
})();
