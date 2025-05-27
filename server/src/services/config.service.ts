import { config } from 'dotenv';
import { z } from 'zod';
import { parseEnv } from 'znv';
import { injectable } from 'inversify';

config();

@injectable()
export class ConfigService {
  private featureFlags: ReturnType<typeof this.initFeatureFlags>;
  private envVariableFlags: ReturnType<typeof this.initEnvVariables>;

  constructor() {
    this.featureFlags = this.initFeatureFlags();
    this.envVariableFlags = this.initEnvVariables();
  }

  private initFeatureFlags() {
    return parseEnv(process.env, {
      // FF_USE_CLERK_AUTH: z
      //   .enum(['true', 'false'])
      //   .transform((v) => v === 'true'),
    });
  }

  private initEnvVariables() {
    return parseEnv(process.env, {
      MONGO_URI: z.string().url(),
      NODE_ENV: z.enum(['dev', 'test', 'prod']),
      WHITELISTED_ORIGINS: z
        .string()
        .transform((v) => v.split(',').map((origin) => origin.trim())),
      PORT: z.coerce.number().default(3000),
      // CLERK_API_KEY: z.string().optional(),
      // CLERK_FRONTEND_API: z.string().optional(),
      // CLERK_JWT_KEY: z.string().optional(),
      // CLERK_JWT_ISSUER: z.string().optional(),
      // CLERK_JWT_AUDIENCE: z.string().optional(),
      // CLERK_JWT_ALGORITHM: z.string().optional(),
      // CLERK_JWT_EXPIRATION: z.coerce.number().default(3600),
      // CLERK_JWT_ISSUED_AT: z.coerce.number().default(Date.now()),
    });
  }

  getFeatureFlag() {
    return this.featureFlags;
  }

  getEnvVariable() {
    return this.envVariableFlags;
  }
}

export const getConfigService = () => {
  return new ConfigService();
};
