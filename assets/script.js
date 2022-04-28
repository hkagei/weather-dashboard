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
var currentTemp = document.getElementById("currentTemp");
var currentWind = document.getElementById("currentWind");
var currentHumidity = document.getElementById("currentHumidity");
var currentUV = document.getElementById("currentUV");
var searchBtn = document.getElementById("searchBtn");
var weatherApiKey = "5c8633926c7e7b10de268890c0287251";
var lat = "";
var lon = "";
var searchHistoryList = [];
var searchHistoryContainer = document.querySelector('#history')
var oneCallUrl = "";


// currentTemp.textContent = searchCityEl.value;
// currentHumidity.textContent = searchCityEl.value;
// currentUV.textContent = searchCityEl.value;
// currentWind.textContent = searchCityEl.value;

var renderItems = function (data){
  console.log (data.current.wind_speed)
  // insert "if" statement here
  // The "if" statement will check if the text has already been entered. If so, we would have to get the existing text replaced

  if (document.getElementById("enterCity").value.length === 0) {

  } else {

  }
  
  currentTemp.append(data.current.temp);
  currentWind.append(data.current.wind_speed);
  currentHumidity.append(data.current.humidity);
  currentUV.append(data.current.uvi);
};

function currentCondition(){
  console.log("current condition called");
};

searchBtn.addEventListener("click", function(event) {
  console.log("searchCityValue", searchCityEl.value);
  event.preventDefault();
  futureCondition();

  
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
        oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + weatherApiKey + "&units=Imperial";
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

  function futureCondition(lat, lon, weatherApiKey) {

    
    var futureURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + weatherApiKey + "&units=Imperial";

    $.ajax({
        url: futureURL,
        method: "GET"
    }).then(function(futureResponse) {
        console.log(futureResponse);
        $("#fiveDay").empty();
        
        for (let i = 1; i < 6; i++) {
            var cityInfo = {
                date: futureResponse.daily[i].dt,
                icon: futureResponse.daily[i].weather[0].icon,
                temp: futureResponse.daily[i].temp.day,
                humidity: futureResponse.daily[i].humidity
            };

            var currDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
            var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${futureResponse.daily[i].weather[0].main}" />`;

            
            var futureCard = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                        <div class="card-body">
                            <h5>${currDate}</h5>
                            <p>${iconURL}</p>
                            <p>Temp: ${cityInfo.temp} °F</p>
                            <p>Humidity: ${cityInfo.humidity}\%</p>
                        </div>
                    </div>
                <div>
            `);

            $("#fiveDay").append(futureCard);
        }
    }); 
}

// add on click event listener 
searchBtn.addEventListener("click", function(event) {
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
    console.log(searchHistoryList);
});

searchBtn.addEventListener("click", function (localStorage) {
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
  
 
});

function appendToHistory(search) {

  searchHistoryList.push(search)
   localStorage.setItem("city", JSON.stringify(searchHistoryList));
  console.log(searchHistoryList);
  // call the function that executes the search button work 
  renderSearchHistory();
}

function initSearchHistory() {
  var storedHistory = localStorage.getItem('city');
  if(storedHistory) {
    searchHistoryList = JSON.parse(storedHistory);
  }
  // call the function that executes the search button 
  renderSearchHistory();
}

function renderSearchHistory() {
  searchHistoryContainer.innerHTML = ' ';
  for (var i = searchHistoryList.length -1; i >=0; i--) {
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today forecast');
    btn.classList.add('history-btn', 'btn-history');

    btn.setAttribute('data-search', searchHistoryList[i]);
    btn.textContent = searchHistoryList[i];
    searchHistoryContainer.append(btn);
  }

}



searchBtn.addEventListener("click", function (localStorage) {
  var listCity = $(this).text();
  currentCondition(listCity);
});


//  var searchHistoryList = JSON.parse(localStorage.getItem("city"));

  
searchBtn.addEventListener("click", function (localStorage) {
  localStorage.setItem("city", JSON.stringify(searchHistoryList));
  if (searchHistoryList !== null) {
    var lastSearchedIndex = searchHistoryList.length - 1;
    var lastSearchedCity = searchHistoryList[lastSearchedIndex];
    currentCondition(lastSearchedCity);
    console.log(`Last searched city: ${lastSearchedCity}`);
}


});