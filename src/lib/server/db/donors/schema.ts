import { mysqlTable, serial, bigint, varchar, text, date, int } from 'drizzle-orm/mysql-core';
 
export const DonorsTable = mysqlTable('donors', {
  id: serial('id').primaryKey(),
  phoneNumber: varchar('contact_phone_number', {length: 12}),
  toLine: varchar('to_line', {length: 255}),
  streetAddress: varchar('street_address', { length: 255}),
  cityAddress: varchar('city_address', { length: 255}),
  stateAddress: varchar('state_address', { length: 2}),
  zipAddress: varchar('zip_address', { length: 10}),
  userFK: varchar('user_fk', { length: 15 }).notNull(),
  supporterType: int('supporter_type').default(5)
});

export const PersonalDonorTable = mysqlTable('donors_personal', {
  donorFK: bigint('donor_fk', {mode: "number"}).primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  spouseFirstName: varchar('spouse_first_name', { length: 255 }),
  spouseLastName: varchar('spouse_last_name', { length: 255 })
})

export const OrganizationDonorTable = mysqlTable('donors_organization', {
  donorFK: bigint('donor_fk', {mode: "number"}).primaryKey(),
  organizationName: varchar('organization_name', { length: 255 }).notNull(),
  contactFirstName: varchar('contact_first_name', { length: 255 }),
  contactLastName: varchar('contact_last_name', { length: 255 })
})

export const DonorNotesTable = mysqlTable('donor_notes', {
  id: serial('id').primaryKey(),
  donorFK: bigint('donor_fk', {mode: "number"}),
  noteText: text('note_text'),
  dateWritten: date('date_written').default(new Date())
})

export const DonorTypeTable = mysqlTable('donor_type', {
  id: serial('id').primaryKey(),
  name: varchar('name', {length: 255})
})