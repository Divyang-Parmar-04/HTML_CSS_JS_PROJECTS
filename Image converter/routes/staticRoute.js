const express = require("express")
const router = express.Router()

router.get("/index",(req,res)=>{
    return res.render("index.ejs")
})

module.exports = router
