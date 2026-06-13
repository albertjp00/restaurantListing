import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import router from "./routes/routes";
import path from "node:path";
import { db } from "./db/knex";


const app = express();

app.use(cors({
  origin : process.env.frontend_url,
  methods : ["GET" , "POST" , "PUT" , "PATCH" , "DELETE"],
  credentials : true
}));


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Running...");
});

app.use("/assets", express.static(path.join(process.cwd(), "src/assets")));


app.use("/", router);


const startServer = async () => {
  try {
    // await pool.connect();
    await db.raw("SELECT 1")
    console.log("PostgreSQL Connected");


    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });

  } catch (error) {
    console.error("DB connection failed:", error);
  }
};

startServer();

export default app; 