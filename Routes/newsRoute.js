import express from "express"
import {getNews,getDetailnews,getCategorynews} from "../controllers/newsController.js"

const router=express.Router()


router.get('/',getNews)
router.get('/detailnews/:slug',getDetailnews)


router.get('/category',getCategorynews)



export default router
