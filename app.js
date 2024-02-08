import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { sq, testDbConnection } from "./config/db.js";
import creerTable from "./models/db.js";
import route_sync from "./controllers/router/routes.js";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import { addCity } from "./controllers/async/frontend_assests.js";

testDbConnection();
creerTable();
const app = express();

app.use(express.static("./public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(
  session({
    secret: "QuicTaskSessions",
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 900000 }, //here ,15 min session time
  })
);

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for userManagement",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. it's a test for swaggger",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "Speckpro Digital",
      url: "https://speckpro.com/",
    },
  },
  servers: [
    {
      url: "http://localhost:3003",
      description: "Localhost server",
    },
  ],
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const options = {
  swaggerDefinition,
  apis: ["./swagger.yaml"],
};

const swaggerspec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerspec));
app.use("/", route_sync);
export default app;
