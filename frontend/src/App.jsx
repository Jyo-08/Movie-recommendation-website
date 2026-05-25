import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("spiderman");
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [mood, setMood] = useState("");
  const [aiKeyword, setAiKeyword] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [watchProviders, setWatchProviders] = useState(null);


  const fetchMovies = async () => {
    if (!search.trim()) return;
    window.scrollTo({
  top: 700,
  behavior: "smooth",
});
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:5050/movies/search?q=${search}`
      );

      setMovies(res.data.Search || []);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const fetchMovieDetails = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:5050/movies/details/${id}`
    );

    setSelectedMovie(res.data);
    setWatchProviders(null);
  } catch (error) {
    console.error(error);
  }
};

const addToFavorites = async (movie) => {
  try {
    const res = await axios.post("http://localhost:5050/favorites", movie);
    alert(res.data.message || "Added to favorites ⭐");
  } catch (error) {
    console.error(error);
    alert("Something went wrong while adding favorite");
  }
};
  const fetchAiRecommendations = async () => {
  if (!mood.trim()) return;

  setLoading(true);

  try {
    const res = await axios.get(
      `http://localhost:5050/movies/ai-recommend?mood=${mood}`
    );

    setAiKeyword(res.data.keyword);
    setMovies(res.data.movies || []);
  } catch (error) {
    console.error(error);
  }

  setLoading(false);
};
const fetchFavorites = async () => {
  setLoading(true);

  try {
    const res = await axios.get("http://localhost:5050/favorites");

    const formattedFavorites = res.data.map((movie) => ({
      imdbID: movie.movie_id,
      Title: movie.title,
      Year: movie.overview,
      Poster: movie.poster_path,
      Type: "favorite",
    }));

    setMovies(formattedFavorites);
    setAiKeyword("");
  } catch (error) {
    console.error(error);
  }

  setLoading(false);
};

const searchByLanguage = async (language) => {
  setLoading(true);

  const languageMovies = {
    tamil: "Vikram",
    hindi: "Dangal",
    telugu: "RRR",
    malayalam: "Drishyam",
  };

  try {
    const res = await axios.get(
      `http://localhost:5050/movies/search?q=${languageMovies[language]}`
    );

    setSearch(languageMovies[language]);
    setAiKeyword(`${language.toUpperCase()} movie pick`);
    setMovies(res.data.Search || []);
  } catch (error) {
    console.error(error);
  }

  setLoading(false);
};
const fetchTrendingMovies = async () => {
  try {
    const trendingList = [
      "Avengers",
      "Spider-Man",
      "Interstellar",
      "Inception",
      "Joker",
      "Leo",
    ];

    const randomMovie =
      trendingList[Math.floor(Math.random() * trendingList.length)];

    const res = await axios.get(
      `http://localhost:5050/movies/search?q=${randomMovie}`
    );

    setTrendingMovies(res.data.Search?.slice(0, 8) || []);
  } catch (error) {
    console.error(error);
  }
};
const removeFromFavorites = async (id) => {
  try {
    await axios.delete(`http://localhost:5050/favorites/${id}`);
    alert("Removed from favorites");

    fetchFavorites();
  } catch (error) {
    console.error(error);
    alert("Failed to remove favorite");
  }
};
useEffect(() => {
  fetchTrendingMovies();
}, []);

