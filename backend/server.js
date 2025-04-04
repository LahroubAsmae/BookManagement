import express from "express";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/BookRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json()); //pour lire req.json
app.use(express.urlencoded({ extended: false }));
app.use("/api/books", router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
