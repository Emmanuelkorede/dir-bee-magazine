const express = require('express') ;
const app = express() ;
const cors = require('cors') ;
require('dotenv').config() ;
const PORT = process.env.PORT || 8000 ;
const {errorHandler} = require('./middleware/errorHandler') ;

app.use(cors()) ;
app.use(express.json()) ;

app.use('/auth' , require('./routes/auth'))

app.use(errorHandler)


app.use((req , res) => {
    console.log(`${req.method} ${req.url} not found`)
})

app.listen(PORT  , () => {
    console.log(`sever running at http://localhost:${PORT}/`) ;
})