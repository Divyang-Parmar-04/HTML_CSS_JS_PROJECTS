
// ++++++++++++++++ open moreinfo on click ++++++++++++++

openMoreButton()
function openMoreButton() {
    let morebtn = document.querySelector("#morebtn")
    morebtn.addEventListener("click", function (e) {
        // console.log(e.target)
        let moreinfo = document.querySelector(".moreInfo-box")
        let moreInfoBoxcontainer = document.querySelector(".moreInfoBox-container")
        moreInfoBoxcontainer.style.display = "block"
        setTimeout(() => {
            moreinfo.style.height = "100%"
        }, 0)

        let closebtn = document.querySelector("#close")
        closebtn.style.display = "block"
    })

    // +++++++++++++++ close morebtn ++++++++++++++

    let closebtn = document.querySelector("#close")
    closebtn.addEventListener('click', function (e) {
        let moreinfo = document.querySelector(".moreInfo-box")
        let moreInfoBoxcontainer = document.querySelector(".moreInfoBox-container")
        moreinfo.style.height = "0%"
        setTimeout(() => {
            moreInfoBoxcontainer.style.display = "none"
        }, 400)
        closebtn.style.display = "none"
    })
}

// +++++++++++++++ Taking input from user +++++++++++++++

let btn = document.querySelector("#btn")
let cityname = document.querySelector("#inp")
btn.addEventListener("click", function (e) {
    e.preventDefault()
    cityName()
})
weatherApi("Ahmedabad")
function cityName() {

    let cityName = cityname.value
    firstchar = cityName.charAt(0).toUpperCase();
    cityName = cityName.slice(1, cityName.length);
    let newcityName = firstchar.concat(cityName)
  
    if (cityName == "") {
        alert("Enter city name")
    } else {
        weatherApi(newcityName)
        cityname.value = ""
    }

}

