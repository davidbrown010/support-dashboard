import { mysqlTable, serial, text, varchar } from 'drizzle-orm/mysql-core';
 
export const DonorsTable = mysqlTable('donors', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 256 }).notNull(),
  lastName: varchar('last_name', { length: 256 }).notNull(),
  streetAddress: varchar('street_address', { length: 256}),
  cityAddress: varchar('city_address', { length: 256}),
  stateAddress: varchar('state_address', { length: 2}),
  zipAddress: varchar('zip_address', { length: 10}),
});