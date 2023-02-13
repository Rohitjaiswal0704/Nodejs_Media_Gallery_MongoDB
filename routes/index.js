var express = require("express");
var router = express.Router();
const upload = require("./multer");
const fs = require("fs");
const path = require("path");

const Gallery = require("../model/usermodel")

/* GET home page. */
router.get("/", function (req, res, next) {
  Gallery.find()
  .then((cards)=>{
    res.render("show", {cards});
  })
  .catch((err)=> res.send(err))
});
router.get("/add", function (req, res, next) {
  res.render("add");
});

router.post("/add", function (req, res, next) {
  upload(req, res, function (err) {
    if (err) return res.send(err);
  
    Gallery.create ({
      title: req.body.title,
      Author: req.body.Author,
      Image: req.file.filename,
    })
    .then(()=>{
      res.redirect("/");
    })
    .catch((err)=> res.send(err))
    // res.json({...req.body,...req.file});
  })
  
});

// ----------------card-delete-------------------

// router.get("/delete/:id", function (req, res, next) {
//   const id = req.params.id;

//   let findindex = LOCAL_DB.findIndex((task) => {
//     return task.id === id;
//   });

//   LOCAL_DB.splice(findindex, 1);

//   res.redirect("/");
//   // res.json({findindex})
// });

// ---------------------------------
router.get("/update/:id", function (req, res, next) {
  Gallery.findById((req.params.id))
  .then((card)=>{
    res.render("update", { card});
  })
  .catch((err)=> res.send(err))

});

// ----------------------------------------------
router.post("/update/:id", function (req, res, next) {
  upload(req, res, function (err){
    if (err) return res.send(err);

    const updatedData = {
      title: req.body.title,
      Author: req.body.Author,
    };

    if (req.file) {
      fs.unlinkSync(
        path.join(__dirname, "..", "public", "upload", req.body.oldgallery)
      );
      updatedData.Image = req.file.filename;
    };
     Gallery.findByIdAndUpdate(req.params.id, updatedData)
     .then(()=> {
      res.redirect("/");
     })
     .catch((err)=> res.send(err))
  });
});

// --------------------------------------------------------
router.get("/delete/:id", function (req, res, next) {
  Gallery.findByIdAndDelete(req.params.id)
  .then((deletedData)=>{
    fs.unlinkSync(
      path.join(__dirname, "..", "public", "upload", deletedData.Image)
    );
    res.redirect("/");
  })
  .catch((err)=> res.send(err))
});

module.exports = router;
