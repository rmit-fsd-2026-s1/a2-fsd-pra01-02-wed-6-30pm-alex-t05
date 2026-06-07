import "reflect-metadata";
import express, { application } from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";
import eventRoutes from "./routes/event.routes";
import featuredEventRoutes from "./routes/featuredEvents.routes";
import cors from "cors";
import applicationRoutes from "./routes/application.routes";
import preferredEventRoutes from "./routes/preferredEvent.routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", applicationRoutes);
app.use("/api", featuredEventRoutes);
app.use("/api", preferredEventRoutes);


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
