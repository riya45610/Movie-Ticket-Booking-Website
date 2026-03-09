import React, { useEffect, useState } from "react";
import axios from "axios";

function MovieList({ onMovieSelect, searchQuery = '', activeMovieTab = 'nowshowing', location = '' }) {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [localActiveTab, setLocalActiveTab] = useState("nowshowing");

  useEffect(() => {
    fetchMovies();
    // Refresh movies every 5 seconds to see updates in real-time
    const interval = setInterval(fetchMovies, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchQuery, localActiveTab, activeMovieTab, location]);

  const fetchMovies = () => {
    axios.get("http://localhost:8080/api/movies")
      .then((res) => setMovies(res.data))
      .catch((error) => console.error('Error fetching movies:', error));
  };

  const filterMovies = () => {
    let result = movies;

    // Filter by tab (Now Showing vs Coming Soon)
    const activeTab = activeMovieTab || localActiveTab;
    if (activeTab === 'nowshowing') {
      result = result.filter(m => m.status !== 'COMING_SOON');
    } else if (activeTab === 'comingsoon') {
      result = result.filter(m => m.status === 'COMING_SOON');
    }

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(query) ||
        m.genre.toLowerCase().includes(query) ||
        m.language.toLowerCase().includes(query)
      );
    }

    // Filter by location if provided
    if (location && location.trim()) {
      // In a real application, you would filter movies based on which theaters are showing them in the user's location
      // For now, we'll show all movies but log the location for future implementation
      console.log(`Filtering movies for location: ${location}`);
      
      // Future implementation would look something like:
      // result = result.filter(movie => 
      //   movie.showings.some(showing => 
      //     showing.theater.location.toLowerCase().includes(location.toLowerCase())
      //   )
      // );
    }

    setFilteredMovies(result);
  };

  return (
    <div>
      {/* Movie Tabs */}
      <div className="movie-tabs">
        <button 
          className={`movie-tab ${(activeMovieTab || localActiveTab) === "nowshowing" ? "active" : ""}`}
          onClick={() => setLocalActiveTab("nowshowing")}
        >
          Now Showing
        </button>
        <button 
          className={`movie-tab ${(activeMovieTab || localActiveTab) === "comingsoon" ? "active" : ""}`}
          onClick={() => setLocalActiveTab("comingsoon")}
        >
          Coming Soon
        </button>
      </div>

      <h2 className="section-title">Movies {(activeMovieTab || localActiveTab) === "comingsoon" ? "Coming Soon" : "in Theaters"} ({filteredMovies.length})</h2>

      {/* Movie Cards Grid */}
      <div className="movies-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((m) => (
            <div 
              key={m.id} 
              className="movie-card"
              onClick={() => onMovieSelect && onMovieSelect(m)}
            >
              <div className="movie-image">
                {/* Display poster image if available */}
                {m.posterUrl ? (
                  <img src={m.posterUrl} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)}, #2C3154)`
                  }}>
                    <span style={{ fontSize: '60px' }}>🎬</span>
                  </div>
                )}
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{m.title}</h3>
                <div className="movie-meta">
                  <span>🎭 {m.genre}</span>
                  <span>🗣 {m.language}</span>
                </div>
                <div className="movie-format">
                  <span className="format-tag">{m.duration} min</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <p>
              {searchQuery ? `No movies found matching "${searchQuery}"` : 
               (activeMovieTab || localActiveTab) === 'comingsoon' ? 'No coming soon movies available' :
               'No movies available. Please check back later!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieList;
