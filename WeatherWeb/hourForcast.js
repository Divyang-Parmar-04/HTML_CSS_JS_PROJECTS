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
        errorMessage()
    } else {
        weatherApi(newcityName)
        cityname.value = ""
    }

}

// ++++++++++++++++ Current/Forcast Weather +++++++++++++++++

async function weatherApi(cityName) {
    console.log(cityName)
    try {

        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.FORECAST_API}&q=${cityName}&days=7`)

        let data = await response.json()
        console.log(data)
        setTimeout(() => {
            hourWeatherForecast(data.forecast.forecastday)
        }, 1000)
    }
    catch (error) {
        console.log(error, "bad request")
        errorMessage()
    }
}


