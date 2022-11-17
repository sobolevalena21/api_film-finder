// In this project, you’ll use your knowledge of HTTP requests and asynchronous JavaScript to create a movie discovery app that will recommend random movies by genre. You’ll be able to choose from several genres, and like or dislike a movie to get another suggestion.

const tmdbKey = '393174085964de5ba1e282c8e7adb1cd';
const tmdbBaseUrl = 'https://api.themoviedb.org/3'; //Check the TMDB documentation to find the API’s base URL
const playBtn = document.getElementById('playBtn');

//To get a list of genres. making it asynchronous will simplify handling the promise our API call returns.
const getGenres = async() => {
  const genreRequestEndpoint='/genre/movie/list'; //Check the TMDB documentation to find the “Genres” API endpoint https://developers.themoviedb.org/3/genres/get-movie-list >> in Documentation, shows 'GET  /genre/movie/list' with description 'Get the list of official genres for movies.'
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}${requestParams}`;
  try {
    const response=await fetch(urlToFetch);//We need to await the resolution of our fetch() call so that we can do something with the data we get back.
    if(response.ok) {
      const jsonResponse = await response.json();//To get the requested data, convert the response object to a JSON object. Await the resolution of this method and save it to a variable called jsonResponse

      //console.log(jsonResponse);//To make sure your code is working, log jsonResponse to the console inside our if statement. You should see a single Object with a single key, genres. Because we need just an array and not the wholde object, we extract the array through the following code: 
      const genres = jsonResponse.genres;
      //console.log(genres) //should return just the array without the Object.
      return genres;
    }
  } catch(error) {
    console.log(error);
  }
};

// getMovies() is to fetch a list of movies based on the genre selected from the list of genres we returned in getGenres()
const getMovies = async () => {
  const selectedGenre = getSelectedGenre();//selectedGenre stores the returned value from a helper function getSelectedGenre() (see in helpers.js) that captures the user’s selected genre.
  const discoverMovieEndpoint = '/discover/movie'; //Discover movies by different types of data like genres, etc.  in Documentation, see 'GET /discover/movie' >> holdes info about each movies.
  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}`;
  const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;////check section 'Try it out' in the link above, showing this URL composition: "https://api.themoviedb.org/3/discover/movie?api_key=<<api_key>>&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=comedy&with_watch_monetization_types=flatrate"

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      //console.log(jsonResponse); to see the array in the console, need to call the whole function after its declaration. In the console, you’ll see a key called results that holds an array of all the movies in the first page of results.
      const movies = jsonResponse.results;// store the 'results' property of jsonResponse in a variable called movies. Log this variable to the console to confirm that it contains the correct information.
      //console.log(movies); 
      return movies;// Later on, we’ll use this list to select a random movie as a suggestion.
    }
  } catch(error) {
    console.log(error);
  }
};
//getMovies();//Call this function after its declaration above to see your output in the console for the above console.logs. In the console, you’ll see a key called results that holds an array of all the movies in the first page of results.
 
 
const getMovieInfo = async (movie) => {
  const movieId = movie.id;//We will be using the id property to make another call to the TMDB API.
  const movieEndpoint= `/movie/${movieId}`// GET /movie/{movie_id} https://developers.themoviedb.org/3/movies/get-movie-details
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;//check section 'Try it out' in the link above, showing this URL composition: "https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>&language=en-US"

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const movieInfo = jsonResponse;
      return movieInfo;
    }
  } catch(error) {
    console.log(error);
};
};

// Renders a random movie’s info to the page.
const showRandomMovie = async () => {
  const movieInfo = document.getElementById('movieInfo');
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  };
  const movies = await getMovies(); //array of movies in the selected genre
  const randomMovie = getRandomMovie(movies); //pick a random movie from the array above
  const info = await getMovieInfo(randomMovie); // get that movie's info
  displayMovie(info); // display it in a certain way (see helpers.js)
};

getGenres().then(populateGenreDropdown);
playBtn.onclick = showRandomMovie;

/* If you’re looking for additional ways to challenge yourself, consider the following:
 * Checkout the displayMovie() function in helpers.js to use the DOM to rearrange the layout of information on the page. Try displaying different types of information like cast, or release date.
* Create a way to store a user’s liked and disliked movies and display this list on the page.
* Our API call inside of getMovies() returns many pages of results, but currently our program only randomizes results from the first page. To randomize our results even more, update getMovies() so that movies contains results from a random page instead of the first page.