import mongooseInstance from "../config/mongooseInstance.js";


const faqSchema = new mongooseInstance.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      default: false, 
    },
    order: {
      type: Number,
      default: 0, 
    },
  },
  { timestamps: true }
);

export const FAQ = mongooseInstance.model("FAQ", faqSchema);
