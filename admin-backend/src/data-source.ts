import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mssql",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    encrypt: false, // Use this for Azure SQL Database
    //trustedConnection: false // Use this for Windows Authentication (if applicable)
  },
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true,
  logging: ["log", "error"], // Enable logging for debugging purposes
  entities: ["src/entity/**/*.ts"], // Register the Tutorial entity with TypeORM, allowing it to manage the corresponding database table and perform CRUD operations based on the defined schema.
  migrations: [],
  subscribers: [],
});