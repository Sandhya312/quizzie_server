
require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 5000;
const connectDb = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connect to database
connectDb();

const app = express();


//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors("Access-Control-Allow-Origin:*",));



// Routes
app.use('/auth',require('./routes/authRoutes'));
app.use('/api/quiz',require('./routes/quizRoutes'));


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})




