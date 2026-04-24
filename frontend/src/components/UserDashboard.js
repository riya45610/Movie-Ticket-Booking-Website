import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import MovieList from './MovieList';
import SeatBooking from './SeatBooking';
import './UserDashboard.css';

function UserDashboard() {
  const { logout, user } = useAuth();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('movies');
  
  // Location state
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    city: null,
    loading: true,
    error: null
  });
  
  // Theaters state
  const [theaters, setTheaters] = useState([]);
  const [nearbyTheaters, setNearbyTheaters] = useState([]);
  
  // Movies state for location-based recommendations
  const [movies, setMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  // Get user's live location
  const getCurrentLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    if (!navigator.geolocation) {
      setLocation(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Geolocation is not supported by this browser' 
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get city name
          const response = await axios.get(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          const city = response.data.city || response.data.locality || 'Unknown Location';
          
          setLocation({
            latitude,
            longitude,
            city,
            loading: false,
            error: null
          });
        } catch (error) {
          // Fallback: just set coordinates without city name
          setLocation({
            latitude,
            longitude,
            city: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            loading: false,
            error: null
          });
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setLocation(prev => ({ 
          ...prev, 
          loading: false, 
          error: errorMessage 
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Get location on component mount
  useEffect(() => {
    getCurrentLocation();
    fetchTheaters();
    fetchMovies();
  }, []);

  // Update nearby theaters and recommendations when location changes
  useEffect(() => {
    if (location.city && theaters.length > 0) {
      filterNearbyTheaters();
    }
    if (location.city && movies.length > 0) {
      generateRecommendations();
    }
  }, [location.city, theaters, movies]);

  const fetchTheaters = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/theaters');
      setTheaters(response.data);
    } catch (error) {
      console.error('Error fetching theaters:', error);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const filterNearbyTheaters = () => {
    if (!location.city) return;
    
    // Filter theaters based on location string matching
    const nearby = theaters.filter(theater => 
      theater.location && 
      (theater.location.toLowerCase().includes(location.city.toLowerCase()) ||
       location.city.toLowerCase().includes(theater.location.toLowerCase()))
    );
    
    setNearbyTheaters(nearby);
  };

  // Filter movies based on location
  const filterMoviesByLocation = (moviesList) => {
    if (!location.city || !moviesList) return moviesList;
    
    // For now, we show all movies but log the location
    // In a real application, you would filter based on which theaters in the location are showing these movies
    console.log(`Filtering ${moviesList.length} movies for location: ${location.city}`);
    
    // Future implementation would filter movies based on theater showings in the user's location
    return moviesList;
  };

  const generateRecommendations = () => {
    if (!location.city || movies.length === 0) return;
    
    // Simple recommendation logic based on location
    // In a real app, this would be more sophisticated
    const city = location.city.toLowerCase();
    
    // Recommend movies based on city/popular genres
    let recommended = [];
    
    if (city.includes('mumbai') || city.includes('delhi') || city.includes('bangalore')) {
      // Major cities - recommend action/blockbuster movies
      recommended = movies.filter(movie => 
        movie.genre && movie.genre.toLowerCase().includes('action')
      );
    } else {
      // Other cities - recommend popular movies
      recommended = movies.slice(0, 3); // Show first 3 movies
    }
    
    // If no specific recommendations, show random movies
    if (recommended.length === 0) {
      recommended = movies.slice(0, 3);
    }
    
    setRecommendedMovies(recommended);
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setShowBooking(true);
    setTimeout(() => {
      document.getElementById('booking-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleBackToMovies = () => {
    setShowBooking(false);
    setSelectedMovie(null);
    setActiveNav('movies');
  };

  const refreshLocation = () => {
    getCurrentLocation();
  };

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <div className="logo">
            <div className="logo-icon">C</div>
            <span className="logo-text">CineVerse</span>
          </div>

          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search for movies, events, plays, sports..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="header-actions">
            {/* Location Display */}
            <div className="location-display">
              {location.loading ? (
                <div className="location-loading">
                  <span className="location-icon">📍</span>
                  <span>Getting location...</span>
                </div>
              ) : location.error ? (
                <div className="location-error">
                  <span className="location-icon">📍</span>
                  <span>{location.error}</span>
                  <button className="location-refresh" onClick={refreshLocation} title="Retry">
                    ↻
                  </button>
                </div>
              ) : (
                <div className="location-info">
                  <span className="location-icon">📍</span>
                  <span className="location-city">{location.city}</span>
                  <button className="location-refresh" onClick={refreshLocation} title="Refresh location">
                    ↻
                  </button>
                </div>
              )}
            </div>
            
            <span className="user-greeting">Hi, {user?.fullName || user?.username}</span>
            <button className="header-btn sign-in-btn" onClick={logout}>Logout</button>
          </div>
        </div>

        <nav className="nav-bar">
          <a 
            href="#" 
            className={`nav-item ${activeNav === "movies" ? "active" : ""}`}
            onClick={(e) => { e.preventDefault(); handleBackToMovies(); }}
          >
            Movies
          </a>
          {Array.from(new Set(movies.map(movie => movie.genre))).map((genre, index) => (
            <a 
              key={genre}
              href="#" 
              className={`nav-item ${activeNav === genre.toLowerCase() ? "active" : ""}`}
              onClick={(e) => { 
                e.preventDefault(); 
                setActiveNav(genre.toLowerCase());
              }}
            >
              {genre}
            </a>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-container">
        {/* Nearby Theaters Section */}
        {nearbyTheaters.length > 0 && (
          <section className="nearby-theaters-section">
            <h2 className="section-title">
              <span className="theater-icon">🏛️</span>
              Theaters in {location.city} ({nearbyTheaters.length})
            </h2>
            <div className="theaters-grid">
              {nearbyTheaters.map(theater => (
                <div key={theater.id} className="theater-card">
                  <div className="theater-header">
                    <h3 className="theater-name">{theater.name}</h3>
                    <span className="theater-screen-type">{theater.screenType}</span>
                  </div>
                  <div className="theater-details">
                    <div className="theater-location">
                      <span className="location-icon">📍</span>
                      {theater.location}
                    </div>
                    <div className="theater-capacity">
                      <span className="capacity-icon">👥</span>
                      Capacity: {theater.capacity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Location-Based Movie Recommendations */}
        {location.city && recommendedMovies.length > 0 && (
          <section className="recommended-movies-section">
            <h2 className="section-title">
              🎯 Recommended Movies for {location.city}
            </h2>
            <div className="recommended-movies-grid">
              {recommendedMovies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="recommended-movie-card"
                  onClick={() => handleMovieSelect(movie)}
                >
                  <div className="movie-poster">
                    {movie.posterUrl ? (
                      <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    <div className="movie-overlay">
                      <span className="book-now">Book Now</span>
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-details">
                      <span className="movie-language">{movie.language}</span>
                      <span className="movie-genre">{movie.genre}</span>
                      <span className="movie-duration">{movie.duration}min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Show Movie List for Movies tab */}
        {activeNav === 'movies' && (
          <MovieList onMovieSelect={handleMovieSelect} searchQuery={searchQuery} location={location.city} />
        )}

        {/* All Movies in Location */}
        {location.city && movies.length > 0 && (
          <section className="location-movies-section">
            <h2 className="section-title">
              🎬 All Movies in {location.city}
            </h2>
            <div className="movies-grid">
              {movies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="movie-card"
                  onClick={() => handleMovieSelect(movie)}
                >
                  <div className="movie-image">
                    {movie.posterUrl ? (
                      <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      <span>🎭 {movie.genre}</span>
                      <span>🗣 {movie.language}</span>
                    </div>
                    <div className="movie-format">
                      <span className="format-tag">{movie.duration} min</span>
                    </div>
                    <div className="movie-content">
                      <p className="movie-description">
                        {movie.description || 'Experience the magic of cinema with this captivating film.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Show movies by genre */}
        {activeNav !== 'movies' && (
          <section className="genre-movies-section">
            <h2 className="section-title">
              🎬 {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)} Movies
            </h2>
            <div className="movies-grid">
              {movies
                .filter(movie => {
                  const genre = movie.genre ? movie.genre.toLowerCase() : '';
                  // allow partial matches and comma-separated genres
                  return genre.split(',').map(g => g.trim()).some(g => g === activeNav);
                })
                .map(movie => (
                  <div 
                    key={movie.id} 
                    className="movie-card"
                    onClick={() => handleMovieSelect(movie)}
                  >
                    <div className="movie-image">
                      <img src={movie.posterUrl || '/default-poster.jpg'} alt={movie.title} />
                    </div>
                    <div className="movie-info">
                      <h3 className="movie-title">{movie.title}</h3>
                      <div className="movie-meta">
                        <span>🎭 {movie.genre}</span>
                        <span>🗣 {movie.language}</span>
                      </div>
                      <div className="movie-format">
                        <span className="format-tag">{movie.duration} min</span>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </section>
        )}

        {/* Show Booking Section when a movie is selected */}
        {showBooking && selectedMovie && (
          <div id="booking-section">
            <SeatBooking selectedMovie={selectedMovie} />
          </div>
        )}
      </main>
    </div>
  );
}

export default UserDashboard;
