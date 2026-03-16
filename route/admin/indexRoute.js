import express from 'express'
import userRoute from './userRoute.js'
import authRoute from './authRoute.js'
import blogRoute from './blogRoute.js'
import analyticsRoute from './analyticsRoute.js'
import settingsRoute from './settingsRoute.js'
import projectRoute from './projectRoute.js'
// import faqRoute from './faqRoute.js'
// import enquiryRoute from './enquiryRoute.js'
// import newsletterRoute from './newsletterRoute.js'
import packageRoute from './packageRoute.js'
// import seoRoute from './seoRoute.js'
import galleryRoute from './galleryRoute.js'
// import heroRoute from './heroRoute.js'
const adminroute =express.Router()
adminroute.use('/user',userRoute)
adminroute.use('/auth',authRoute)
adminroute.use('/blog',blogRoute)
adminroute.use('/settings', settingsRoute);
adminroute.use('/analytics', analyticsRoute);
adminroute.use('/projects', projectRoute);
// adminroute.use('/faq',faqRoute)
// adminroute.use('/enquiry',enquiryRoute)
// adminroute.use('/newsletter',newsletterRoute)
adminroute.use('/packages',packageRoute)
// adminroute.use('/seo',seoRoute)
adminroute.use('/gallery',galleryRoute)
// adminroute.use('/herosection',heroRoute)
export default adminroute