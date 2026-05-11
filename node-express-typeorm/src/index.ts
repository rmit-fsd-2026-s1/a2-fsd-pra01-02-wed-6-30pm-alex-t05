import "reflect-metadata";
import express, { application } from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";
import eventRoutes from "./routes/event.routes";
import cors from "cors";
import applicationRoutes from "./routes/application.routes";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", applicationRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );
