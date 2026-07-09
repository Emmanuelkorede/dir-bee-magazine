const express = require('express') ;
const router = express.Router() ;
const {getAdminStories , getStories , getStoriesFromUrl , incrementViews} = require('../queries/stories')
const validate = require('../middleware/validate') ;
const authMiddleware = require('../middleware/auth')

router.get('/' , getStories)
router.get('/admin/' , getAdminStories)
router.get('/:url/:id' ,getStoriesFromUrl)
router.patch('/:id/view', incrementViews)