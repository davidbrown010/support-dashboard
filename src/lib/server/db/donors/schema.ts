import { pgTable, serial, bigint, text, varchar, date, integer, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from '../users/schema';
 
export const DonorsTable = pgTable('donors', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  spouseFirstName: text('spouse_first_name'),
  spouseLastName: text('spouse_last_name'),
  organizationName: text('organization_name'), 
  phoneNumber: varchar('contact_phone_number', {length: 12}),
  email: text('contact_email'),
  toLine: text('to_line'),
  streetAddress1: text('street_address_1'),
  streetAddress2: text('street_address_2'),
  cityAddress: text('city_address'),
  stateAddress: varchar('state_address', { length: 2}),
  zipAddress: varchar('zip_address', { length: 10}),
  userDonor: text('user').notNull().references(()=>usersTable.id, { onDelete: 'cascade' }),
  donorActivity: integer('donor_activity').default(1).references(()=>DonorActivityStatusTable.id),
  donorType: integer('donor_type').default(5).references(()=>DonorTypeTable.id),
});






//Birthdays, Anniversary
// export const DonorKeyDatesTable = pgTable('donor_key_dates', {
//   id: serial('id').primaryKey(),
//   donor: bigint('donor', {mode: "number"}).references(()=>DonorsTable.id, { onDelete: 'cascade' }),
//   dateName: text('date_name').notNull(),
//   date: date('date', {mode: 'date'}).notNull().unique()
// })

// //Notes about the donor's life
// export const DonorNotesTable = pgTable('donor_notes', {
//   id: serial('id').primaryKey(),
//   donor: bigint('donor', {mode: "number"}).references(()=>DonorsTable.id, { onDelete: 'cascade' }),
//   noteText: text('note_text'),
//   dateWritten: timestamp('date_written', { precision: 6, withTimezone: true }).defaultNow()
// })







//Active, 
export const DonorActivityStatusTable = pgTable('donor_activity_status', {
  id: integer('id').primaryKey(),
  status: text('status').notNull().unique()
})

export const DonorTypeTable = pgTable('donor_type', {
  id: integer('id').primaryKey(),
  type: text('type').notNull().unique()
})