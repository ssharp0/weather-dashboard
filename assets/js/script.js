// documents
// https://openweathermap.org/current
// https://openweathermap.org/forecast5 


// moment js for current date and time logged for reference
let currentDate = moment().format('MMMM Do, YYYY - (hh:mm A)')
console.log('today date: ' + currentDate);

// global variables
let searchCityWeatherBtn = document.getElementById("searchCityWeatherBtn")
let clearSearchHistoryBtn = document.getElementById("clearSearchHistoryBtn")

// api key
const apiKey = '878539cd4c9ba6682795234dae946244'

// local storage for search history to parse and get the search items
const localStorage = window.localStorage
let searchHistory = JSON.parse(localStorage.getItem('searchItem')) || []

// search weather (for a city) function to grab the current weather (weather icon, temp, humidity, wind speed), uv data, and five day forecast
function searchWeather(city) {

  // axios request to search for the current city weather
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`)
    .then(res => {

      // see properties of resopnse
      // console.log(res);

      // set response as variable for current weather
      const currentWeather = res.data

      // log the search city weather temperature - no need to convert as using unites=imperial in the axios request
      // console.log(`${searchCityWeather} temp: ${currentWeather.main.temp}`);

      // log the current weather date time and timezone for reference
      // console.log(`dt : ${currentWeather.dt}`);
      // console.log(`time zone : ${currentWeather.timezone}`);

      // set cityId for the current city to use for forecast url request
      let cityID = currentWeather.id
      // console.log(`city id: ${cityID}`);

      // convert date time and time zone from date time epoch string
      let currentTimeUTC = currentWeather.dt
      let currentTimeZoneOffset = currentWeather.timezone / 60 / 60
      let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffset)

      // create the html elements grabbing the weather data and place in the currentWeatherResults (top right) on html page
      document.getElementById('currentWeatherResults').innerHTML =
        `
      <div class="row mr-0">
        <div class="col-lg-12 card" id="currentWeatherDiv">
          <div class="card-body">
            <h3 id="cityName" class="align-middle">${currentWeather.name}, ${currentWeather.sys.country} - ${currentMoment.format("(MM/DD/YYYY)")}</h3>
            <img class="weatherIcon" id="cityWeatherPic" src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png" alt="${currentWeather.weather[0].description}">
            <p id="currentTemperature">Temp: ${currentWeather.main.temp} &#176F</p>
            <p id="currentHumidity">Humidty: ${currentWeather.main.humidity}%</p>
            <p id="currentWindSpeed">Wind Speed: ${currentWeather.wind.speed} MPH</p>
            <p id="currentUVIndex">UV Index: </p>
          </div>
        </div>
      </div>
      `

      // set the searchChityWeather (input text) to be blank so user can enter fresh
      document.getElementById('searchCityWeather').innerHTML = ''

      // assigning variables for longitude and latitude for the UV query
      let lat = currentWeather.coord.lat
      let lon = currentWeather.coord.lon

      // Logging the coordinates for visibility
      // console.log(`Lat:${lat} & Lon:${lon}`);

      // assigning a variable for the UV query url for axios for axios request
      let UVQueryUrl = (`https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&cnt=1`)

      axios.get(UVQueryUrl)
        .then(UVres => {

          // log response to see properties
          // console.log(UVres);

          // assigning UVIndex as variable to grab the data and log on console to confirm grabbing right data value
          let UVIndex = UVres.data[0].value
          // console.log(`UV Index: ${UVIndex}`);

          // placing value of the UVIndex into the currentUVIndex on the created html
          document.getElementById('currentUVIndex').innerHTML =
            `UV Index: <span id="uvVal">${UVIndex}</span>`

          // if statements to determine the UV quality - favorable, moderate, severe
          if (UVIndex >= 0 && UVIndex < 3) {
            document.getElementById('uvVal').setAttribute('class', 'favorableUV')
          } else if (UVIndex >= 3 && UVIndex < 8) {
            document.getElementById('uvVal').setAttribute('class', 'moderateUV')
          } else {
            document.getElementById('uvVal').setAttribute('class', 'severeUV')
          }
        })
        // catch error for the uv url axios request
        .catch(uvErr => console.log(uvErr));


      // assinging a variable for the forecast url for axios request
      let forecastURL = (`https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&units=imperial&appid=${apiKey}`)

      axios.get(forecastURL)
        .then((forecastRes) => {

          // log response to see properties
          // console.log(forecastRes);

          // assign variable to get the id forecastHeader (forecast row header - hides all content until removal below)
          let fivedayEl = document.getElementById('forecastHeader')
          fivedayEl.classList.remove('d-none')

          // select all the forecast classes (five forecast columns in the forecast section on html page) and assign to forecast elements
          const forecastEls = document.querySelectorAll('.forecastSlot')

          // for loop to go through all forecast elements on html page (ie. 5)
          for (let i = 0; i < forecastEls.length; i++) {

            // forecast element (at each element) inner html blank to start
            forecastEls[i].innerHTML = ''

            // set a forecast index (for the for loop to pull the correct days based on the response). Pull 3PM
            const forecastIndex = i * 8 + 4

            // create date elements to pull correct dates at each forecast iteration (five days) from date time
            const fcstDate = new Date(forecastRes.data.list[forecastIndex].dt * 1000)
            const fcstDay = fcstDate.getDate()
            const fcstMonth = fcstDate.getMonth() + 1;
            const fcstYear = fcstDate.getFullYear();

            // create forecast date element and add the full forecast date in the html for each forecast day and append to forecast element
            const fcstDateEl = document.createElement('p')
            fcstDateEl.setAttribute('class', 'mt-2 mb-0 forecastDate')
            fcstDateEl.innerHTML = `${fcstMonth}/${fcstDay}/${fcstYear}`

            // create img element and add the image url source for each forecast day and append to the forecast element
            const fcstWeatherEl = document.createElement('img')
            fcstWeatherEl.setAttribute('src', `https://openweathermap.org/img/wn/${forecastRes.data.list[forecastIndex].weather[0].icon}@2x.png`)
            fcstWeatherEl.setAttribute('alt', forecastRes.data.list[forecastIndex].weather[0].description)

            // create forecast temp element and add the forecast temperature for each forecast day and append to the forecast element
            const fcstTempEl = document.createElement('p')
            fcstTempEl.innerHTML = `Temp:  ${forecastRes.data.list[forecastIndex].main.temp} &#176F`

            // create forecast humidity element and add the forecast humidity for each forecast day and append to the forecast element
            const fcstHumidityEl = document.createElement('p')
            fcstHumidityEl.innerHTML = `Humidity:  ${forecastRes.data.list[forecastIndex].main.humidity}%`

            // append new elements to the forecast slots
            forecastEls[i].append(fcstDateEl)
            forecastEls[i].append(fcstWeatherEl)
            forecastEls[i].append(fcstTempEl)
            forecastEls[i].append(fcstHumidityEl)
          }

        })
        // catch error for the forecast url axios request
        .catch(forecastErr => console.log(forecastErr))

    })
    // catch error for the current weather response url axios request
    .catch(err => console.log(err));
}


