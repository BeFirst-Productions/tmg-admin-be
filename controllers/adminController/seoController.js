import { seo } from "../../models/seoModel.js";

// CREATE or UPDATE SEO
export const saveSeo = async (req, res) => {
  try {
    let { page, innerPage, title, keywords, description, canonical } = req.body;
    
    // Ensure keywords is ALWAYS an array
    const keywordArray = Array.isArray(keywords)
      ? keywords
      : keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0);

    const filter = { page, innerPage: innerPage || null };

    const update = {
      page,
      innerPage: innerPage || null,
      title,
      keywords: keywordArray,
      description,
      canonical,
    };

    // USE MODEL SeoMeta
    const seoData = await seo.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });


    res.json({
      success: true,
      message: "SEO data saved successfully!",
      data: seoData,
    });

  } catch (error) {
    console.error("SAVE SEO ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
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