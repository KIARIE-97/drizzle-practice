
import { pgTable,  serial, varchar, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { profile, table } from "console";
import { primaryKey } from "drizzle-orm/mysql-core";



export const UsersTable = pgTable("users",{
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    phone: varchar("phone", {length:50}).notNull(),
    score: integer("score"),
}) 

export const ProfilesTable = pgTable("profiles", {
    id: serial("id").primaryKey(),
    bio: varchar("bio", { length: 256 }),
    userId: integer("user_id").notNull().references(() => UsersTable.id, { onDelete: "cascade" }), //fk ref id in users table
});

export const profileRelations = relations(ProfilesTable, ({one}) => ({
    user: one(UsersTable, {
        fields: [ProfilesTable.userId],
        references: [UsersTable.id]
    })
}))

//post table
export const postTable = pgTable("posts", {
    id: serial("id").primaryKey(),
    content: text("content"),
    userId: integer("user_id").notNull().references(() => UsersTable.id, { onDelete: "cascade"}),
})

export const categoryTable = pgTable("category", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256}),
    
})

//
//relations
// one user(1)-(1)profile relation , user(1)-(n)posts
export const userRelations = relations(UsersTable, ({one, many}) => ({
    profile: one(ProfilesTable, {
        fields: [UsersTable.id],
        references: [ProfilesTable.userId]
    }),
    posts: many(postTable)
}))

//post relations
export const postRelations = relations(postTable, ({one}) => ({
    user: one(UsersTable, {
        fields: [postTable.userId],
        references: [UsersTable.id]
    })
}) )

//join table for post and categories
export const postOnCategories = pgTable ("post_on_Categories", {
    postId: integer("post_id").notNull().references(() => postTable.id, {onDelete: "cascade"}),
    categoriesId: integer("category_id").notNull().references(() => categoryTable.id, {onDelete: "cascade"})
}, (table) => {
    return{
        compositeKey: primaryKey(table.postId, table.categoriesId)
    }
}
)






export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;
export type TIProfile = typeof ProfilesTable.$inferInsert;
export type TSProfile = typeof ProfilesTable.$inferSelect;
export type TSPost = typeof postTable.$inferSelect;