import mongooseInstance from "../config/mongooseInstance.js";


const PackageSchema = new mongooseInstance.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String },
    withVisaPrice1: { type: Number },
    withVisaPrice2: { type: Number },
    WithoutVisaPrice1: { type: Number },
    WithoutVisaPrice2: { type: Number },

  },
  { timestamps: true }
);

export default mongooseInstance.model("Package", PackageSchema);
