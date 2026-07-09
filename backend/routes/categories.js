const express = require('express') ;
const router = express.Router() ;
const { createCategory , deleteCategory , getCategories , editCategory}  = require('../queries/categories') ;
const validate = require('../middleware/validate') ;
const authMiddleware = require('../middleware/auth')


const createCatRules = [
    { field : 'name',      required : true , type : 'string' }, 
    { field : 'url',   required : true , type : 'string', },
]

router.post('/' ,authMiddleware , validate(createCatRules) , createCategory) ;
router.delete('/:id' ,authMiddleware ,  deleteCategory) ;
router.gey('/' ,authMiddleware , getCategories) ;
router.patch('/:id' ,authMiddleware , editCategory)



module.exports = router ;