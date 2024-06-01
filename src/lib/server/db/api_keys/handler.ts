// import { db } from "../drizzle"
// import { eq, and } from "drizzle-orm"
// import { apiKeysTable } from "./schema"

// const { subtle } = globalThis.crypto;

// async function generateAesKey(length = 256) {
//   const key = await subtle.generateKey({
//     name: 'AES-CBC',
//     length,
//   }, true, ['encrypt', 'decrypt']);

//   return subtle.exportKey('jwk', key);
// } 

// const insertApiKey = async (userId: string) => {

//     const getNewDate = () => {
//         const date = new Date();
//         date.setFullYear(date.getFullYear() + 1)
//         return date.valueOf();
//     }

//     const JWK = await generateAesKey()
    
//     const apiKey = JWK.k

//     return db.insert(apiKeysTable).values({
//         userId,
//         apiKey: apiKey!,
//         expires: getNewDate()
//     });
// }

// export const createApiKey = async (userId: string) => {
//     const newApiKey = await insertApiKey(userId);
//     return newApiKey
// }

// export const getApiKeys = async (userId: string) => {
//     return await db.select().from(apiKeysTable).where(eq(apiKeysTable.userId, userId))
// }

// export const removeApiKey = async (userId: string, apiKeyId: string) => {
//     const apiKeyId_int = parseInt(apiKeyId)
//     return await db.delete(apiKeysTable).where(and(eq(apiKeysTable.id, apiKeyId_int), eq(apiKeysTable.userId, userId)));
// }
