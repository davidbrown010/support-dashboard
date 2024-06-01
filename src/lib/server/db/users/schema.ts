import { pgTable, text, integer, timestamp, serial } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	id: text('id').primaryKey(),
	username: text('username').unique().notNull(),
	firstName: text('firstName').notNull(),
	lastName: text('lastName').notNull(),
	class: integer('user_class').notNull()
		.default(3)
		.references(()=>userClassTable.id),
	passwordHash: text('password_hash').notNull()

});

export const sessionsTable = pgTable('user_sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export const userClassTable = pgTable('user_classes', {
	id: serial('id').primaryKey(),
	className: text('class_name').notNull().unique()
})