
const express = require("express");
const Path = require("path");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const SauceRouter = require("./routers/SauceRouter");
const UserRouter = require("./routers/UserRouter");

mongoose.connect("mongodb+srv://azerty789WXC:azerty789WXC@cluster0.b72qz.mongodb.net/hottakes?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true 
    })
    .then(() => console.log("Connexion OK") )
    .catch(() => console.log("Connexion KO"));

const app = express();
app.use(express.json());
//app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use("/images", express.static(Path.join(__dirname, "images")));
app.use("/api/sauces", SauceRouter);
app.use("/api/auth", UserRouter);

module.exports=app;
