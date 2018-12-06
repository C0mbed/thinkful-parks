'use strict';

// put your own value below!
const apiKey = 'hI4pAqDxakKktWPqxdqduGIQODgsavCz2emSBfrR'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p>Directions to the Park: ${responseJson.data[i].directionsInfo}</p>
      <p><a href="${responseJson.data[i].url}">Visit Park URL</a></p>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

//https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=hI4pAqDxakKktWPqxdqduGIQODgsavCz2emSBfrR

function getParks(query, maxResults, state) {
  console.log('getParks fired');
  const params = {
    api_key: apiKey,
    q: query,
    limit: maxResults,
    stateCode: state
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });

    watchForm();
}

function stateArray(state) {
  const newArray = state.split(" ");
  console.log('newArray is ', newArray);

  return newArray
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    const state = $('#js-search-states').val();
    if (state.length > 2) {
      const multiState = stateArray(state);
      getParks(searchTerm, maxResults, multiState);
    } else {
      getParks(searchTerm, maxResults, state);
    }
  });
}

$(watchForm);