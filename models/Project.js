import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    imagePublicId: { type: String },
    status: { type: String, enum: ["draft", "published"], default: "published" },
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
