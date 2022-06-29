const app = require("./app");
const dotenv = require("dotenv");
const dbconnection = require("./db/connection");

//Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

dotenv.config({
  path: "../uvxcel attendance system with bootstrap/config/config.env",
});
dbconnection();
const server = app.listen(process.env.PORT, () =>
  console.log(`server runing on port ${process.env.PORT}`)
);

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
