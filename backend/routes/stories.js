const express = require('express') ;
const router = express.Router() ;
const {getAdminStories , getStories , getStoriesFromUrl , incrementViews , createStory} = require('../queries/stories')
const validate = require('../middleware/validate') ;
const authMiddleware = require('../middleware/auth')
const upload = require('../config/cloudinary')

//public
router.get('/' , getStories)
router.get('/:url/:id' ,getStoriesFromUrl)
router.patch('/:id/view', incrementViews)

//admin
router.get('/admin/' , authMiddleware , getAdminStories)
router.post('/admin/' ,authMiddleware ,  upload.array('image_urls', 10), createStory)
