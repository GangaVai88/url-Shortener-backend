// My first backend Project... Little much more commenting on this to learn things and come back to be better everyday
/*General preffered workflow => 
    Imports => Database connection and app initialisation => Global middlewares(pre-routing) => Global Auth(optional) => 
    Routes and route specific middlewares (Authentication => Authorisation => route logic) => 
    Error handling middleware => Server listen
*/

require('dotenv').config();// Makes the environment variables from .env file readable by app

const express = require('express');
const app = express();// app initialisation
const mongoose = require('mongoose');
const {nanoid} = require('nanoid');
//CORS=> Cross-Origin Resource Sharing. By default, browsers use a strict security rule: a web page running on Domain A cannot make an API request to Domain B unless Domain B explicitly gives permission.
const cors = require('cors');
const auth = require('./middleware/auth');

const Url = require('./models/url');
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI); // mongoose.connect() helps connect the nodejs prog to the database... If mongodb isn't installed it throws error from port 27017
        // process is a global object that represents the running nodejs process and gives control over it.
        console.log("MongoDB connected");
        //A MONGO_URI is a connection string that tells your Node.js application exactly where your MongoDB database lives and how to securely log into it.
    } catch(error){
        console.log("Database connection failed",error.message);
        process.exit(1);//stops the server if it can't reach the database
    }
}
connectDB();

app.use(express.json()); // Global middleware that allows us to parse JSON bodies
const allowedOrigins = [
  'http://localhost:5173', // Your local Vite dev server
  'https://url-shortener-backend-henna-psi.vercel.app' // Replace this with your actual Vercel URL once deployed
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.includes('vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true
}));

//Authentication routing
app.use('/api', require('./routes/registration'));
app.use('/api', require('./routes/login'));

//ROUTE LOGIC

app.post('/api/shorten', auth,  async (req,res,next)=>{// To use await keyword, function must be asynchronous
    try{
        const {longUrl} = req.body; // Industry standard for getting the value of a single key in an object given by user input
        if(!longUrl){ //Halts the execution with 'return' and sends an error status to the frontend
            return res.status(400).json({error: "Url field cannot be empty!"}); // although the json part isn't mandatory, it tells the frontend exactly why the error popped up
        }
        if(!urlRegex.test(longUrl)){
            return res.status(400).json({error: "Not a valid URL format"});
        }
        const exists = await Url.findOne({longUrl});
        if(exists){
            return res.status(200).json(exists);
        }
        else{
            const id = nanoid(6); // Generates a random 6 letter id that can be used to encode the url instead of the long url
            const newurl = new Url({
                longUrl : longUrl,
                urlCode : id,
                createdBy : req.userId
            })
            await newurl.save(); // Asynchronous as the server has to talk to db across the internet
            res.status(201).json(newurl); // sends info to the frontend that info is stored in db, and shows the info
        }
    }
    catch (error){
        next(error);// skips all functions with three args and jumps directly to the one with 4 arguements
    }
})

//GET request
app.get('/:urlCode', async (req,res,next) => { // The path here is a dynamic path as we have used a colon after /...
    try{
        const { urlCode } = req.params;
        console.log("--- DEBUG START ---");
        console.log("Captured urlCode from URL params:", urlCode);
        //In JS if keyname and variable are identical, you can just condense the code
        const exists = await Url.findOne({ urlCode });
        console.log("MongoDB query result:", exists);
        console.log("--- DEBUG END ---");
        if (!exists) {
            const error = new Error("The URL code is invalid");
            error.statusCode = 404;
            return next(error);
        } else {
            //The exists variable is no longer null, it contains the entire document object pulled from MongoDB Atlas
            res.redirect(exists.longUrl);
        }
    }
    catch (error){
        next(error);
    }
})

//Error Handling
app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500; //If err.statusCode is undefined, it stores 500, otherwise stores the statusCode
    res.status(statusCode).json({
        error: err.message || "Internal Server Error"
    });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
})