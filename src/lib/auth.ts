import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoURL = process.env.BETTER_AUTH_URL;

if(!mongoURL){
  throw new Error("BETTER_AUTH_URL is not defined");
}

const client = new MongoClient(mongoURL);
const db = client.db();

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
});
