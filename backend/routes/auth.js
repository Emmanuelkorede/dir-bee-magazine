const express = require('express') ;
const router = express.Router() ;
const {createUser , login} = require('../queries/auth') ;
const validate = require('../middleware/validate') ;

const createUserRules = [
    { field : 'name',  required : true , type : 'string'  }, 
    { field : 'email',      required : true , type : 'string' }, 
    { field : 'password',   required : true , type : 'string', minLength : 3, maxLength : 50 },
]

const loginRules = [
    { field : 'email',      required : true , type : 'string' }, 
    { field : 'password',   required : true , type : 'string', minLength : 3, maxLength : 50 },
]

router.post('/register' ,validate(createUserRules) , createUser) ;
router.post('/login' , validate(loginRules) , login)




module.exports = router ;