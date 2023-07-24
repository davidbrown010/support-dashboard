import { TasksTable } from "./schema";
import { db } from "$lib/server/db/drizzle";

export const getAllTasks = async () => {
    const selectResult = await db.select().from(TasksTable);
    console.log('Results', selectResult);
    return selectResult;
};