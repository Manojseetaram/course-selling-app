const express = require("express")
const mongoose =require("mongoose");
const {userRouter} =require("./routes/user")
const{adminRouter} = require("./routes/admin")
const {PORT,MONGO_URL} =require("./config");
const session = require('express-session');
const passport = require('passport');

const app = express();
  app.use(session({secret :'cats',resave :false,saveUninitialized :true}));
  app.use(passport.initialize());
  app.use(passport.session());

require('dotenv').config()

app.use(express.json());

app.use("/api/v1/user", userRouter)


app.use("/api/v1/admin",adminRouter)

async function connection(){
try{
    await mongoose.connect(MONGO_URL);
      
    console.log("Connected to the database");
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}/api/v1/user/auth/google`)
})
}catch(error){
    console.error("Failed to connect to the database",error)
    process.exit(1)
}
}
connection();

     