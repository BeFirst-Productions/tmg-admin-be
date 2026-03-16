import express from "express";
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../../controllers/adminController/packageController.js";
import { uploadPackageImage } from "../../config/multer-cloudinary.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { authorizeRoles } from "../../middleware/authorizeRoles.js";

const packageRoute = express.Router();


packageRoute.post(
  "/create-package",
  authMiddleware,
  authorizeRoles("admin"),
  uploadPackageImage.single("image"),
  createPackage
);


packageRoute.get("/get-all-packages", authMiddleware, authorizeRoles("admin"), getAllPackages);


packageRoute.get(
  "/get-package/:id",
  authMiddleware,
  authorizeRoles("admin"),
  getPackageById
);


packageRoute.put(
  "/update-package/:id",
  authMiddleware,
  authorizeRoles("admin"),
  uploadPackageImage.single("image"),
  updatePackage
);


packageRoute.delete(
  "/delete-package/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deletePackage
);

export default packageRoute;
