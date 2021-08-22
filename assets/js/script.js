console.log("connected!");

// moment js for current date and time
let currentDate = moment().format('MMMM Do, YYYY - (h:m A)')
console.log('today date: ' + currentDate);

// global variables
let searchCityWeatherBtn = document.getElementById("searchCityWeatherBtn")


// search weather when search button clicked to populate current weather
searchCityWeatherBtn.addEventListener('click', event => {
  event.preventDefault()

  let searchCityWeather = document.getElementById("searchCityWeather").value

  axios.get(``)
    .then(})
    .catch(err => console.log(err));




})