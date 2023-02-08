import config from "../conf/index.js";

async function init() {
  //Fetches list of all cities along with their images and description
  let cities = await fetchCities();

  //Updates the DOM with the cities
  cities.forEach((key) => {
    addCityToDOM(key.id, key.city, key.description, key.image);
  });
}

//Implementation of fetch call
async function fetchCities() {
  // TODO: MODULE_CITIES
  // 1. Fetch cities using the Backend API and return the data

  // use a backendEndPoint variable 
  const URL = `${config.backendEndpoint}/cities`;

  // To check and catch error that might happen
  try {
    //fetch the URL to get the data.
    const res = await fetch(URL);

    if (res.ok) {
      // if response is ok, Convert the response into Json
      let cities = await res.json();
      return cities;
    } else {
      // if response is not ok, throw an error message.
      const errMessage = `Error ${res.status}`;
      throw new Error(errMessage);
    }
  } catch (error) {
    //catch the error during fetch and throw null when happen
    return null;
  }

  // fetch('http://13.235.188.177:8082')
  // .then(response=>response.json());
  // then(json=> console.log(json));
}

//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  // TODO: MODULE_CITIES
  // 1. Populate the City details and insert those details into the DOM

  const col = document.createElement("div");

  //implement column element
  col.setAttribute("class", "col-12 col-md-6 col-lg-3 mt-3");

  // implement the tile for the card
  const tileElement = `
  <div class='tile'>
        <a href='pages/adventures/?city=${id}'id=${id}>
          <img src=${image}>
          <div class='tile-text'>
              <h2>${city}</h2>
              <span>${description}</span>
          </div>
        </a>
    <div>
  `;
  // Append the tileElement to the div tag:
  col.innerHTML = tileElement;

  const dataElement = document.getElementById("data");
  //Append the div tag to the dataElement :
  dataElement.append(col);
}

export { init, fetchCities, addCityToDOM };
