import cloudinary from "../../config/cloudinary.js";
import { gallery } from "../../models/galleryModel.js";

export const addGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const newImage = new gallery({
      image: req.file.path, 
    });

    const saved = await newImage.save();

    res.json({
      success: true,
      message: "Image added successfully",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const getGalleryImages = async (req, res) => {
  try {
      console.log(req.query);
    const page = parseInt(req.query.page) || 1;       // default page = 1
    const limit = parseInt(req.query.limit) || 8;     // default 8 images
    
    const skip = (page - 1) * limit;

    const total = await gallery.countDocuments();

    const images = await gallery
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: images,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await gallery.findById(id);

    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    res.json({ success: true, data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await gallery.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    if (deleted.image) {
      try {
        const urlParts = deleted.image.split("/");
        const versionIndex = urlParts.findIndex((p) => p.startsWith("v"));

        const publicId = urlParts
          .slice(versionIndex + 1)
          .join("/")
          .replace(/\.[^/.]+$/, "");

        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.warn("Cloudinary delete failed:", err.message);
      }
    }

    res.json({
      success: true,
      message: "Image deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
