import { Enquiry } from "../../models/enquiryModel.js";

export const addEnquiry = async (req, res) => {
  try {
    const { firstName, lastName, email, service, message } = req.body;

    if (!firstName || !lastName || !email || !service || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newEnquiry = new Enquiry({
      firstName,
      lastName,
      email,
      service,
      message
    });

    await newEnquiry.save();
    res.status(201).json({ success: true, message: 'Enquiry added successfully', data: newEnquiry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getAllEnquiries = async (req, res) => {
  try {
    let { page = 1, limit = 8, search = "", dateFrom = "", dateTo = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    // 🔍 SEARCH BY FIRST NAME, LAST NAME, EMAIL
    if (search.trim() !== "") {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // 📅 DATE RANGE FILTER
    if (dateFrom && dateTo) {
      query.createdAt = {
        $gte: new Date(dateFrom),
        $lte: new Date(dateTo),
      };
    } else if (dateFrom) {
      query.createdAt = { $gte: new Date(dateFrom) };
    } else if (dateTo) {
      query.createdAt = { $lte: new Date(dateTo) };
    }

    const totalItems = await Enquiry.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: enquiries,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    
    res.status(200).json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
