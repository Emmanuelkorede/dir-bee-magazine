const pool = require('../db') ;
const handleDbError = require('../middleware/dberror') ;

//public 
const getStories = async (req, res) => {
    try {
        const { category_url, q } = req.query; 
        let queryText = `
         SELECT stories.* , categories.name AS category_name 
         FROM stories 
         JOIN categories ON stories.category_id = categories.id
         WHERE stories.published = true
        ` ;

        let queryParams = [] ;  
        if(category_url) {
            queryParams.push(category_url) 
            queryText += `AND categories.url =$${queryParamns.length}`
        }

        if (q) {
            queryParams.push(`%${q}%`);
            queryText += ` AND (stories.title ILIKE $${queryParams.length} OR stories.content ILIKE $${queryParams.length})`;
        }

        queryText += ' ORDER BY stories.created_at DESC';

        const result = await pool.query(queryText, queryParams);
        res.status(200).json({ result: result.rows });
    } catch(err) {
        handleDbError(err, res);
    }
}

const getStoriesFromUrl = async (req , res) => {
    try {
        const { url , id } = req.params ; 
        const result = await pool.query('SELECT * FROM stories WHERE url=$1 AND id = $2' , [url  , id]) ; 
        res.status(200).json({ result : result.rows[0] });
    } catch(err) {
        handleDbError(err , res) 
    }
}

//admin
const getAdminStories = async (req , res) => {
    try {
        const { status} = req.query ; 
        let queryText = 'SELECT * FROM stories' ;
        if(status === 'published') {
            queryText+= ' WHERE published = true' ;
        } else if (status === 'draft') {
            queryText+= ' WHERE published = false' ;
        }
         queryText += ' ORDER BY created_at DESC'
        const result = await pool.query(queryText) ;
        res.status(200).json({ result : result.rows });
    } catch(err) {
        handleDbError(err , res) 
    }
}


const incrementViews = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(
            'UPDATE stories SET views = COALESCE(views, 0) + 1 WHERE id = $1', 
            [id]
        );
        res.status(200).json({ message: 'View counted' });
    } catch (err) {
        handleDbError(err, res);
    }
};

module.exports = {getAdminStories , getStories , getStoriesFromUrl , incrementViews}