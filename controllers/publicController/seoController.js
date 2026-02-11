import { seo } from "../../models/seoModel.js";

export const getSeo = async (req, res) => {
  try {
    const { page, innerPage } = req.query;

    const seoData = await seo.findOne({
      page,
      innerPage: innerPage && innerPage.trim() !== "" ? innerPage : null
    });

    if (!seoData) {
      return res.status(404).json({ success: false, message: "SEO not found" });
    }

    res.json({ success: true, data: seoData });

  } catch (error) {
    console.error("GET SEO ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};