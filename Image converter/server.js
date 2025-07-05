const express = require("express")
const path = require("path")

// const multer = require("multer");
const port = 350;
const app = express()

const staticRoute = require("./routes/staticRoute")
const postRoute = require("./routes/postRoute");

app.use(express.urlencoded({extended:false}))
app.use("/uploads",express.static("uploads"))
app.use("/converted",express.static("converted"))
app.use("/static",express.static("static"))
//views
app.set("view engine","ejs")
app.set("views",path.resolve(__dirname,"./views"))


app.use("/",staticRoute)
app.use("/",postRoute)


app.listen(port,()=>{console.log("server is started at port 350")})