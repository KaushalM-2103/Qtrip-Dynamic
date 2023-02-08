import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  const [_, adventureId] = search.split('=');
  return adventureId;
  // Place holder for functionality to work in the Stubs

}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call
  const URL = config.backendEndpoint + `/adventures/detail?adventure=${adventureId}`;

  try{
    const advDetailResponse = await fetch(URL);
    
    if(advDetailResponse.ok){
      const advDetailPage = await advDetailResponse.json();
      return advDetailPage;
    }else{
      const message = `Error ${advDetailResponse.status}`;
      throw new Error(message);
    }
  }
  catch(error){
    console.log(error.message);
    return null;
  }
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM

  //get all required element from DOM
  const adventureName = document.querySelector('#adventure-name');
  const adventureSubtitle = document.querySelector('#adventure-subtitle');
  const adventurePhotoGallery = document.querySelector('#photo-gallery');
  const adventureContent = document.querySelector('#adventure-content');

  adventureName.textContent = adventure.name;
  adventureSubtitle.textContent = adventure.subtitle;
  adventureContent.textContent = adventure.content;

  adventure.images.forEach(image => {
     // create a div element
     const imgContainerElement = document.createElement('div');

     // set the innerHTML of the divElement to image
     imgContainerElement.innerHTML = `/<img src=${image} class="activity-card-image" alt="adventure image">`;
 
     // append the div element to the photo gallery
     adventurePhotoGallery.append(imgContainerElement);
  });

}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the bootstrap carousel to show the Adventure images

  // Get Photo Gallery from DOM
  const photoGallery = document.querySelector("#photo-gallery")

  // Set Bootstrap Carousal
  photoGallery.innerHTML = `
  <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div class="carousel-inner">
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
  `
  const carouselElement  = document.querySelector('.carousel-inner');

  images.forEach((image, index) => {
    const carouselItem = document.createElement('div');

    // set the first image as active item
    const className = index === 0 ? 'carousel-item active' : 'carousel-item';
    carouselItem.setAttribute('class', className);

    // set the innerHTML of the carousel item to image
    carouselItem.innerHTML = `
      <img src=${image} class="activity-card-image" alt="adventure image" >
    `;

    // append the carouel item to the carousel inner element
    carouselElement.append(carouselItem);
  })
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.
    // 1. If the adventure is already reserved, display the sold-out message.
    console.log(adventure)

    // select the sold out section element and reservation panel element
    const soldOut = document.querySelector('#reservation-panel-sold-out');
    const available = document.querySelector('#reservation-panel-available');
  
    // Conditionally render sold out and availabel message.
    if(adventure.available) {
      const perPersonCost = document.querySelector('#reservation-person-cost');
      perPersonCost.innerHTML = adventure.costPerHead;
      soldOut.style.display = 'none';
      available.style.display = 'block';
    } else {
      soldOut.style.display = 'block';
      available.style.display = 'none';
    }

}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost field
   // get the element from the dom to update the total cost
   const reservationCostElement = document.querySelector('#reservation-cost');

   const perHeadCost = adventure.costPerHead;
 
   const totalCost = perHeadCost * persons;
 
   reservationCostElement.textContent = totalCost;
}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using fetch() to make the reservation
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".
  // Get the form and other input elements from the DOM
  const elementForm = document.querySelector('#myForm');
  const elementName = document.querySelector('[name = "name"]');
  const elementDate = document.querySelector('[name = "date"]');
  const elementPerson = document.querySelector('[name = "person"]');

  console.log(elementForm, elementName, elementDate, elementPerson)

  elementForm.addEventListener('submit', async function(e) {
    // Create the form data that needs to be send over to the backend
    e.preventDefault();
    const formData = {
      adventure: adventure.id,
      name: elementName.value,
      date: elementDate.value,
      person: elementPerson.value,
    }

    // Create a URL to which we need to hit to make a POST request
    const URL = `${config.backendEndpoint}/reservations/new`;

    // Sorround the code with try and catch block which has a network call to be made
    try {
      const reservationResponse = await fetch(URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify(formData),
      })

      // Check if the response is ok or not
      if(reservationResponse.ok) {
        // Alert the user with a success message and reload the page
        // window.alert("Success");
        // window.location.reload();
      } 
      // If the response is not ok throw an error
      else {
        // Alert the user with a Error message
        window.alert("Failed");
        const message = `⚡⚡An error occurred with a status code of ${reservationResponse.status}⚡⚡`;
        throw new Error(message);
      }
    }

    // Catch any errors that may happed during a network call
    catch(error) {
      console.log(error);
      return null;
    }
  })
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't
// Get the reseved banner element from the DOM
const reservedBannerElement = document.querySelector('#reserved-banner');

// Show the banner if the adventure is reserved else hide it
if(adventure.reserved) {
  reservedBannerElement.style.display = 'block';
} else {
  reservedBannerElement.style.display = 'none';
}
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
