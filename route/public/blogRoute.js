import express from 'express'
import { getBlogByUrl, getBlogs } from '../../controllers/publicController/blogController.js'

const blogRoute =express.Router()

blogRoute.get('/get-blogs',getBlogs)
blogRoute.get("/get-blog/:slug",getBlogByUrl)


export default blogRoute