import { DonorsTable, PersonalDonorTable, OrganizationDonorTable, DonorNotesTable, DonorTypeTable } from "./schema";
import { db } from "$lib/server/db/drizzle";
import { eq, and } from "drizzle-orm";

export const getAllDonors = async (userId: string) => {
    const selectResult = await db.select()
        .from(DonorsTable)
            .leftJoin(PersonalDonorTable, eq(DonorsTable.id, PersonalDonorTable.donorFK))
            .leftJoin(OrganizationDonorTable, eq(DonorsTable.id, OrganizationDonorTable.donorFK))
        .where(eq(DonorsTable.userFK, userId))

    return selectResult.map(donor => {
        return {
            ...donor.donors,
            displayName: donor?.donors_organization?.organizationName || donor?.donors_personal?.firstName + " " + donor?.donors_personal?.lastName,
            ...donor?.donors_personal,
            ...donor?.donors_organization
        }
    });  
};

export const getDonor = async (id: number, userId: string) => {
    const selectResult = await db.select()
        .from(DonorsTable)
            .leftJoin(PersonalDonorTable, eq(DonorsTable.id, PersonalDonorTable.donorFK))
            .leftJoin(OrganizationDonorTable, eq(DonorsTable.id, OrganizationDonorTable.donorFK))
            .leftJoin(DonorTypeTable, eq(DonorTypeTable.id, DonorsTable.supporterType))
        .where(and(eq(DonorsTable.id, id), eq(DonorsTable.userFK, userId)))

    const morphedResults = selectResult.map(donor => {
        return {
            ...donor.donors,
            supporterType: donor.donor_type?.name,
            displayName: donor?.donors_organization?.organizationName || donor?.donors_personal?.firstName + " " + donor?.donors_personal?.lastName,
            ...donor?.donors_personal,
            ...donor?.donors_organization
        }
    });  

    if (morphedResults.length < 1) return null
    
    return morphedResults[0]
};

export const getDonorNotes = async (id: number) => {
    const selectResult = await db.select()
        .from(DonorNotesTable)
        .where(eq(DonorNotesTable.donorFK, id))

    return selectResult.sort((a,b) => {
        if (a.dateWritten == null) return 1
        if (b.dateWritten == null) return -1

        if (a.dateWritten > b.dateWritten) return 1
        else if (a.dateWritten < b.dateWritten) return -1
        else return 0
    })
}