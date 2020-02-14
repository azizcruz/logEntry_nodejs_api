const { Router } = require("express");
const router = Router();
const LogEntry = require("../models/LogEntry");
const validations = require("../validations");

router.get("/", async (req, res, next) => {
  try {
    const entries = await LogEntry.find({});
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  // Validate
  const result = validations.newEntryLogValidation(req.body);
  const { error } = result;
  if (error) return res.json(error);

  // Add to db
  try {
    const logEntry = new LogEntry(req.body);
    const createdInstance = await logEntry.save();
    return res.json(createdInstance);
  } catch (error) {
    if (error.name === "validationError") res.status(422);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const logEntry = await LogEntry.findById(req.params.id);
    res.json(logEntry);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedLog = await LogEntry.findByIdAndDelete(req.params.id);
    res.json(deletedLog);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const updatedLog = await LogEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    );
    res.json(updatedLog);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
