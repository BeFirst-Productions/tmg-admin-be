import { gallery } from "../../models/galleryModel.js";



export const getGalleryImages = async (req, res) => {
  try {
   
    const images = await gallery.find()
   

    res.json({
      success: true,
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





