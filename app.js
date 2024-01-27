
require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 5000;
const connectDb = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connect to database
connectDb();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // or an array of allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 204,
  };
  

  

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//     cors({
//       origin: ["http://localhost:5173"],
//       allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
//       credentials: true,
//     })
//   )
app.use(cors());



// Routes
app.use('/auth',require('./routes/authRoutes'));
app.use('/api/quiz',require('./routes/quizRoutes'));


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})