// ++++++++++++++++ Current/Forcast Weather Fetching data from API +++++++++++++++++
// const key = "3d6fb382a3fa4423828143949242310";
async function weatherApi(cityName) {
    console.log(cityName)
    try {

        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.API}&q=${cityName}&days=7`)

        let data = await response.json()
        console.log(data)
        changeBackground(data)
        setTimeout(() => {
            weatherForecast(data.forecast)
            wetherResult(data);
            hourWeatherForecast(data, 0)
            onForecastClick(data.forecast)
            Graph(data.forecast.forecastday)
        }, 2000)
    }
    catch (error) {
        console.log(error, "bad request")
        alert("Data not Found!")
        errorMessage()
    }
}

//++++++++++++++++ Graph of temperature +++++++++++
let myChart
function Graph(date) {
    let temp = [];
    let day = ["Today"]

    for (i = 0; i < 7; i++) {
        temp[i] = date[i].day.avgtemp_c;
        if (i != 0) {
            let tday = date[i]
            let tdate = new Date(tday.date)
            let cday = tdate.toDateString().split(" ")[0]
            let cdate = tdate.toDateString().split(" ")[2]
            let t = `${cday} ${cdate}`
            day[i] = t

        }

    }

    // console.log(temp)
    // console.log(day)
    let ctx;
    if (myChart) {
        myChart.destroy();
        // console.log("mychart is destroy")

    }
    ctx = document.getElementById('myChart');
    // console.log(ctx)

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: day,
            datasets: [{
                label: 'Temperature °C',
                data: temp,
                borderWidth: 1

            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
// ++++++++++++ error Message +++++++++++ 

function errorMessage() {
    let errorBox = document.querySelector(".error-box")
    errorBox.style.display = "block"
}
// ++++++++++++ Background change function +++++++++++ 

function changeBackground(data) {

    let day = `${data.current.condition.text} weather`

    let bg = document.querySelector("#bodyimg")
    query(day).then((response) => {
        const objectImage = URL.createObjectURL(response);
        bg.src = objectImage;
    });
    async function query(prompt) {
        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",

                {

                    headers: { Authorization: `${process.env.HUGGINGFACE_API_KEY}` },
                    method: "POST",
                    body: JSON.stringify({ "inputs": `${prompt}` }),
                }
            );
            const result = await response.blob();
            return result;
        }
        catch(error){
            alert("Image not found")
        }
    }

}
// ++++++++++++ Weather display function +++++++++++ 

function wetherResult(data) {

    let errorBox = document.querySelector(".error-box")
    // errorBox.style.display = "none"

    let cityName = document.querySelector("#cityname")
    cityName.innerHTML = `${data.location.name}`

    let date = new Date(data.forecast.forecastday[0].date)
    date = date.toDateString().split(" ")
    let cday = date[0]
    let cmonth = date[1]
    let cdate = date[2]
    // console.log(day)
    let datetag = document.querySelector("#date")
    datetag.innerHTML = `${cday} ${cmonth} ${cdate}`

    let info = document.querySelectorAll(".info")
    info.forEach((e) => {
        // console.log(e.id)
        if (e.id == "humidity") {
            e.innerHTML = `: ${data.current.humidity}`
        }
        else if (e.id == "wind_kph") {
            e.innerHTML = `: ${data.current.wind_kph} km/h`
        }
        else if (e.id == "wind_dir") {
            e.innerHTML = `: ${data.current.wind_dir}`
        }
        else if (e.id == "region") {
            e.innerHTML = `: ${data.location.region}`
        }
        else if (e.id == "country") {
            e.innerHTML = `: ${data.location.country}`
        }
        else {
            e.innerHTML = `: ${data.current.uv}`
        }
    })

    let tempC = document.querySelector("#temp-c")
    tempC.innerHTML = `${data.current.temp_c}°C / ${data.current.temp_f}°F`

    let text = document.querySelector("#text")
    text.innerHTML = `${data.current.condition.text}`

    let img = document.querySelector("#icon")
    img.src = `${data.current.condition.icon}`

    let temp = document.querySelector("#feels")
    temp.textContent = `Feels like ${data.current.feelslike_c}°C`

    let moredata = data.forecast.forecastday[0];
    moreInformation(moredata);
}
// ++++++++++++++++++++ WeatherForecast +++++++++++++++

function onForecastClick(data) {
    let daybox = document.querySelectorAll(".daybox")
    daybox.forEach((item) => {
        item.style.cursor = "pointer"
        item.addEventListener("click", function (e) {
            // console.log(e.target.parentNode.id)
            let id = parseInt(e.target.parentNode.id)
            nextDate = data.forecastday[id]
            // console.log(nextDate)
            id = ""
            onclickforecastWeather(nextDate)
            moreInformation(nextDate)

        })
    })
}
// ++++++++++++++ moreInformation update +++++++++++
function moreInformation(data) {
    let imgbtn = document.querySelector("#morebtnicon")
    imgbtn.src = `${data.day.condition.icon}`
    let morepara = document.querySelectorAll(".morep")
    morepara.forEach((item) => {
        let id = parseInt(item.id);
        switch (id) {

            case 1:
                item.innerHTML = `${data.astro.sunrise}`

                break;
            case 2:
                item.innerHTML = `${data.astro.sunset}`
                break;
            case 3:
                item.innerHTML = `${data.astro.moonrise}`
                break;
            case 4:
                item.innerHTML = `${data.astro.moonset}`
                break;
            case 5:
                item.innerHTML = `${data.day.daily_chance_of_rain} %`
                break;
            case 6:
                item.innerHTML = `${data.day.daily_chance_of_snow} %`
                break;
            case 7:
                item.innerHTML = `${data.day.maxtemp_c}°C`
                break;
            case 8:
                item.innerHTML = `${data.day.maxtemp_f}°F`
                break;
            default:
                console.log("NO")
        }
    })
}
// ++++++++ on clicking any forecast day box it change the content of display ++++++++++++++++

function onclickforecastWeather(data) {

    let date = new Date(data.date)
    date = date.toDateString().split(" ")
    let cday = date[0]
    let cmonth = date[1]
    let cdate = date[2]
    // console.log(day)
    let datetag = document.querySelector("#date")
    datetag.innerHTML = `${cday} ${cmonth} ${cdate}`

    let info = document.querySelectorAll(".info")
    info.forEach((e) => {
        // console.log(e.id)
        if (e.id == "humidity") {
            e.innerHTML = `: ${data.day.avghumidity}`
        }
        else if (e.id == "wind_kph") {
            e.innerHTML = `: ${data.day.maxwind_kph} km/h`
        }
        else if (e.id == "uv") {
            e.innerHTML = `: ${data.day.uv}`
        }
    })

    let tempC = document.querySelector("#temp-c")
    tempC.innerHTML = `${data.day.maxtemp_c}°C / ${data.day.maxtemp_f}°F`

    let text = document.querySelector("#text")
    text.innerHTML = `${data.day.condition.text}`

    let img = document.querySelector("#icon")
    img.src = `${data.day.condition.icon}`

    let temp = document.querySelector("#feels")
    temp.textContent = `Chance of Rain ${data.day.daily_chance_of_rain} %`
}
// ++++++++++++++++ Forecast +++++++++++++

function weatherForecast(forecast) {
    let forecastday = forecast.forecastday
    // console.log(forecastday)
    let daybox = document.querySelectorAll(".daybox")
    daybox.forEach((item) => {
        // console.log(item)
        if (item.id == 0) {
            let day = forecastday[0]
            let date = new Date(day.date)
            let cday = date.toDateString().split(" ")[0]
            let cdate = date.toDateString().split(" ")[2]
            // console.log(day)
            let date0 = document.querySelector("#date0")
            // date0.innerHTML = `${cday} ${cdate}`
            date0.innerHTML = "Today"
            let icon = document.querySelector("#icon0")
            icon.src = `${day.day.condition.icon}`
            let temp = document.querySelector("#temp0")
            temp.innerHTML = `${day.day.maxtemp_c}°/${day.day.mintemp_c}°`
            // console.log(date0)
        }
        else if (item.id == 1) {
            let day = forecastday[1]
            let date = new Date(day.date)
            let cday = date.toDateString().split(" ")[0]
            let cdate = date.toDateString().split(" ")[2]
            // console.log(day)
            let date1 = document.querySelector("#date1")
            date1.innerHTML = `${cday} ${cdate}`
            let icon = document.querySelector("#icon1")
            icon.src = `${day.day.condition.icon}`
            let temp = document.querySelector("#temp1")
            temp.innerHTML = `${day.day.maxtemp_c}°/${day.day.mintemp_c}°`
        }
        else if (item.id == 2) {
            let day = forecastday[2]
            let date = new Date(day.date)
            let cday = date.toDateString().split(" ")[0]
            let cdate = date.toDateString().split(" ")[2]
            // console.log(day)
            let date2 = document.querySelector("#date2")
            date2.innerHTML = `${cday} ${cdate}`
            let icon = document.querySelector("#icon2")
            icon.src = `${day.day.condition.icon}`
            let temp = document.querySelector("#temp2")
            temp.innerHTML = `${day.day.maxtemp_c}°/${day.day.mintemp_c}°`
        }
        else if (item.id == 3) {
            let day = forecastday[3]
            let date = new Date(day.date)
            let cday = date.toDateString().split(" ")[0]
            let cdate = date.toDateString().split(" ")[2]
            // console.log(day)
            let date3 = document.querySelector("#date3")
            date3.innerHTML = `${cday} ${cdate}`
            let icon = document.querySelector("#icon3")
            icon.src = `${day.day.condition.icon}`
            let temp = document.querySelector("#temp3")
            temp.innerHTML = `${day.day.maxtemp_c}°/${day.day.mintemp_c}°`
        }
        else if (item.id == 4) {
            let day = forecastday[4]
            let date = new Date(day.date)
            let cday = date.toDateString().split(" ")[0]
            let cdate = date.toDateString().split(" ")[2]
            // console.log(day)
            let date4 = document.querySelector("#date4")
            date4.innerHTML = `${cday} ${cdate}`
            let icon = document.querySelector("#icon4")
            icon.src = `${day.day.condition.icon}`
            let temp = document.querySelector("#temp4")
            temp.innerHTML = `${day.day.maxtemp_c}°/${day.day.mintemp_c}°`
        }
        else if (item.id == 5) {
            let day = forecastday[5]
            let date = new Date(day.date)
            let cday = date.toDateString().split(" ")[0]
            let cdate = date.toDateString().split(" ")[2]
            // console.log(day)
            let date5 = document.querySelector("#date5")
            date5.innerHTML = `${cday} ${cdate}`
            let icon = document.querySelector("#icon5")
            icon.src = `${day.day.condition.icon}`
            let temp = document.querySelector("#temp5")
            temp.innerHTML = `${day.day.maxtemp_c}°/${day.day.mintemp_c}°`
        }
        else if (item.id == 6) {
            let day = forecastday[6]
            let date = new Date(day.date)
            let cday = date.toDateString().split(" ")[0]
            let cdate = date.toDateString().split(" ")[2]
            // console.log(day)
            let date6 = document.querySelector("#date6")
            date6.innerHTML = `${cday} ${cdate}`
            let icon = document.querySelector("#icon6")
            icon.src = `${day.day.condition.icon}`
            let temp = document.querySelector("#temp6")
            temp.innerHTML = `${day.day.maxtemp_c}°/${day.day.mintemp_c}°`
        }
    })
}
// +++++++++++++++ HourForecast ++++++++++++

function hourWeatherForecast(data) {
    // console.log(data)

    let currentDate = data.current.last_updated.split(" ")[0].split("-")[2]
    let currentTime = data.current.last_updated.split(" ")[1].split(":")[0]

    let changeCTime = parseInt(currentTime)
    let changeCDate = parseInt(currentDate)
    // console.log("current Date", currentDate)
    // console.log("current time", currentTime)
    let i = 0;
    let j = 0;
    let count = 0;
    for (i; i < 2; i++) {
        let apiCdate = parseInt(data.forecast.forecastday[i].date.split("-")[2])
        // console.log(apiCdate)
        if (apiCdate == changeCDate) {
            // console.log(i)
            for (j; j <= 24; j++) {
                // let apiCtime = data.forecast.forecastday[i].hour[j].time.split(" ")[1].split(":")[0]
                // console.log("j", j)

                if (j > 23) {
                    j = 0
                    changeCDate++
                    changeCTime = 0
                    // console.log("j is greater")
                    // console.log(changeCDate, "next date")
                    break
                }
                else {
                    let forecastday = data.forecast.forecastday[i]
                    let forecastHourtime = forecastday.hour[j].time
                    let apiCtime = parseInt(forecastHourtime.split(" ")[1].split(":")[0])
                    // console.log(apiCtime,"api")
                    let icon = forecastday.hour[j].condition.icon
                    let temp = forecastday.hour[j].temp_c



                    if (apiCtime == 0 && changeCTime == 0) {
                        apiCtime = 24
                        changeCTime = 24
                    }
                    if (apiCtime == changeCTime) {

                        if (count == 0) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = "Now"
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++
                        }
                        else if (count == 1) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 2) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 3) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 4) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 5) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 6) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 7) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 8) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 9) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 10) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 11) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime

                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 12) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 13) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 14) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 15) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 16) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 17) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 18) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 19) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 20) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 21) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        } else if (count == 22) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }
                        else if (count == 23) {
                            if (changeCTime == 24) {
                                changeCTime = 0
                            }
                            let setTime = apiCtime
                            // let AMPM = setTime>=12 ? "PM" : "AM"
                            setTime = setTime % 12 || 12;
                            // console.log(setTime)
                            let htime = document.getElementById(`htime${count}`)
                            let himg = document.getElementById(`himg${count}`)
                            let htemp = document.getElementById(`htemp${count}`)
                            htime.innerHTML = `${setTime}:00`
                            himg.src = `${icon}`
                            htemp.innerHTML = `${temp}°`
                            changeCTime++

                        }

                        count++
                    }
                }
            }
        }
        // console.log(apiCdate)
    }

}