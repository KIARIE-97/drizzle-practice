
import { eq } from "drizzle-orm";
import db from "./drizzle/db";
import { ProfilesTable, UsersTable, postTable } from "./drizzle/schema";
import {TIUser, TSUser, TIProfile, TSProfile, TSPost} from "./drizzle/schema";

const getUsers = async (): Promise<TSUser[] | null> => {
    return await db.query.UsersTable.findMany();
}

const getProfiles = async (): Promise<TSProfile[] | null> => {
    return await db.query.ProfilesTable.findMany();
}

const getPosts = async (): Promise<TSPost[] | null> => {
    return await db.query.postTable.findMany();
}

//1-1 realtion
const getUsersWithProfile = async () => {
    return await db.query.UsersTable.findMany({
        columns:{
            username: true,
            phone: true
        },
        with: {
            profile: {
                columns: {
                    bio: true
                }
            }
        }
    })
}

//1-n relation
const getUsersWithPosts = async () => {
    return await db.query.UsersTable.findMany({
        with: {
            posts: true
        }
    })
}

const getPostWithUsers = async (id: number) => {
    return await db.query.postTable.findMany({
        columns:{
            content: true
        },
        with: {
            user: {
                columns:{
                    username: true
                }
            }
        },
        where: eq(UsersTable.id, id)
    })
}

async function main () {
    // console.log(await getUsersWithProfile());
        // console.log( await getUsers());
        // console.log( await getProfiles());
    // console.log (await createUser({ userId: 1, bio: "I am a data analyst" })); // { id: 1
    // console.log( await updateUserProfile("I am a data analyst", 1));
    // console.log(await deleteProfiles("I am a software engineer"));
    // console.log(await getPosts());
    // console.log(await getUsersWithPosts());
    console.log(await getPostWithUsers(1));
}

main();


// const createUser = async (user: TIProfile) => {
//     await db.insert(ProfilesTable).values({
//         userId: user.userId,
//         bio: user.bio,
       
//     }).returning({id: ProfilesTable.id});
// }
  


// const updateUserProfile = async (bio: string, user_id: number) => {
//     await db.update(ProfilesTable).set({bio}).where(eq(ProfilesTable.userId, user_id))
// }

// const deleteProfiles = async (bio: string) => {
//     return await db.delete(ProfilesTable).where(eq(ProfilesTable.bio, bio)).returning();
// }