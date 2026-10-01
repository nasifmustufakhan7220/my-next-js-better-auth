import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoURL = process.env.BETTER_AUTH_DB_URL;

if(!mongoURL){
  throw new Error("BETTER_AUTH_URL is not defined");
}

const client = new MongoClient(mongoURL);
const db = client.db("user");

export const auth = betterAuth({
  user:{
     changeEmail:{
      enabled: true,
      // updateEmailWithoutVerification: true
     }
  },
  emailVerification:{
    sendVerificationEmail: async({user, url})=>{
      console.log(`Verify link for ${user.email}: ${url}`);
    }
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders:{
    google:{
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET as string
    },
    discord:{
      clientId: process.env.BETTER_AUTH_DISCORD_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_DISCORD_SECRET as string
    },
    facebook:{
      clientId: process.env.BETTER_AUTH_FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_FACEBOOK_SECRET as string
    },
    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET as string,
    }
  },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
  account:{
    accountLinking:{
      enabled: true,
      trustedProviders:["google"],
    }
  }
});
