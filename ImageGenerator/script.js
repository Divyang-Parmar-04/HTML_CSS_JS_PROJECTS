let input = document.querySelector("#select")
let generate = document.querySelector("button")
let section = document.querySelector(".section2")
let prompt = document.querySelector("input")

//++++++++++++++++ it take input from user and call functions and call API function ++++++++++++++++++
generate.addEventListener("click", function (e) {
    e.preventDefault();
    let value = parseInt(input.value)
    let prom = prompt.value;
    console.log(prom)
    section.innerHTML = ""
    for (i = 1; i <= value; i++) {
        createBox(i)
    }
    let bufferbox = document.querySelector(".buffer")
    // console.log(bufferbox)
    for (i = 1; i <= value; i++) {
        imageCall(i, bufferbox, prom)
    }
   
    // imageGenerate()
    DownloadImage(true)
    prompt.value = ""
})

// ++++++++++++++++++++ it create box wiht given input ++++++++++++++++

function createBox(i) {
    let box = document.createElement("div")
    box.className = "box"
    box.id = `box${i}`
    box.innerHTML = `<div class="buffer"></div>
     <img src="" alt="" id=rimg${i} class= "rimg">
     <div class="download" id=download${i}>
            <img src="assets/icons/icon.svg" alt="" class="down" id=down${i}>
        </div>`
    section.appendChild(box);
}
// ++++++++++++++++++ it show download icon for download the image ++++++++++++++
function DownloadIcon() {
    let download = document.querySelectorAll(".download").forEach((item)=>{
        item.style.display = "none"
    })
    let rimg = document.querySelectorAll(".rimg")
    rimg.forEach((item)=>{
        let src = item.src.split(":")[0]
        if(src == "blob"){
            let box = item.closest(".box")
            let d = box.querySelector(".download")
            // console.log(d,"closest")
            d.style.display = "block"
        }
    })
}
function DownloadImage(data) {
    if (data) {
        let down = document.querySelectorAll(".down")
        down.forEach((item) => {
            item.addEventListener("click", function (e) {
                e.preventDefault();
                // console.log(e.target.closest(".box"))
                let b = e.target.closest(".box")
                let imgsrc = b.querySelector(".rimg").src
                console.log(imgsrc ,"imgsrc")
                const link = document.createElement("a")
                link.href = imgsrc;
                link.download = new Date().getTime();
                link.click();
            })
        })
    }
}

// +++++++++++++++++++++ API Call function ++++++++++++++++++++++++

function imageCall(n, bufferbox, prom) {
    // let box = document.querySelector(`#box${n}`)
    let img = document.querySelector(`#rimg${n}`)
    query(prom).then((response) => {
        const objectImage = URL.createObjectURL(response);
        img.src = objectImage
        console.log(response)
        if (response) {
            DownloadIcon();
            bufferbox.style.display = "none";
        }
    });
    // input.value = ""
    async function query(prompt) {
        try {
            const response = await fetch(
                
                "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
                // "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
                {
                    headers: { Authorization: `${process.env.API}` },
                    method: "POST",
                    body: JSON.stringify({ "inputs": `${prompt}` }),
                }
            );

            const result = await response.blob();
            return result;
        }
        catch (error) {
            alert("Image not found")
        }
    }
}


