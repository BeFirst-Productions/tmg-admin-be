import Package from "../../models/Package.js";
import cloudinary from "../../config/cloudinary.js";

/* ─────────────────────────────────────────────
   CREATE Package
───────────────────────────────────────────── */
export const createPackage = async (req, res) => {
  try {
    const {
      title,
      withVisaPrice1,
      withVisaPrice2,
      WithoutVisaPrice1,
      WithoutVisaPrice2,
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required." });
    }

    const newPackage = new Package({
      title,
      image: req.file.path || req.file.secure_url,
      imagePublicId: req.file.filename || req.file.public_id,
      withVisaPrice1: withVisaPrice1 ? Number(withVisaPrice1) : undefined,
      withVisaPrice2: withVisaPrice2 ? Number(withVisaPrice2) : undefined,
      WithoutVisaPrice1: WithoutVisaPrice1
        ? Number(WithoutVisaPrice1)
        : undefined,
      WithoutVisaPrice2: WithoutVisaPrice2
        ? Number(WithoutVisaPrice2)
        : undefined,
    });

    const saved = await newPackage.save();

    return res.status(201).json({
      success: true,
      message: "Package created successfully.",
      data: saved,
    });
  } catch (error) {
    console.error("Create Package Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

/* ─────────────────────────────────────────────
   GET ALL Packages  (with optional pagination)
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
    console.error("Get All Packages Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

/* ─────────────────────────────────────────────
   GET SINGLE Package by ID
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
    console.error("Get Package Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

/* ─────────────────────────────────────────────
   UPDATE Package
───────────────────────────────────────────── */
export const updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found." });
    }

    const {
      title,
      withVisaPrice1,
      withVisaPrice2,
      WithoutVisaPrice1,
      WithoutVisaPrice2,
    } = req.body;

    // Update simple fields if provided
    if (title !== undefined) pkg.title = title;
    if (withVisaPrice1 !== undefined) pkg.withVisaPrice1 = Number(withVisaPrice1);
    if (withVisaPrice2 !== undefined) pkg.withVisaPrice2 = Number(withVisaPrice2);
    if (WithoutVisaPrice1 !== undefined)
      pkg.WithoutVisaPrice1 = Number(WithoutVisaPrice1);
    if (WithoutVisaPrice2 !== undefined)
      pkg.WithoutVisaPrice2 = Number(WithoutVisaPrice2);

    // Handle new image upload — delete old one from Cloudinary first
    if (req.file) {
      if (pkg.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(pkg.imagePublicId);
        } catch (err) {
          console.warn("Cloudinary delete failed (non-fatal):", err.message);
        }
      }
      pkg.image = req.file.path || req.file.secure_url;
      pkg.imagePublicId = req.file.filename || req.file.public_id;
    }

    const updated = await pkg.save();

    return res.status(200).json({
      success: true,
      message: "Package updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Update Package Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

/* ─────────────────────────────────────────────
   DELETE Package
───────────────────────────────────────────── */
export const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found." });
    }

    // Remove image from Cloudinary
    if (pkg.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(pkg.imagePublicId);
      } catch (err) {
        console.warn("Cloudinary delete failed (non-fatal):", err.message);
      }
    } else if (pkg.image) {
      // Fallback: derive public_id from URL
      try {
        const urlParts = pkg.image.split("/");
        const versionIndex = urlParts.findIndex((p) => p.startsWith("v"));
        if (versionIndex !== -1) {
          const publicId = urlParts
            .slice(versionIndex + 1)
            .join("/")
            .replace(/\.[^/.]+$/, "");
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.warn("Cloudinary fallback delete failed:", err.message);
      }
    }

    await Package.deleteOne({ _id: pkg._id });

    return res.status(200).json({
      success: true,
      message: "Package deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Package Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};
