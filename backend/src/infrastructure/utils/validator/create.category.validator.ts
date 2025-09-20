import Joi from "joi";

export const createCategoryValidator = Joi.object({
  name: Joi.string().required(),
  parentId: Joi.string(),
});
