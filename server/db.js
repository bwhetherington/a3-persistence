import low from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync";
import { hashPassword } from "./util";

export const initDB = async (dbFile = "data/db.json") => {
  // Create database
  const adapter = new FileAsync(dbFile);
  const db = await low(adapter);

  // Set default values
  await db
    .defaults({
      users: [
        {
          username: "admin",
          name: "Admin",
          passwordHash: await hashPassword("admin"),
          postIDs: [],
          joinTime: 1568609177293
        }
      ],
      posts: {}
    })
    .write();

  return db;
};
