import Package from "../../models/Package.js";

/* ─────────────────────────────────────────────
   GET ALL Packages (public – no auth required)
───────────────────────────────────────────── */
export const getAllPackages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Package.countDocuments();
    const packages = await Package.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Packages fetched successfully.",
      count: packages.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: packages,
    });
  } catch (error) {
    console.error("Public Get All Packages Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

/* ─────────────────────────────────────────────
   GET SINGLE Package by ID (public)
───────────────────────────────────────────── */
export const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found." });
    }

    return res.status(200).json({ success: true, data: pkg });
  } catch (error) {
    console.error("Public Get Package Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};
