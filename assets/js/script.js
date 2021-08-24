console.log("connected!");

// moment js for current date and time
let currentDate = moment().format('MMMM Do, YYYY - (h:m A)')
console.log('today date: ' + currentDate);

// global variables
let searchCityWeatherBtn = document.getElementById("searchCityWeatherBtn")
let clearSearchHistoryBtn = document.getElementById("clearSearchHistoryBtn")

const apiKey = '878539cd4c9ba6682795234dae946244'

// function to covert kelvin to farenheit
// may not be needed using units imperial
function convertKToF(k) {
  return Math.floor((k - 273.15) * 1.8 + 32)
}

// storage
const localStorage = window.localStorage
let searchHistory = JSON.parse(localStorage.getItem('searchHistory'))



// search weather when search button clicked to populate current weather
searchCityWeatherBtn.addEventListener('click', event => {
  event.preventDefault()

  let searchCityWeather = document.getElementById("searchCityWeather").value
  console.log(`Search was: ${searchCityWeather}`);

  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchCityWeather}&units=imperial&appid=${apiKey}`)
    .then(res => {

      // see properties of resopnse
      console.log(res);

      // set response as variable and log
      const currentWeather = res.data
      console.log(currentWeather);

      // log the search city weather tempurate and convert the current weather temp to farenheit
      console.log(`${searchCityWeather} temp: ${currentWeather.main.temp}`);

      // log the current weather date time and timezone
      console.log(`dt : ${currentWeather.dt}`);
      console.log(`time zone : ${currentWeather.timezone}`);

      let country = currentWeather.sys.country
      console.log(`country: ${country}`);

      document.getElementById('currentWeatherResults').innerHTML = ``

      document.getElementById('searchCityWeather').innerHTML =''

      // for UV Query
      let lat = currentWeather.coord.lat
      let lon = currentWeather.coord.lon
      console.log(`Lat:${lat} & Lon:${lon}`);


      let UVQueryUrl = (`https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&cnt=1`)

      axios.get(UVQueryUrl)
        .then(UVres => {
          console.log(UVres);

          let UVIndex = UVres.data[0].value
          console.log(`UV Index: ${UVIndex}`);
          
          document.getElementById('').innerHTML = ``

          // if statements to check uv ratings here

        })
        .catch(uvErr => console.log(uvErr));



      let forecastURL = (`https://api.openweathermap.org/data/2.5/forecast?q=${searchCityWeather}&units=imperial&appid=${apiKey}`)

      axios.get(forecastURL)
        .then(forecastRes => {

          console.log(forecastRes);

          let forecast = forecastRes.data

          let fiveDayForecast = 5


          let forecastHTML = ``

          // for loop here for five day forecast
          for (let i = 0; i < fiveDayForecast; i++) {

          }
          document.getElementById('weatherForecast').innerHTML = forecastHTML
          

        })
        .catch(forecastErr => console.log(forecastErr))


    })
    .catch(err => console.log(err));

})

