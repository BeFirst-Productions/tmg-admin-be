import mongoose from "mongoose";

const seoSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
    },

    innerPage: {
      type: String,
      default: null,
    },

    title: {
      type: String,
      required: true,
    },

    keywords: {
      type: [String],   
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    canonical: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export const seo= mongoose.model("SeoMeta", seoSchema);
