import { getSeo } from '../../controllers/publicController/seoController.js'
import express from 'express'

const seoRoute =express.Router()

seoRoute.get('/get-seo',getSeo)

export default seoRoute