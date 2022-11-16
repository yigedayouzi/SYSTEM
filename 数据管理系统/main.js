const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
const cors = require('cors')


const corsConfig = {
    origin:'http://localhost:8080',
    credentials:true,
  }
  //使用默认
  app.use(cors())
  //或修改默认配置
  app.use(cors(corsConfig))
  
//引入users.js
const users = require("./routes/api/users");

//引入profile
const profiles = require("./routes/api/profiles");

//DB config
const db = require("./config/keys").mongoURL;

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//connect to mongodb
mongoose.connect(db)
         .then(() => console.log("mongodb connected"))
         .catch(err => console.log("err"));


//passport初始化
app.use(passport.initialize());


require("./config/passport")(passport);

//app.get("/",(req,res) => {
//res.send("Hello World");
//})

//使用routes
app.use("/api/users",users);

app.use("/api/profiles",profiles);

const port = process.env.PORT||5000;

app.listen(port,()=>{
 console.log('Server running');
})