// src/config/env.validation.ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(), // Asegura que JWT_SECRET exista y sea un string
  PORT: Joi.number().default(3000), // Si tienes un puerto configurado
  // ... otras variables de entorno
});