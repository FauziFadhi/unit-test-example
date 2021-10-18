import * as Joi from 'joi';

export default Joi.object({
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_DEFAULT_REGION: Joi.string().required(),
  AWS_BUCKET: Joi.string().optional(),
  AWS_BUCKET_URL: Joi.string().required(),
});
