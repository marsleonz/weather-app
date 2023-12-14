import "./styles.css";

const elements = {
  city: document.getElementById("city"),
  search: document.getElementById("search"),
  temp: document.getElementById("temp"),
  condition: document.getElementById("condition"),
  img: document.getElementById("img"),
  icon: document.getElementById("icon"),
  display: document.getElementById("display"),
  name: document.createElement("p"),
  country: document.createElement("p"),
  time: document.createElement("p"),
  degree: document.getElementById("degree"),
};

let weatherData;
const defaultImageUrl =
  "https://media.giphy.com/media/26BRzozgqiJu2m7zS/giphy.gif";
const API_KEY = "fe73368c46f7467c841161523230912";
const GIPHY_API_KEY = "bb2006d9d3454578be1a99cfad65913d";

getWeather("london");
elements.search.addEventListener("click", () => {
  getWeather(elements.city.value);
});

async function getWeather(val) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${val}`,
      { mode: "cors" }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const weatherData = await response.json();
    console.log(weatherData);
    getGifs(weatherData.current.condition.text);
    displayData(weatherData);
  } catch (error) {
    console.error("Error:", error);
  }
}

const displayData = (data) => {
  elements.name.textContent = data.location.name;
  elements.country.textContent = data.location.country;
  elements.time.textContent = data.location.localtime;
  elements.temp.textContent =
    elements.degree.textContent === "Celcius"
      ? `${data.current.temp_c} °C`
      : `${data.current.temp_f} °F`;
  elements.condition.textContent = data.current.condition.text;
  elements.icon.src = `https:${data.current.condition.icon}`;
  Object.values(elements).forEach((element) => {
    if (element.tagName === "P") {
      elements.display.appendChild(element);
    }
  });
  weatherData = data;
};

elements.degree.addEventListener("click", () => {
  elements.degree.textContent =
    elements.degree.textContent === "Celcius" ? "Fahrenheit" : "Celcius";
  elements.temp.textContent =
    elements.degree.textContent === "Celcius"
      ? `${weatherData.current.temp_c} °C`
      : `${weatherData.current.temp_f} °F`;
});

async function getGifs(val) {
  elements.img.src = "";
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${val}`,
      { mode: "cors" }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const gifData = await response.json();
    elements.img.src = gifData.data?.images?.original?.url || defaultImageUrl;
  } catch (error) {
    console.error("Error:", error);
    elements.img.src = defaultImageUrl;
  }
}
