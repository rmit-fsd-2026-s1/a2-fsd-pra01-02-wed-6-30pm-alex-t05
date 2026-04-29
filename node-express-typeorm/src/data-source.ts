import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Event } from "./entity/Event";

export const AppDataSource = new DataSource({
  type: "mssql",
  host: "dipto-database.cn2ems8y2mfe.ap-southeast-2.rds.amazonaws.com",
  username: "s3731804",
  password: "Rmit1234#1",
  database: "s3731804",
      options: {
        encrypt: false, // Use this for Azure SQL Database
        //trustedConnection: false // Use this for Windows Authentication (if applicable)
    },
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true, 
  logging: true, // Enable logging for debugging purposes
  entities: [User, Event],
  migrations: [],
  subscribers: [],
});
