//imports 
import express, { Application } from "express";

import morgan from "morgan";
import appRouter from "./Routes/router";

//app
const app: Application = express();

//settings 
app.set('port', 4512);

//middlewares
app.use(morgan("dev"));
app.use(express.json());

//routes
app.use("/", appRouter)

//export the module 
export default app;