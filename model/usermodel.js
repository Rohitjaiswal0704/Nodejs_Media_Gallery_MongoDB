const mongoose = require("mongoose");

const usermodel = new mongoose.Schema({
    title:String,
    Author:String,
    Image:String,
})

const Gallery = mongoose.model("Gallery" ,usermodel)

module.exports= Gallery