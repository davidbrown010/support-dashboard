import { mysqlTable, varchar, serial, bigint } from 'drizzle-orm/mysql-core';

export const apiKeysTable = mysqlTable('api_keys', {
	id: serial('id').primaryKey(),
	userId: varchar('user_id', { length: 15 }).notNull(),
	apiKey: varchar('api_key', { length: 255 }).unique().notNull(),
	expires: bigint('expires', {mode: "number"}).notNull(),
});