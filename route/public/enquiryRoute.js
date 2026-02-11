import express from 'express'
import { addEnquiry } from '../../controllers/publicController/enquiryController.js'
const enquiryRoute =express.Router()

enquiryRoute.post('/save-enquiry',addEnquiry)

export default enquiryRoute