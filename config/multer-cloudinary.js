import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "/TMG-GLOBAL/tmg_blogs", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// Single image upload
const upload = multer({ storage });

export default upload;



const ProjectsStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "/TMG-GLOBAL/tmg_projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
  }),
});

export const uploadProjectImage = multer({ storage: ProjectsStorage });



// const galleryStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "/NASPIXELS/naspixels_gallery",  
//     allowed_formats: ["jpg", "jpeg", "png", "webp"],
//   },
// });
// export const uploadGalleryImage = multer({ storage: galleryStorage });


// const packageStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'NASPIXELS/naspixels_packages',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//   }
// });

// export const uploadPackageImage = multer({ storage: packageStorage });