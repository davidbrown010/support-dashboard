import { mysqlTable, serial, bigint, varchar, boolean, int } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
 
export const icalEventsTable = mysqlTable('ical_events', {
  id: varchar('uid', {length: 36}).primaryKey(),
  categoryFK: bigint('category_fk', {mode: "number"})
});

export const icalEventsRelations = relations(icalEventsTable, ({ one }) => ({
	category: one(icalEventCategoryTable, {
		fields: [icalEventsTable.categoryFK],
		references: [icalEventCategoryTable.id],
	}),
}));

export const icalEventCategoryTable = mysqlTable('ical_event_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', {length: 255})
});

export const icalEventCategoryRelations = relations(icalEventCategoryTable, ({ many }) => ({
	events: many(icalEventsTable),
}));


export const icalCalendarTable = mysqlTable('ical_calendars', {
	id: serial('id').primaryKey(),
  	name: varchar('name', {length: 255}).notNull(),
	url: varchar('url', {length: 512}).notNull(),
	color: varchar('color', {length: 7}).default('#0000FF'),
	userFK: varchar('user_fk', { length: 15 }).notNull(),
})