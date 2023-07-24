import { mysqlTable, serial, text, varchar, boolean, int } from 'drizzle-orm/mysql-core';
 
export const TasksTable = mysqlTable('tasks', {
  id: serial('id').primaryKey(),
  taskName: varchar('task_name', { length: 256 }).notNull(),
  type: int('task_type').notNull(),
  description: varchar('description', { length: 256 }),
  isComplete: boolean('is_completed').default(false)
});