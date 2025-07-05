let fbtn = document.querySelectorAll(".fbtn")
fbtn.forEach((item)=>{
    // console.log(item)
    item.addEventListener("click", function(e){
        let leftbox = document.querySelector(" .leftbox-head")
        let cleft =window.getComputedStyle(leftbox).left
        // console.log(typeof(cleft))
        if(cleft == "-190px"){
            leftbox.style.left = "9px"
        }
        else{
            leftbox.style.left = "-190px"
        }
    })
})

