import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // async-await
  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    // Fetch API is available in the browser
    // GET request by default
    // API requests are async, hence Promises exist in JS
    try {
      const response = await fetch("https://swapi.dev/api/films");

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  let content = <p>No movies found.</p>;

  if (!isLoading && movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (!isLoading && error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        <p>{content}</p>
      </section>
    </React.Fragment>
  );
}

export default App;
