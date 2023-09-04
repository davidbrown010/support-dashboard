import { mysqlTable, serial, bigint, varchar, boolean, int } from 'drizzle-orm/mysql-core';
 
export const TasksTable = mysqlTable('tasks', {
  id: serial('id').primaryKey(),
  taskName: varchar('task_name', { length: 255 }).notNull(),
  type: int('task_type').notNull(),
  description: varchar('description', { length: 255 }),
  isComplete: boolean('is_completed').default(false),
  donorFK: bigint('donor_fk', {mode: "number"}),
  userFK: varchar('user_fk', { length: 15 }).notNull(),
});