import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authenticationRoutes.js";
import AppError from "./utils/AppError.js";
import globalErrorMiddleware from "./middlewares/globalError.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
    inflate: true,
    limit: "1mb",
    parameterLimit: 5000,
    type: "application/x-www-form-urlencoded"
  })
);

app.use("/api/v1/auth", authRoutes);

app.all(/.*/, (req, res, next) => {
  const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  next(new AppError(`${url} do not exist in this application`));
});

app.use(globalErrorMiddleware);
export default app;
