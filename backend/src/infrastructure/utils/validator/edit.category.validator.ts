import Joi from "joi";

export const editCategoryValidator = Joi.object({
  name: Joi.string().required(),
});
