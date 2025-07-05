console.log("hello world");
let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    // Round the seconds to the nearest whole number
    const totalSeconds = Math.round(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Pad single digit minutes and seconds with leading zeroes
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time string
    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {

    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5501/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img src="assets/music.svg" alt="" class="invert">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>
                                divyang</div>
                            </div>
                            <div class="playnow">
                                <span>playnow</span>
                                <img src="assets/play.svg" alt="" class="invert ">
                            </div>
                        </li>`;
    }

    //Attach an event listener to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs
}

const playMusic = (track, pause = false) => {
    //    let audio =new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "assets/pause.svg"

    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbuams() {
    let a = await fetch(`http://127.0.0.1:5501/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card-container")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        // Array.from(anchors).forEach(async e => {
        //    console.log(e.href)
        if (e.href.includes("/songs/")) {
            // console.log(e.href)
            let folder = e.href.split("/").slice(-2)[1]
            //  get metadata of folder
            let a = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder ="${folder}" class="card ">
                                <div class="play-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
                                        <rect width="24" height="24" rx="12" fill="#1ed760" />
                                        <polygon points="10,7 16,12 10,17" fill="black" />
                                    </svg>
        
                                </div>
                                <img src="/songs/${folder}/cover.jpeg" alt="">
                                <h2>${response.title}
                                <p>${response.description}</p>
                            </div>`

        }

    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}


async function main() {

    playMusic
    songs = await getSongs("songs/Bollywood");
    playMusic(songs[0], true)

    // display all the albums on the

    displayAlbuams();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "assets/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "assets/play.svg"
        }
    })

    //listion for time update event

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add event listioner to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // add event listener for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add event listener for close button

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    prev.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // add volume controlbar

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
        // console.log(e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
        if (e.target.value == 0) {
            volimg.src = "assets/mute.svg"
        }
        else {
            volimg.src = "assets/volume.svg"
        }
    })




    //play the song

    // var audio = new Audio(songs[0]);
    // audio.play();

    // audio.addEventListener("loadeddata0", () => {
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime)
    // });
}

main()