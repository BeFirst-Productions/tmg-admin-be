import mongoose from "mongoose";
const enquirySchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    
  },
  lastName: {
    type: String,
    required: true,

  },
  email: {
    type: String,
    required: true,

  },
  message: {
    type: String,
    required: true,
  },
  enquiryDate: {
    type: Date,
    default: Date.now()
  }
}, { timestamps: true });

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
