import express from 'express'
import { getGalleryImages } from '../../controllers/publicController/galleryController.js'

const galleryRoute =express.Router()

galleryRoute.get('/get-images',getGalleryImages)

export default galleryRoute