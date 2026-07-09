const pool = require('../db') ;
const jwt = require('jsonwebtoken') ;
const bcrypt = require('bcrypt')
const handleDbError = require('../middleware/dberror') ;

const createUser = async (req , res) => {
    try {
        const {email , name , password} = req.body ; 
        const hashedPassword = await bcrypt.hash(password , 10) ; 
        const result = await pool.query('INSERT INTO  users(email , name , password) VALUES ($1 ,$2 , $3) RETURNING *' , [email , name , hashedPassword]) ;
        const newUser = result.rows[0]
        const token = jwt.sign(
            {userId : newUser.id , userEmail : newUser.email} , 
            process.env.JWT_SECRET ,
            {expiresIn :  process.env.JWT_EXPIRES_IN}
        ) ;
        res.status(201).json(
            {
                messge : 'User registered succesfully',
                token ,
                user  : {
                    id : user.id ,
                    name : user.name ,
                    email : user.email
                }
            }
        ) ; 
    } catch(err) {
        handleDbError(err ,res)
    }
}

const login = async (req , res) => {
    try {
        const {email , password} = req.body ; 
        const result = await pool.query('SELECT * FROM users WHERE email = $1' , [email]) ; 
        const user = result.rows[0]
        if(!user) return res.status(404).json({messge : 'invalid email or password'}) ; 
        const validpassword = await bcrypt.compare(password , user.password) ;
        if(!validpassword) return res.status(404).json({messge : 'invalid email or password'}) ; 

        const token = jwt.sign(
            {userId : user.id , userEmail : user.email} , 
            process.env.JWT_SECRET ,
            {expiresIn :  process.env.JWT_EXPIRES_IN}
        ) ;

        res.status(200).json(
            {messge : 'Login succesfull' ,
            token ,
            user  : {
                id : user.id ,
                name : user.name ,
                email : user.email
            }
        }
        ) ; 
    } catch(err) {
        handleDbError(err ,res)
    }
}