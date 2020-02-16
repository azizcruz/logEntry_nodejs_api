const { Router } = require("express");
const router = Router();
const Visitor = require("../models/Visitor");
const validations = require("../validators");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/", async (req, res, next) => {
  try {
    const visitors = await Visitor.find();
    res.json(visitors);
  } catch (error) {
    next(error);
  }
});

router.post("/get-token", async (req, res, next) => {
  const result = validations.newVisitorValidation(req.body);
  const { error } = result;
  if (error) res.json(error);
  try {
    const visitor = await Visitor.findOne({ email: req.body.email });
    if (!visitor) {
      return res.status(404).json({ message: "Visitor does not exist" });
    }

    // Create token
    const token = jwt.sign({ _id: visitor._id }, process.env.TOKEN_SECRET);
    return res.header("auth-token", token).json({
      visitor: visitor.email,
      token: token
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const result = validations.newVisitorValidation(req.body);
  const { error } = result;

  if (error) res.json(error);

  try {
    const visitor = Visitor(req.body);
    const newVisitor = await visitor.save();
    res.json({ id: newVisitor._id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
