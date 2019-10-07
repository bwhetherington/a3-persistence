import low from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync";
import { hashPassword } from "./util";
import { MongoClient } from "mongodb";
import { promisify } from "util";
import { readFile } from "./util";

// const mongoConnect = promisify(MongoClient.connect);

export const initDB = async () => {
  // Create database
  const client = await getConnection();

  const db = client.db("a3persistence");

  // Set default values
  const adminUser = {
    username: "admin",
    name: "Admin",
    passwordHash: await hashPassword("admin"),
    postIDs: [],
    joinTime: 1568609177293
  };

  await db.collection("users")
    .findOneAndUpdate({ username: "admin" }, { $setOnInsert: adminUser }, { upsert: true });

  return client;
};

export const getUrl = async () => {
  let file = await readFile("../mongodb-url.txt", "utf-8");
  console.log(file.trim());
  return file.trim();
}

let connection = null;

const MONGO_SETTINGS = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

export const getConnection = async () => {
  if (connection) {
    return connection;
  } else {
    const url = (await readFile("../mongodb-url.txt", "utf-8")).trim();
    const client = await MongoClient.connect(url, MONGO_SETTINGS);
    connection = client;
    return client;
  }
};