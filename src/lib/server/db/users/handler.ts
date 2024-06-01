import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { usersTable } from "./schema";
import { hash, verify } from "@node-rs/argon2";
import { generateIdFromEntropySize, type User } from "lucia";

export const findValidUser = async (username: string , password: string) => {
    const selectResult_existingUser = (await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, username.toLowerCase()))
        .limit(1))

    const existingUser = selectResult_existingUser.length > 0 ? selectResult_existingUser[0] : false

    if (!existingUser) {
        return false
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });

    if (!validPassword) {
        return false
    }

    return existingUser
}

export const createNewUser = async (username: string, firstName: string, lastName: string, password: string) => {

    const selectResult_existingUsername = await db.select().from(usersTable).where(eq(usersTable.username, username))
    if (selectResult_existingUsername.length > 0) throw new Error('username taken')

    const userId = generateIdFromEntropySize(10); // 16 characters long
    const passwordHash = await hashPassword(password)

    try {
        const insertResult_newUser = await db.insert(usersTable).values({
            id: userId,
            username: username,
            firstName: firstName,
            lastName: lastName,
            passwordHash: passwordHash,
            class: 3
        }).returning({ userId: usersTable.id })

        if (insertResult_newUser.length != 1) throw new Error('invalid return result from insert')

        const newUser = insertResult_newUser[0]

        return newUser

    } catch (e) {

        throw e

    }
}

const hashPassword = async (password: string) => {
    const passwordHash = await hash(password, {
        // recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });

    return passwordHash
}