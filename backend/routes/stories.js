const express = require('express') ;
const router = express.Router() ;
const {getAdminStories , getStories , getStoriesFromUrl , incrementViews , createStory , deleteStory , editstory , getAdminStoryById} = require('../queries/stories')
const validate = require('../middleware/validate') ;
const authMiddleware = require('../middleware/auth')
const upload = require('../config/cloudinary')

//admin
router.get('/admin/' , authMiddleware , getAdminStories)
router.get('/admin/:id' , authMiddleware , getAdminStoryById)
router.post('/admin/' ,authMiddleware ,  upload.array('image_urls', 10), createStory)
router.delete('/admin/:id' ,authMiddleware ,deleteStory ) ; 
router.patch('/admin/:id' ,authMiddleware ,upload.array('image_urls', 10) ,   editstory)

//public
router.get('/' , getStories)
router.get('/:url/:id' ,getStoriesFromUrl)
router.patch('/:id/view', incrementViews)




module.exports = router
