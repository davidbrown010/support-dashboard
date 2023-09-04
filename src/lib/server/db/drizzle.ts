// import { drizzle } from "drizzle-orm/mysql2";
// import mysql from "mysql2/promise";

import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";

import { DATABASE_URL } from '$env/static/private';

export const connection = connect({
  url: DATABASE_URL,
});
 
export const db = drizzle(connection);
