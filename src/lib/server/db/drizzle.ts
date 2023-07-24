// import { drizzle } from "drizzle-orm/mysql2";
// import mysql from "mysql2/promise";

import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";

import { DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD } from '$env/static/private';
 
// const poolConnection = mysql.createPool({
//   connectionLimit: 10,
//   host: DATABASE_HOST,
//   user: DATABASE_USERNAME,
//   password: DATABASE_PASSWORD,
//   database: 'support-dashboard',
//   debug: false
// });
 
// export const db = drizzle(poolConnection);

const connection = connect({
  host: DATABASE_URL,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
});
 
export const db = drizzle(connection);
