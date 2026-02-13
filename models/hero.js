import mongooseInstance from "../config/mongooseInstance.js";


const HeroSectionSchema = new mongooseInstance.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
    buttonUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export  const herosection=  mongooseInstance.model("HeroSection", HeroSectionSchema);
