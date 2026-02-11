import express from "express";
import {
  getProjects,
  getProject,

} from "../../controllers/adminController/projectsController.js";


const projectRoute = express.Router();

projectRoute.get("/", getProjects);
projectRoute.get("/:id",getProject);


export default projectRoute;
