import { DonorsTable } from "./schema";
import { db } from "$lib/server/db/drizzle";

export const getAllDonors = async () => {
    const selectResult = await db.select().from(DonorsTable);
    return selectResult;  
};