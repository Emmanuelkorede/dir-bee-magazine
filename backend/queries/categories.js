const pool = require('../db') ;
const handleDbError = require('../middleware/dberror') ;

const getCategories = (req , res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY created_at DESC' ) ;
        res.status(201).json({ result : result.rows}) ; 
    } catch(err) {
        handleDbError(err , res)
    }
}

const createCategory = (req , res) => {
    try {
        const {name , url} = req.body ;
        const result = await pool.query('INSERT INTO  categories( name , url) VALUES ($1 ,$2 , ) RETURNING *' , [ name , url]) ;
        res.status(201).json({messge : 'Category Created' , result : result.rows}) ; 
    } catch(err) {
        handleDbError(err ,res)
    }
}

const deleteCategory =  (req , res) => {
    try {
        const {id} = req.params ;
        const result = await pool.query('DELETE FROM categories WHERE id = $1 ' , [id]) ;
        res.status(201).json({messge : 'Category deleted'}) ; 
    } catch(err) {
        handleDbError(err ,res)
    }
}

const editCategory =  (req , res) => {
    try {
        const {name , url} = req.body ;
        const {id} = req.params ;
        const result = await pool.query('UPDATE categories set name = $1 , url =$2 WHERE id = $2 ' , [name , id , url , id]) ;
        res.status(201).json({messge : 'Category edited'}) ; 
    } catch(err) {
        handleDbError(err ,res)
    }
}

module.exports( createCategory , deleteCategory , getCategories , editCategory)