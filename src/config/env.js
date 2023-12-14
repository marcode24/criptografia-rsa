import { config } from 'dotenv';
import Joi from 'joi';

config();

const envVarsSchema = Joi.object({
  PORT: Joi.number().required().description('Port to listen'),
  AUTH_USER: Joi.string().required().description('User name to login'),
  AUTH_PASSWORD: Joi.string().required().description('Password to login'),
  JWT_SECRET: Joi.string().required().description('JWT Secret Key'),
}).unknown().required();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const vars = {
  PORT: envVars.PORT,
  AUTH_USER: envVars.AUTH_USER,
  AUTH_PASSWORD: envVars.AUTH_PASSWORD,
  JWT_SECRET: envVars.JWT_SECRET,
};

export default vars;
