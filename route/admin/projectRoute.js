import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../../controllers/adminController/projectsController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { authorizeRoles } from "../../middleware/authorizeRoles.js";
import { uploadProjectImage } from "../../config/multer-cloudinary.js";

const projectRoute = express.Router();

projectRoute.post(
  "/create-project",
  authMiddleware,
  authorizeRoles("admin"),
  uploadProjectImage.single("image"),
  createProject
);

projectRoute.get("/", 
    authMiddleware, 
    authorizeRoles("admin"), 
    getProjects
);
projectRoute.get("/:id", 
    authMiddleware, 
    authorizeRoles("admin"), 
    getProject
);

projectRoute.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  uploadProjectImage.single("image"),
  updateProject
);

projectRoute.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteProject
);

export default projectRoute;
