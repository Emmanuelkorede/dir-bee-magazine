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
            queryText += ` AND categories.url =$${queryParams.length}`
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


const createStory = async (req, res) => {
    try {
        // 1. Extract the text fields from the request body
        const { title, content, url, published, scheduled_date, category_id, video_urls, music_urls } = req.body;
        const admin_user_id = req.user.userId ;

        // 2. Map over the uploaded files from Multer to get their secure Cloudinary URLs
        // If no files are uploaded, default to an empty array
        const image_urls = req.files ? req.files.map(file => file.path) : [];

        // 3. Convert incoming link strings back to arrays if the frontend sends them as raw text strings
        const finalVideoUrls = typeof video_urls === 'string' ? JSON.parse(video_urls) : video_urls || [];
        const finalMusicUrls = typeof music_urls === 'string' ? JSON.parse(music_urls) : music_urls || [];

        const queryText = `
            INSERT INTO stories (
                title, content, url, published, scheduled_date, admin_user_id, category_id, video_urls, music_urls, image_urls, views
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0) 
            RETURNING *
        `;

        const queryParams = [
            title, 
            content, 
            url, 
            published === 'true' || published === true, // Ensures it saves as a boolean
            scheduled_date || null, 
            admin_user_id, 
            category_id, 
            finalVideoUrls, 
            finalMusicUrls, 
            image_urls
        ];

        const result = await pool.query(queryText, queryParams);
        res.status(201).json({ message: 'Story created successfully', result: result.rows[0] });

    } catch (err) {
        handleDbError(err, res);
    }
};

const editstory = async (req ,res) => {
    try {
        const { title, content, url, published, scheduled_date, category_id, video_urls, music_urls } = req.body;
        const {id} = req.params ;
        const admin_user_id = req.user.userId ;


        const image_urls = req.files ? req.files.map(file => file.path) : [ ] ;
        const finalVideoUrls = typeof video_urls === 'string' ? JSON.parse(video_urls) : video_urls || [] ; 
        const finalMusicUrls = typeof music_urls === 'string' ? JSON.parse(music_urls) : music_urls || [] ; 

        let queryText = `
        UPDATE stories  
        SET title = $1, content = $2, url = $3, published = $4, scheduled_date = $5, 
            admin_user_id = $6, category_id = $7, video_urls = $8, music_urls = $9, image_urls = $10 
        WHERE id = $11 
        RETURNING *
        `;

        let queryParams = [
        title, content, url, 
        published === 'true' || published === true, 
        scheduled_date || null, 
        admin_user_id, category_id, 
        finalVideoUrls, finalMusicUrls, image_urls, 
        id
        ];
        
        const result = await pool.query(queryText , queryParams) ;
        res.status(200).json({ message : 'story updated succesfully ' , result : result.rows});
    } catch(err) {
        handleDbError(err , res) 
    }
}

const deleteStory = async (req , res) => {
    try {
        const {id} = req.params ; 
        const result = await pool.query('DELETE FROM stories WHERE id = $1' , [id]) ; 
        res.status(200).json({ message : 'story deleted succesfully '});
    } catch(err) {
        handleDbError(err , res) 
    }
}



module.exports = {getAdminStories , getStories , getStoriesFromUrl , incrementViews , createStory , deleteStory , editstory}