import mongooseInstance from "../config/mongooseInstance.js";


const gallerySchema = new mongooseInstance.Schema(
  {
    image: {
      type: String,
      required: true,
    },

  
  },
  { timestamps: true }
);

export const gallery= mongooseInstance.model("gallery", gallerySchema);
