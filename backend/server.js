import express from "express";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/BookRoutes.js";
import { userRouter } from "./routes/UserRoutes.js";
import borrowingRoutes from "./routes/borrowingRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
const port = process.env.PORT || 5000;
import { ConnectDB } from "./Config/db.js";
ConnectDB();
const app = express();
app.use(express.json()); //pour lire req.json
app.use(express.urlencoded({ extended: false }));
app.use("/api/books", router);
app.use("/api/users", userRouter);
app.use("/api/borrowings", borrowingRoutes);
// Ajoutez ceci avant les autres routes
app.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
