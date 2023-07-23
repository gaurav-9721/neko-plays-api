const express = require("express")
const dotenv = require('dotenv')
const mongoose = require("mongoose")
const cors = require('cors');
const app = express();


app.use(express.json())
app.use(cors({
    origin: "https://neko-plays.onrender.com",
    credentials: true,
    
}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(require("./Route/register"))
app.use(require("./Route/login"))
app.use(require("./Route/profile"))

// if (process.env.NODE_ENV === 'production') {
//     //*Set static folder up in production
//     app.use(express.static('client/build'));

//     app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, 'client', 'build','index.html')));
//   }
  
dotenv.config({ path: "./config.env" });

const DB_URL = process.env.DATABASE_URL;

// console.log(DB_URL)
mongoose.connect(DB_URL, {
    useNewURLParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false
}).then(() => {

    console.log("MongoDB Connection Successful")
}).catch((err) => {
    console.log(err)
    console.log("MongoDB Connection Failed")
});


app.listen(process.env.PORT || 5000, () => {
    console.log("The server is running at port 5000");
});