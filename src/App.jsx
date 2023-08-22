import React, { useState, useEffect, useCallback } from "react";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // async-await
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    // Fetch API is available in the browser
    // GET request by default
    // API requests are async, hence Promises exist in JS
    try {
      //Firebase Real time DB URL
      const response = await fetch(
        "https://react-movies-http-81c08-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      console.log(loadedMovies);

      // const transformedMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });
      setMovies(loadedMovies);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  // useEffect displays data immediately on page load
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  // Sending POST request, all API requests are async-await
  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-movies-http-81c08-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    console.log(data);
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
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
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
