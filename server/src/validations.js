const Joi = require("joi");

const newEntryLogValidation = body => {
  const EntryLogSchema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    comments: Joi.string(),
    image: Joi.string(),
    rating: Joi.number()
      .min(0)
      .max(10),
    latitude: Joi.number()
      .min(-90)
      .max(90),
    longitude: Joi.number()
      .min(-180)
      .max(180),
    visitDate: Joi.date().required()
  });

  return Joi.validate(body, EntryLogSchema);
};

module.exports = {
  newEntryLogValidation
};
