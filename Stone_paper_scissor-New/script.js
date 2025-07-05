
playGame()
function playGame() {

    let userIconsbox = document.querySelector(".userIcons-box")
    userIconsbox.addEventListener("click", function (e) {
        // console.log(e.target)
        handAnimation()
        let userSrc = e.target.src
        let userId = e.target.id
        console.log(userId)
        
        let compterGuess = generateNo()
        let computerSrc = generateSrc(compterGuess)
        let result = check(userId, compterGuess)
        console.log(result)
        displayMessage(result)
        displayImg(computerSrc, userSrc, result)

    })
    function handAnimation() {
        let letfSrc = document.getElementById("userSrc")
        // let rightsrc = document.getElementById("CompSrc")
        // console.log(letfSrc)
        letfSrc.style.animation = "move-img1 0.5s"

    }
    function generateNo() {
        let no = Math.floor((Math.random() * 3 + 1))
        let comGuess
        // console.log(no)
        if (no == 1) {
            comGuess = "p"
        }
        else if (no == 2) {
            comGuess = "s"
        }
        else {
            comGuess = "sc"
        }
        return comGuess
    }

    function generateSrc(guess) {
        let imgSrc = document.getElementById(`${guess}`)
        console.log(imgSrc.src)
        return imgSrc.src
    }

    function check(userId, comGuess) {
        if (userId === comGuess) {
            return "Game is Draw"
        }
        else if (userId == "p") {
            if (comGuess == "s") {
                return "You Won"
            }
            else {
                return "You Lose The Game"
            }

        }
        else if (userId == "s") {
            if (comGuess == "p") {
                return "Computer Won"
            }
            else {
                return "You Won"
            }

        }
        else if (userId == "sc") {
            if (comGuess == "p") {
                return "You Won"
            }
            else {
                return "You are Lose"
            }

        }
    }
    function displayMessage(message) {
        setTimeout(() => {
            let h2 = document.querySelector("h2")
            h2.innerHTML = `${message}`
        }, 500)

    }
    function displayImg(comSrc, userSrc, result) {
        let letfSrc = document.getElementById("userSrc")
        let rightsrc = document.getElementById("CompSrc")
        // let btn = document.querySelector("button")
        setTimeout(() => {
            // btn.style.display = "block"
            if (result === "You Won") {
                console.log("hello")
                let box = document.querySelector(".box")
                box.style.background = "linear-gradient( to bottom right, rgb(0, 30, 255),rgb(14, 222, 87))"
            }
            // else{
            //      let box = document.querySelector(".box")
            //     box.style.background = " linear-gradient( to bottom right, rgb(167, 229, 11),rgb(244, 9, 9))"
            // }

            playAgain(letfSrc, rightsrc)

            letfSrc.src = `${userSrc}`
            rightsrc.src = `${comSrc}`
           
        }, 500)

    }

}

function playAgain(letfSrc, rightsrc) {

    setTimeout(() => {
        let box = document.querySelector(".box")
        box.style.background = "linear-gradient( to bottom right, rgb(149, 11, 229),rgb(0, 153, 255))"
        letfSrc.src = "assets/image/stone-removebg-preview.png"
        rightsrc.src = "assets/image/stone-removebg-preview.png"
        let h2 = document.querySelector("h2")
        h2.innerHTML = "Let's Play!!"
    }, 1200);

    // let btn = document.querySelector("button")
    // btn.addEventListener("click", (e) => {
    //     letfSrc.src = "assets/image/stone-removebg-preview.png"
    //     rightsrc.src = "assets/image/stone-removebg-preview.png"
    //     btn.style.display = "none"
    //     

    // })
}