const express = require('express') ;
const app = express() ;
const cors = require('cors') ;
require('dotenv').config() ;
const PORT = process.env.PORT || 8000 ;

app.use(cors) ;
app.use(express.json()) ;



app.listen((req , res) => {
    console.log(`${req.method} ${req.url} not found`)
})

app.listen(PORT  , () => {
    console.log('sever running at http://localhost/') ;
})