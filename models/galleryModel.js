import mongooseInstance from "../config/mongooseInstance.js";


const gallerySchema = new mongooseInstance.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: false, 
    }
  
  },
  { timestamps: true }
);

export const gallery= mongooseInstance.model("gallery", gallerySchema);
