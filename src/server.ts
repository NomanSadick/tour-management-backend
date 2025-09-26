/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;



const startServer = async () => {
  try {
    await mongoose.connect(
      envVars.DB_URL
    );
    console.log("Database connected successfully");
    server = app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};



(async () => {
  await startServer();
  await seedSuperAdmin();
})();

// SIGTERM: handle termination signal from OS or container orchestration tools like Kubernetes

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// SIGINT: handle ctrl+c event in terminal to stop the server
process.on("SIGINT", () => {
  console.log("SIGINT signal received... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// unhandledRejection: handle errors in async code that are not caught by any try-catch block

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});


// uncaughtException: handle errors that are not caught by any try-catch block
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
