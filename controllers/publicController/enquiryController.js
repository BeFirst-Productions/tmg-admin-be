import { Enquiry } from "../../models/enquiryModel.js";

export const addEnquiry = async (req, res) => {
  try {
    console.log(req.body);
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email  || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newEnquiry = new Enquiry({
      firstName,
      lastName,
      email,
      message
    });

    await newEnquiry.save();
    res.status(201).json({ success: true, message: 'Enquiry added successfully', data: newEnquiry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
