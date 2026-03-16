import express from "express";
import {
  getAllPackages,
  getPackageById,
} from "../../controllers/publicController/packageController.js";

const packageRoute = express.Router();

// GET  /public/package         – list all packages
packageRoute.get("/", getAllPackages);

// GET  /public/package/:id     – get single package by ID
packageRoute.get("/:id", getPackageById);

export default packageRoute;
