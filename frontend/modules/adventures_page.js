import config from "../conf/index.js";
import { fetchCities } from "./landing_page.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it
  const city = search.split("=")[1];
  return city;
}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data

  // const URL = `${config.backendEndpoint}/adventures?city=${city}`;

  const URL = config.backendEndpoint + `/adventures/?city=${city}`;

  try {
    const adventureResponse = await fetch(URL);

    if (adventureResponse.ok) {
      const adventures = await adventureResponse.json();
      return adventures;
    } else {
      const errorMessage = `Error${adventureResponse.status}`;
      throw new Error(errorMessage);
    }
  } catch (error) {
    return null;
  }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM

  // fetch the data element from the dom where col element need to be inserted
  const dataElement = document.querySelector("#data");

  // set the innerHTML of the dataElement to empty
  dataElement.innerHTML = "";

  // loop through each of the adventures and add all of then to DOM
  adventures.forEach((adventure) => {
    // create a colElement which acts as a bootstrap column
    const colElement = document.createElement("div");

    // set the class attribute on the col element
    colElement.setAttribute("class", "col-md-6 col-lg-3 mt-3");

    // cardHTML that need to inserted in bootstrap column
    const cardHTML = `
    <div class='activity-card'>
        <div class='category-banner'>${adventure.category}</div>
        <a id="${adventure.id}" href="detail/?adventure=${adventure.id}">
            <img src=${adventure.image} >
            <div class='activity-card-text p-3 d-flex flex-column justify-content-between'>
                <div class='description-text d-flex justify-content-between'>
                    <h4 class='fs-6 w-75'>${adventure.name}</h4>
                    <span>₹${adventure.costPerHead}</span>
                </div>
                <div class='duration-text d-flex justify-content-between'>
                    <h4 class='fs-6'>Duration</h4>
                    <span>${adventure.duration} hours</span>
                </div>
            </div>
        </a>
    </div>
  `;
    // set the innerHTML of colElement to cardHTML
    colElement.innerHTML = cardHTML;

    // append the calElement to dataElement
    dataElement.append(colElement);
  });
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.

function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list.
  const filteredList = list.filter((listItem) => {
    return listItem.duration >= low && listItem.duration <= high;
  });

  return filteredList;
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list

  //show activity card if filters selected
  // Iterate over the list and filter the lists that matches the category list items
  const filteredList = list.filter((listItem) => {
    // Check if the current list item matches any of the target category
    return categoryList.includes(listItem.category);
  });

  return filteredList;
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods

  if (filters.category.length !== 0) {
    list = filterByCategory(list, filters.category);
  }

  // call filterByDuration method only if its truthy
  if (filters.duration) {
    // extract the low and high values using split and destructuring
    const [low, high] = filters.duration.split("-");

    // get adventures filtered by duration
    list = filterByDuration(list, low, high);
  }

  // Place holder for functionality to work in the Stubs
  return list;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage
  window.localStorage.setItem("filters", JSON.stringify(filters));
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object

  // Place holder for functionality to work in the Stubs
  return JSON.parse(window.localStorage.getItem("filters"));
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills
  const categoryPills = document.querySelector("#category-list");

  // Set the innerHTML of the categoryPills to empty
  categoryPills.innerHTML = "";

  // Loop over the category key of filter object and populate pills into the DOM
  filters.category.forEach((categoryItem) => {
    // Create a span element for the pill
    const pillElement = document.createElement("p");

    // Set the class attribute of the pill element
    pillElement.setAttribute("class", "category-filter");

    // add the HTML necessary for the pill element
    pillElement.innerHTML = `
        <span>${categoryItem}</span>
        <ion-icon name="close-outline" id="close-icon"></ion-icon>
    `;

    // append the pill element to the categoryPills
    categoryPills.append(pillElement);
  });

  // UPDATING DURATION FILTER VALUE
  // Extract the low value of the duration filter
  const [lowString] = filters.duration.split("-");

  // Now the low is of type string, convert it to integer
  const low = parseInt(lowString);

  // use if else to set the duration filter value
  if (low === 0) setDurationFilterValue(1);
  else if (low === 2) setDurationFilterValue(2);
  else if (low === 6) setDurationFilterValue(3);
  else if (low === 12) setDurationFilterValue(4);
}

function setDurationFilterValue(indexValue) {
  const durationElement = document.querySelector("#duration-select");
  durationElement.selectedIndex = indexValue;
}

function removeFilterPillAndUpdateDOM(adventures, filters) {
  // Get the parent element of all the pills
  const categoryListElement = document.querySelector("#category-list");

  // add an event listener to the parent element
  // with the help of EVENT PROPOGATION handle the clicks on the child pill elements -
  // to remove the filter pill and update DOM
  categoryListElement.addEventListener("click", function (e) {
    // Get the target element, so we can differentiate between which element is clicked -
    // and make the code work for only close button
    const targetElement = e.target;

    // check the targetElement is the close button or not -
    // if not just RETURN as we dont want to run our code for other clicks
    if (targetElement.id !== "close-icon") return;

    // Now, get the closest element of the target element which has the -
    // classname as 'category-filter', so that we can extract the text content -
    // of the pill we have clicked on
    const targetParent = targetElement.closest(".category-filter");

    // Now we have got the parent element of the target, we can extract its textcontent -
    // and use it to filter the adventures
    const filterToRemove = targetParent.querySelector("span").textContent;

    // Remove the filters from filter.category
    filters.category = filters.category.filter(
      (filter) => filter !== filterToRemove
    );

    // update the filter pill section
    generateFilterPillsAndUpdateDOM(filters);

    // Get the adventures with new filters
    const filteredAdventures = filterFunction(adventures, filters);

    // Populate the dom with new filtered adventures
    addAdventureToDOM(filteredAdventures);

    // update the filters in local storage
    saveFiltersToLocalStorage(filters);
  });
}


export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
  removeFilterPillAndUpdateDOM,
};
