import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection:process.env.DATABASE_URL,
    migrations: {
      directory: "./migrations",
    },
  },
};

export default config;




// connection: {
//       host: "localhost",
//       user: "postgres",  
//       password: "albert2000",
//       database: "restaurantListing",
//       port: 5433,
//     }