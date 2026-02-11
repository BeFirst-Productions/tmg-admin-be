import express from 'express'
import { getFAQs } from '../../controllers/publicController/faqController.js'
const faqRoute =express.Router()

faqRoute.get('/get-all-faqs/:faq',getFAQs)


export default faqRoute 