// event listener when the clear search history button is clicked it will clear the local storage and reload the page
clearSearchHistoryBtn.addEventListener('click', event => {
  event.preventDefault()
  localStorage.clear()
  searchHistory = []
  location.reload()
})

// function for the search history list to populate the search area below with previous search items from local storage
function searchHistoryList() {

  document.getElementById('searchHistory').innerHTML = ''

  // for loop through the number of items/length of the local storage searchHistory to create the elements (by creating read only input elements with the value (i.e. search text) and an event listener so when user clicks it will search for that value's weather)
  for (let i = 0; i < searchHistory.length; i++) {

    let histItem = document.createElement('input');
    histItem.setAttribute('type', 'text')
    histItem.setAttribute('class', 'form-control d-block inputSearchHist')
    histItem.setAttribute('readonly', true)
    histItem.setAttribute('value', searchHistory[i])
    histItem.addEventListener('click', function () {
      searchWeather(histItem.value)
    })
    // console.log(histItem.value);

    // append search items to the search history list
    document.getElementById('searchHistory').append(histItem)
  }
}

// call the searchHistoryList function to show the search history
searchHistoryList();
// if the search history local storage length is greater than  (so at least one item)
if (searchHistory.length >= 1) {
  searchWeather(searchHistory[searchHistory.length - 1])
  // console.log(searchHistory);
}

// add event listener for when the searchCityWeatherBtn is clicked to search for the cities weather and push the search to local storage
searchCityWeatherBtn.addEventListener('click', event => {
  event.preventDefault()

  // assign the search city weather input text as a variable and send to uppercase to prevent duplicates on the local storage
  let searchCityWeather = document.getElementById("searchCityWeather").value.toUpperCase()
  // console.log(`Search was: ${searchCityWeather}`);

  // assign the search city weather as search text to push to local storage
  const searchText = searchCityWeather

  // if the searchHistory local storage array does not include the search text then push the search text to local storage
  if (!searchHistory.includes(searchText)) {
    searchHistory.push(searchText)
    localStorage.setItem('searchItem', JSON.stringify(searchHistory))
  }

  // call the search weather function to search the city weather from user input
  searchWeather(searchCityWeather)

  // render the search history list
  searchHistoryList()

})
