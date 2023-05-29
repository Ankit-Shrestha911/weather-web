const date_time = document.querySelector(".data");
const city = document.querySelector(".city");
const con = document.querySelector(".country");
const iconImg = document.querySelector("#icon-image");
const temperature = document.querySelector(".temp");
const weather_stats = document.querySelector(".stats");
const weather_des = document.querySelector(".des");
const Pressure = document.querySelector(".pa");
const Humidity = document.querySelector(".hu");
const windSpeed = document.querySelector(".sp");
const search = document.querySelector("#search-box");
const smallSearch = document.querySelector(".small_btn");
const desktopSearch = document.querySelector(".Desktop_search_btn");
const degree = document.querySelector(".degree");
const Location_Target = window.matchMedia("(max-width: 900px)");

// Showing your system current data and time //
var options = { weekday: "long", hour: "numeric", minute: "numeric" };
var today = new Date();
let d = { day: "numeric" };
let m = { month: "short" };
let y = { year: "numeric" };

const api_id = "706be48014809fa8556c0a920f2d6c14";

// Display the weather info or data  //

function showData(data) {
  const { name } = data;
  const { main, description } = data.weather[0];
  const { temp, pressure, humidity } = data.main;
  const { country } = data.sys;
  const { speed } = data.wind;

  city.textContent = name;
  con.textContent = country;
  temperature.textContent = Math.round(temp);
  weather_stats.textContent = main.toUpperCase();
  weather_des.textContent = description.toUpperCase();
  Pressure.textContent = `${pressure} hPa`;
  Humidity.textContent = `${humidity} %`;
  windSpeed.textContent = `${speed} m/s`;
}

// Display the weather image  //

function showImage(data) {
  const { id, icon, description } = data.weather[0];

  if (icon.includes("n") && description === "clear sky") {
    iconImg.src = "./icons/color-moon.png";
  } else if (icon.includes("n") && description === "few clouds") {
    iconImg.src = "./icons/moon-cloud.png";
   
  } else if (icon.includes("n") && description === "thunderstorm") {
    iconImg.src = "./icons/night-thunderstorm.png";
   
  } else {
    if (id < 250) {
      iconImg.src = "   icons/storm.svg";
    } else if (id < 350) {
      iconImg.src = "icons/drizzle.svg";
    } else if (id < 550) {
      iconImg.src = "icons/rain.svg";
    } else if (id < 650) {
      iconImg.src = "icons/snow.svg";
    } else if (id < 800) {
      iconImg.src = "icons/atmosphere.svg";
    } else if (id === 800) {
      iconImg.src = "icons/sun.svg";
    } else if (id == 801) {
      iconImg.src = "icons/clouds.svg";
    } else if (id == 802 && description === "scattered clouds") {
      iconImg.src = "icons/simple-cloud.png";
    } else if (id > 802) {
      iconImg.src = "icons/all-clouds.png";
    }
  }
}
// Pop-up location prompt and fetch the data from api and show info //

function getLocation() {
  let lat; // latitude
  let long; // longitude

  if (navigator && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((poistion) => {
      lat = poistion.coords.latitude;
      long = poistion.coords.longitude;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_id}&units=metric`;
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          showData(data);
          showImage(data);
        })

        .catch((error) => console.log(error));
      //Display date time //
      date_time.textContent = `${today.toLocaleDateString(
        "en-US",
        d
      )}-${today.toLocaleDateString("en-US", m)}-${today.toLocaleDateString(
        "en-US",
        y
      )} ${today.toLocaleDateString("en-US", options)}`;
    });
  }
}

// Manual Searching //
async function WeatherSearching() {
  date_time.style.display = "none";
  if (search.value == "") {
    alert("Please enter a city name");
    return;
  }

  try {
    const api_Url1 = `https://api.openweathermap.org/data/2.5/weather?q=${search.value.trim()}&appid=${api_id}&units=metric`;
    const response = await fetch(api_Url1);
    const data = await response.json();
    if (data) {
      showData(data);
      showImage(data);
      search.value = "";
    }
  } catch {
    alert("Enter the city name correctly....");
  }
}

// Searching will execute when user hit the enter //
search.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    WeatherSearching();
    // search.value = "";
  }
});

// This function only for phone and tablet //

smallSearch.addEventListener("click", () => {
  if (Location_Target.matches) {
    navigator.permissions
      .query({ name: "geolocation" })
      .then(function (result) {
        if (result.state != "granted") {
          getLocation();
          // WeatherSearching()
        }
//         if (result.state == "denied") WeatherSearching();
        if(result.state == 'granted') WeatherSearching();
        
      });
  }

  // else {
  //   navigator.permissions
  //     .query({ name: "geolocation" })
  //     .then(function (result) {
  //       if (result.state === "granted" || result.state === "denied") {
  //         alert("Please enter a city name ");
  //       }
  //     });
  // }
});

// For desktop search //

desktopSearch.addEventListener("click", () => {
  if (Location_Target.matches) {
    navigator.permissions
      .query({ name: "geolocation" })
      .then(function (result) {
        if (result.state != "granted") {
          getLocation();
        }
//         if (result.state == "denied") WeatherSearching();
        if(result.state == 'granted') WeatherSearching();
      });
  } else WeatherSearching();

  //   else {
  //     navigator.permissions
  //       .query({ name: "geolocation" })
  //       .then(function (result) {
  //         if (result.state === "granted" || result.state === "denied") {
  //           alert("Please enter a city name ");
  //         }
  //       });
  //   }
});

// Function is execute when the window is loading //

window.addEventListener("load", () => {
  if (Location_Target.matches) {
    navigator.permissions
      .query({ name: "geolocation" })
      .then(function (result) {
        if (result.state != "granted") {
          alert("Press the Go / Search button to fetch your location");
          getLocation();
        }
      });
  }
  getLocation();
});
