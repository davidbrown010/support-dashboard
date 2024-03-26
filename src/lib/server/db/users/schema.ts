import { mysqlTable, varchar, int, bigint, serial } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
	id: varchar('id', { length: 15 }).primaryKey(),
	username: varchar('username', { length: 55}).unique().notNull(),
	firstName: varchar('firstName', { length: 255 }).notNull(),
	lastName: varchar('lastName', { length: 255 }).notNull(),
	class: int('user_class').notNull().default(3)
});

export const sessions = mysqlTable('user_sessions', {
	id: varchar('id', { length: 128 }).primaryKey(),
	userId: varchar('user_id', { length: 15 }).notNull(),
	activeExpires: bigint('active_expires', {mode: "number"}).notNull(),
	idleExpires: bigint('idle_expires', {mode: "number"}).notNull()
});

export const keys = mysqlTable('user_keys', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 15 }).notNull(),
	hashedPassword: varchar('hashed_password', { length: 255 })
});

export const userClass = mysqlTable('user_classes', {
	id: serial('id'),
	className: varchar('class_name', {length: 255}).notNull()
})