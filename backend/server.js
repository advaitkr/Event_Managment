const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { connectDB } = require("./src/config/db");
const { initSockets } = require("./src/sockets/eventSocket");
const { initRedis } = require("./src/config/redis");
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

// Connect DB & Redis
connectDB();
initRedis();

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("API is running..."));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const _dirname = path.resolve()
// Create HTTP server and attach socket.io
const server = http.createServer(app);
initSockets(server);
app.use(express.static(path.join(_dirname,"/client/build")))
// universal fallback — works as catch-all without path-to-regexp parsing issues
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

