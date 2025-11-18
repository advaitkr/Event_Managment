const Event = require("../models/Event");
const { getRedisClient } = require("../config/redis");

// Create Event
exports.createEvent = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.user.id;
    const event = await Event.create(data);

    // invalidate cache
    const client = getRedisClient();
    if (client) await client.del("events");

    // notify sockets
    const io = req.app.get("io");
    if (io) io.emit("event:created", event);

    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

exports.getEvents = async (req, res, next) => {
  try {
    const client = getRedisClient();
    if (client) {
      const cached = await client.get("events");
      if (cached) return res.json(JSON.parse(cached));
    }

    const events = await Event.find()
      .populate("createdBy", "name email")
      .select("-__v");

    if (client) await client.setEx("events", 3600, JSON.stringify(events));

    res.json(events);
  } catch (err) {
    next(err);
  }
};
exports.getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate("createdBy", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    let event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Only admin or owner can update
    if (
      req.user.role !== "admin" &&
      event.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(event, req.body);
    await event.save();

    const client = getRedisClient();
    if (client) await client.del("events");

    res.json(event);
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
    try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
    }
    
    
    await event.remove();
    
    
    const client = getRedisClient();
    if (client) await client.del('events');
    
    
    res.json({ message: 'Event removed' });
    } catch (err) {
    next(err);
    }
    };
