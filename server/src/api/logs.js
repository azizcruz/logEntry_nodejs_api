const { Router } = require("express");
const router = Router();
const LogEntry = require("../models/LogEntry");
const validations = require("../validations");

router.get("/", (req, res) => {
  res.json({
    message: "Hi Log!"
  });
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

module.exports = router;
