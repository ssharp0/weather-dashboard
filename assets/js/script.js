console.log("connected!");

// moment js for current date and time
let currentDate = moment().format('MMMM Do, YYYY - (h:m A)')
console.log('today date: ' + currentDate);

// global variables
let searchCityWeatherBtn = document.getElementById("searchCityWeatherBtn")
let clearSearchHistoryBtn = document.getElementById("clearSearchHistoryBtn")
const apiKey = ''

// storage



// search weather when search button clicked to populate current weather
searchCityWeatherBtn.addEventListener('click', event => {
  event.preventDefault()

  let searchCityWeather = document.getElementById("searchCityWeather").value
  console.log(`Search was: ${searchCityWeather}`);

  axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${searchCityWeather}&appid=${apiKey}`)
    .then(res => {

      // see properties
      console.log(res);

      document.getElementById('searchCityWeather').innerHTML =''
    })
    .catch(err => console.log(err));
})