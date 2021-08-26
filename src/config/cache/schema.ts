import * as Joi from 'joi';
export default Joi.object({
  CACHE_HOST: Joi.string(),
  CACHE_PORT: Joi.number().default(6379),
  CACHE_PREFIX: Joi.string(),
  CACHE_TTL: Joi.number().default(1000),
  CACHE_PASSWORD: Joi.string(),
});
