import mongooseInstance from "../config/mongooseInstance.js";


const blogSchema = new mongooseInstance.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    imagePublicId: { type: String },
    category:{type:String,required:true},
    metaTitle: { type: String, required: true },
    metaKeywords: { type: String, required: true },
    metaDescription: { type: String, required: true },
    canonical: { type: String, required: true },
    // subCategory: { type: String, required: false },
    // category: { type: String, required: false },
    url: { type: String, required: true, unique: true, index: true },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true }
);

export const blog = mongooseInstance.model("Blog", blogSchema);
