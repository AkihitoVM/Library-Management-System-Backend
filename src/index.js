import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import library from "./library/library.controller.js";
import cors from 'cors'
dotenv.config();

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/library", library); 

app.get("/", (req, res) => {
  res.send("Server Works!");
});

const PORT = 5000;

const start = async () => {
  await mongoose.connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );
  app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
  });
};

start();
