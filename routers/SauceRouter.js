
const express = require("express");
const auth = require("../middleware/auth");
const SauceController = require("../controllers/SauceController");
const multer = require("../middleware/multer-config");

const routerSauce = express.Router();
routerSauce.get("/", auth, SauceController.findAll);
routerSauce.get("/:id", auth, SauceController.find);
routerSauce.post("/", auth, multer, SauceController.create);
routerSauce.put("/:id", auth, multer, SauceController.update);
routerSauce.delete("/:id", auth, SauceController.delete);
routerSauce.post("/:id/like", auth, SauceController.like);

module.exports=routerSauce;
