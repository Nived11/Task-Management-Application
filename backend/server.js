import express from "express";
import env from "dotenv";
import cors from "cors";
import router from "./router.js";
import connection from "./connection.js";

env.config();

const app = express();




app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use("/api", router); 

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
    await connection();
    console.log(`Server started at http://localhost:${process.env.PORT}`);
});

