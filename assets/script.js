// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// split method 

//lets say you have a variable that's a string, so 

// var stringy = "q=location=nine";
// var arrayNow = stringy.split('=')[1];
// arrayNow = ['q','location', 'nine'];
// to return 'nine'


// concept of indexing
// an index is a position in an array, [0,1,2,3...]

var searchCityEl = document.getElementById("enterCity");
var currentCity = document.getElementById("currentCity");
var searchBtn = document.getElementById("searchBtn");
var weatherApiKey = "5c8633926c7e7b10de268890c0287251";
var lat = "";
var lon = "";
var searchHistoryList = [];
var oneCallUrl = "";
var renderItems = function (data){
  console.log (data.current.wind_speed)
};

function currentCondition(){
  console.log("current condition called");
};

searchBtn.addEventListener("click", function(event) {
  console.log("searchCityValue", searchCityEl.value);
  event.preventDefault();

  
  var city = $("#enterCity").val().trim();
    currentCondition(city);
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        var searchedCity = $(`
            <li class="list-group-item">${city}</li>
            `);
        $("#searchHistory").append(searchedCity);
    };
    
    localStorage.setItem("city", JSON.stringify(searchHistoryList));
  getApi(searchCityEl.value);
  currentCity.textContent = searchCityEl.value;
  
    

});

function getApi(searchCity) {
      // TODO: Insert the API url to get a list of your repos
    var geoLocationUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchCity + "&limit=5&appid=" + weatherApiKey;
    // console.log(x);
    console.log(geoLocationUrl);
    console.log("Weather API Key", weatherApiKey);
  
    fetch(geoLocationUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        lat = data[0].lat;
        lon = data[0].lon;
        console.log(lat, lon);
        console.log(data)
        oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + weatherApiKey;
        fetchWeather();
        // Looping over the fetch response and inserting the URL of your repos into a list
        for (var i = 0; i < data.length; i++) {
          // Create a list element
          var listItem = document.createElement('li');
  
          // Set the text of the list element to the JSON response's .html_url property
          listItem.textContent = data[i].html_url;
          var repoList = document.getElementById('history')
  
          // Append the li element to the id associated with the ul element.
          repoList.appendChild(listItem);
        }
      });
  }
  

  var weatherApiRootUrl = '';
  
 

  function fetchWeather() {
    
    var city = location.name;
    // var apiUrl = `${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`;
  
    fetch(oneCallUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log(data);
        renderItems(data);
      })
      .catch(function (err) {
        console.error(err);
      });
  };
  

  function fetchCoords(search) {
    var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert('Location not found');
        } else {
          appendToHistory(search);
          fetchWeather(data[0]);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  };