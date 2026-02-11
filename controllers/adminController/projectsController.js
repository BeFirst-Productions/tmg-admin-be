import Project from "../../models/Project.js";
import { deleteCloudinaryImage } from "../../utils/cloudinaryHelper.js";

/**
 * CREATE PROJECT
 * POST /api/admin/projects
 */
export const createProject = async (req, res) => {
  try {
    const title = req.body.title;
    const excerpt = req.body.excerpt;
    const description = req.body.description;
    const status = req.body.status;

    if (!title || !excerpt) {
      return res.status(400).json({
        success: false,
        message: "Title and excerpt are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Project image is required",
      });
    }

    const project = await Project.create({
      title: title.trim(),
      excerpt: excerpt.trim(),
      description,
      status,
      image: req.file.path,
      imagePublicId: req.file.filename, // ✅ STORE public_id
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


/**
 * GET ALL PROJECTS
 * GET /api/admin/projects
 */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching projects" });
  }
};


/**
 * GET SINGLE PROJECT
 * GET /api/admin/projects/:id
 */
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
console.log("iddddd :",id)
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });

  } catch (error) {
    console.error("Get Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching project",
    });
  }
};

/**
 * UPDATE PROJECT
 * PUT /api/admin/projects/:id
 */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const updates = {
      title: req.body.title,
      excerpt: req.body.excerpt,
      description: req.body.description,
      status: req.body.status,
    };

    if (req.file) {
      // 🔥 Delete old image
      await deleteCloudinaryImage(existingProject.imagePublicId);

      updates.image = req.file.path;
      updates.imagePublicId = req.file.filename;
    }

    const project = await Project.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Update Project Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


/**
 * DELETE PROJECT
 * DELETE /api/admin/projects/:id
 */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 🔥 Delete Cloudinary image
    await deleteCloudinaryImage(project.imagePublicId);

    await Project.findByIdAndDelete(project._id);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


