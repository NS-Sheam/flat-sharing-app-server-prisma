import express, { Application, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import globalErrorResponse from "./app/middlewares/globalErrorResponse";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
const app: Application = express();
// parser
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://flat-sharing-application-client.vercel.app",
      "https://flat-sharing-application-client.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("Hello World");

app.use("/api/v1", router);
app.get("/", async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "You are connected to the flat sharing API.",
  });
});

app.use(globalErrorResponse);
app.use(notFound);

export default app;
