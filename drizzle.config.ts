import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: '.env'});
 
export default {
  schema: "./src/lib/server/db/**/schema.ts",
  out: "./drizzle",
  driver: 'mysql2',
  dbCredentials: {
    host: process.env.DATABASE_URL!,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'support-dashboard',
  },
  breakpoints: true
} satisfies Config;