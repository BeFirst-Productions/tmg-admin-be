import cloudinary from "../../config/cloudinary.js";
import { blog } from "../../models/blogModel.js";



export const createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      description,
      metaTitle,
      category,
      metaKeywords,
      metaDescription,
      canonical,
      url,
      status
    } = req.body;

    if (
      !title ||
      !excerpt ||
      !description ||
      !metaTitle ||
      !category ||
      !metaKeywords ||
      !metaDescription ||
      !canonical ||
      !url
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled."
      });
    }

    const normalizedUrl = url.trim().toLowerCase();

    if (!/^[a-z0-9-]+$/.test(normalizedUrl)) {
      return res.status(400).json({
        success: false,
        message: "URL can contain only lowercase letters, numbers, and hyphens."
      });
    }

    const urlExists = await blog.findOne({ url: normalizedUrl });
    if (urlExists) {
      return res.status(409).json({
        success: false,
        message: "URL already exists."
      });
    }

    const image = req.file ? req.file.path : null;
    const imagePublicId = req.file ? req.file.filename : null;

    const newBlog = await blog.create({
      title,
      excerpt,
      description,
      category,
      image,
      imagePublicId,   // ✅ STORED
      metaTitle,
      metaKeywords,
      metaDescription,
      canonical,
      url: normalizedUrl,
      status
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      data: newBlog
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating blog.",
      error: error.message
    });
  }
};





export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const blogs = await blog
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await blog.countDocuments();

    return res.status(200).json({
      success: true,
      message: "Blogs retrieved successfully",
      data: blogs,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message
    });
  }
};




export const getBlog = async (req, res) => {
  try {
    const blogData = await blog.findById(req.params.id);

    if (!blogData) {
      return res.status(404).json({
        success: false,
        message: "Blog not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: blogData
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const updates = req.body;

    const existingBlog = await blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found."
      });
    }

    // Required fields validation
    const requiredFields = [
      "title",
      "excerpt",
      "description",
      "category",
      "metaTitle",
      "metaKeywords",
      "metaDescription",
      "canonical",
      "url"
    ];

    for (const field of requiredFields) {
      if (!updates[field] || updates[field].trim() === "") {
        return res.status(400).json({
          success: false,
          message: `Field '${field}' is required.`
        });
      }
    }

    updates.url = updates.url.trim().toLowerCase();

    if (!/^[a-z0-9-]+$/.test(updates.url)) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format."
      });
    }

    if (updates.url !== existingBlog.url) {
      const urlExists = await blog.findOne({
        url: updates.url,
        _id: { $ne: blogId }
      });

      if (urlExists) {
        return res.status(409).json({
          success: false,
          message: "URL already exists."
        });
      }
    }

    // 🔁 Replace image safely
    if (req.file) {
      if (existingBlog.imagePublicId) {
        await cloudinary.uploader.destroy(existingBlog.imagePublicId);
      }

      updates.image = req.file.path;
      updates.imagePublicId = req.file.filename;
    }

    const updatedBlog = await blog.findByIdAndUpdate(
      blogId,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      data: updatedBlog
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating blog.",
      error: error.message
    });
  }
};





export const deleteBlog = async (req, res) => {
  try {
    const blogData = await blog.findById(req.params.id);

    if (!blogData) {
      return res.status(404).json({
        success: false,
        message: "Blog not found."
      });
    }

    if (blogData.imagePublicId) {
      await cloudinary.uploader.destroy(blogData.imagePublicId);
    }

    await blogData.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully."
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting blog.",
      error: error.message
    });
  }
};

