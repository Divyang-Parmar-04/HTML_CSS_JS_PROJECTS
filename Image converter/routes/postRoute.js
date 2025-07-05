
const express = require("express")
const router = express.Router()
const fs = require("fs")
const upload = require("../multer/multer")
const path = require("path")
const sharp = require("sharp")

router.post("/upload",upload.single("Image"),async(req,res)=>{

    if(!req.file) return res.json({msg:"file not found"})
         
    const outputFormat = req.body.format // geting outputfile format
    const inputpath = req.file.path // path of file

    const outputfilename = `converted-${Date.now()}.${outputFormat}` //output file name
    
    const outputpath = path.join("converted",outputfilename) // store converted file into converted folder with name of outputfilename

    try{
        await sharp(inputpath).toFormat(outputFormat).toFile(outputpath) // filepath.format(e.g jpg,png).foldername where you want to store file
        // console.log(inputpath)
        // console.log(outputfilename)
        return res.render("index.ejs",{convertedImage:outputfilename})
      
    }
    catch(error){return res.json({msg:"post request error"})}
    
})

module.exports = router