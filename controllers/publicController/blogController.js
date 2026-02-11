import { blog } from "../../models/blogModel.js";

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




// export const getBlog = async (req, res) => {
//   try {
//     const blogData = await blog.findById(req.params.id);

//     if (!blogData) {
//       return res.status(404).json({
//         success: false,
//         message: "Blog not found."
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: blogData
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };


export const getBlogByUrl = async (req, res) => {
  try {
    
    const blogData = await blog.findOne({
      url: req.params.slug,
      status: "published",
    });

    if (!blogData) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blogData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