const fetchWatchProviders = async (movieTitle) => {
  try {
    const searchRes = await axios.get(
      `http://localhost:5050/tmdb/search?q=${movieTitle}`
    );

    const bestMatch = searchRes.data[0];

    if (!bestMatch) {
      setWatchProviders({
        flatrate: [],
        rent: [],
        buy: [],
        link: null,
      });
      return;
    }

    const watchRes = await axios.get(
      `http://localhost:5050/tmdb/watch/${bestMatch.id}`
    );

    setWatchProviders(watchRes.data);
  } catch (error) {
    console.error(error);
  }
};

  return (
  <div className="app">
    <div className="overlay"></div>

    <header className="hero">
    <div className="hero-banner">
  <div>
    <span>Featured Pick</span>
    <h3>Spider-Man Collection</h3>
    <p>Start your movie journey with Marvel energy.</p>
  </div>
</div>
      <p className="tagline">Cinema starts here</p>

      <h1>Movie Recommendation Website</h1>

      <p className="subtitle">
        Search movies, discover stories, and save your favourites.
      </p>

      <div className="hero-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchMovies()}
          />

          <button onClick={fetchMovies}>Search</button>
        </div>

        <div className="ai-box">
          <input
            type="text"
            placeholder="Tell AI your mood... eg: I feel sad, I want mass Tamil movie"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchAiRecommendations()}
          />

          <button onClick={fetchAiRecommendations}>Ask AI 🤖</button>
        </div>

        {aiKeyword && (
          <p className="ai-result">
            AI picked: <span>{aiKeyword}</span>
          </p>
        )}

        <button className="favorites-view-btn" onClick={fetchFavorites}>
          ❤️ View Favorites
        </button>

        <div className="language-chips">
          <button onClick={() => searchByLanguage("tamil")}>Tamil</button>
          <button onClick={() => searchByLanguage("hindi")}>Hindi</button>
          <button onClick={() => searchByLanguage("telugu")}>Telugu</button>
          <button onClick={() => searchByLanguage("malayalam")}>Malayalam</button>
        </div>
      </div>
    </header>
    <section className="trending-section">
  <div className="section-heading">
    <h2>🔥 Trending Now</h2>
    <p>Binge-worthy picks</p>
  </div>

  <div className="trending-row">
    {trendingMovies.map((movie) => (
      <div
        className="trending-card"
        key={movie.imdbID}
        onClick={() => fetchMovieDetails(movie.imdbID)}
      >
        <img
          src={
            movie.Poster && movie.Poster !== "N/A"
              ? movie.Poster
              : "https://placehold.co/300x450/111111/ffcc00?text=No+Poster"
          }
          alt={movie.Title}
        />

        <p>{movie.Title}</p>
      </div>
    ))}
  </div>
</section>

    <section className="section-heading">
      <h2>Now Showing</h2>
      <p>{movies.length} results found</p>
    </section>

    {loading ? (
     <div className="loading-box">
  <div className="reel-loader"></div>
  <p>Rolling the reels...</p>
</div>
    ) : (
      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            className="movie-card"
            key={movie.imdbID}
            onClick={() => fetchMovieDetails(movie.imdbID)}
          >
            <div className="poster-wrap">
              <img
                src={
                  movie.Poster && movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://placehold.co/300x450/111111/ffcc00?text=No+Poster"
                }
                alt={movie.Title}
              />
            </div>

            <div className="movie-info">
              <h2>{movie.Title}</h2>
              <p>{movie.Year}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToFavorites(movie);
                }}
              >
                Add to Favorites ⭐
              </button>
              {movie.Type === "favorite" && (
  <button
    className="remove-btn"
    onClick={(e) => {
      e.stopPropagation();
      removeFromFavorites(movie.imdbID);
    }}
  >
    Remove ❌
  </button>
)}
            </div>
          </div>
        ))}
        
      </div>
    )}

    {selectedMovie && (
      <div className="modal-overlay">
        <div className="movie-modal">
          <button
            className="close-btn"
            onClick={() => setSelectedMovie(null)}
          >
            ✕
          </button>

          <img
            src={
              selectedMovie.Poster && selectedMovie.Poster !== "N/A"
                ? selectedMovie.Poster
                : "https://placehold.co/300x450/111111/ffcc00?text=No+Poster"
            }
            alt={selectedMovie.Title}
          />

          <div className="modal-content">
            <h2>{selectedMovie.Title}</h2>

            <p><strong>Year:</strong> {selectedMovie.Year}</p>
            <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
            <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
            <p><strong>IMDb:</strong> ⭐ {selectedMovie.imdbRating}</p>

            <a
              href={`https://www.youtube.com/results?search_query=${selectedMovie.Title} official trailer`}
              target="_blank"
              rel="noreferrer"
              className="trailer-btn"
            >
              ▶ Watch Trailer
            </a>
            <button
  className="watch-btn"
  onClick={() => fetchWatchProviders(selectedMovie.Title)}
>
  🍿 Where to Watch
</button>

{watchProviders && (
  <div className="watch-providers">
    <h3>Available On</h3>

    {watchProviders.flatrate.length > 0 ? (
      watchProviders.flatrate.map((provider) => (
        <div className="provider-card" key={provider.provider_id}>
          <img
            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
            alt={provider.provider_name}
          />
          <span>{provider.provider_name}</span>
        </div>
      ))
    ) : (
      <p>No streaming platform found for India.</p>
    )}

    {watchProviders.link && (
      <a
        href={watchProviders.link}
        target="_blank"
        rel="noreferrer"
        className="provider-link"
      >
        View on TMDB
      </a>
    )}
  </div>
)}
            <p className="plot">{selectedMovie.Plot}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default App;