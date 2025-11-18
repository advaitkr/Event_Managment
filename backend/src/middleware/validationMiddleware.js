exports.validateCreateEvent = (req, res, next) => {
  const { title, description, date, location } = req.body;
  if (!title || !description || !date || !location) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  next();
};
