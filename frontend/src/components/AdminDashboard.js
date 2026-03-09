import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

function AdminDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ movies: 0, theaters: 0, bookings: 0, revenue: 0 });
  const [newMovie, setNewMovie] = useState({ title: '', language: '', genre: '', duration: 0, posterUrl: '' });
  const [newTheater, setNewTheater] = useState({ name: '', location: '', capacity: 0, screenType: '' });
  const [editingMovie, setEditingMovie] = useState(null);
  const [editingTheater, setEditingTheater] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [moviesRes, theatersRes, bookingsRes, statsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/admin/movies', config),
        axios.get('http://localhost:8080/api/admin/theaters', config),
        axios.get('http://localhost:8080/api/admin/bookings', config),
        axios.get('http://localhost:8080/api/admin/stats', config)
      ]);
      setMovies(moviesRes.data);
      setTheaters(theatersRes.data);
      setBookings(bookingsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/admin/movies', newMovie);
      setNewMovie({ title: '', language: '', genre: '', duration: 0, posterUrl: '' });
      fetchData();
      alert('Movie added successfully!');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Error adding movie. Please try again.');
    }
  };

  const handleAddTheater = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/admin/theaters', newTheater);
      setNewTheater({ name: '', location: '', capacity: 0, screenType: '' });
      fetchData();
      alert('Theater added successfully!');
    } catch (error) {
      console.error('Error adding theater:', error);
      alert('Error adding theater. Please try again.');
    }
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    if (!editingMovie.title || !editingMovie.language || !editingMovie.genre || !editingMovie.duration) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/api/admin/movies/${editingMovie.id}`, editingMovie);
      console.log('Movie updated:', response.data);
      setEditingMovie(null);
      setNewMovie({ title: '', language: '', genre: '', duration: 0, posterUrl: '' });
      fetchData();
      alert('Movie updated successfully!');
    } catch (error) {
      console.error('Error updating movie:', error.response?.data || error.message);
      alert(`Error updating movie: ${error.response?.status} - ${error.response?.statusText || error.message}`);
    }
  };

  const handleUpdateTheater = async (e) => {
    e.preventDefault();
    if (!editingTheater.name || !editingTheater.location || !editingTheater.capacity || !editingTheater.screenType) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/api/admin/theaters/${editingTheater.id}`, editingTheater);
      console.log('Theater updated:', response.data);
      setEditingTheater(null);
      setNewTheater({ name: '', location: '', capacity: 0, screenType: '' });
      fetchData();
      alert('Theater updated successfully!');
    } catch (error) {
      console.error('Error updating theater:', error.response?.data || error.message);
      alert(`Error updating theater: ${error.response?.status} - ${error.response?.statusText || error.message}`);
    }
  };

  const startEditingMovie = (movie) => {
    setEditingMovie({ ...movie });
  };

  const startEditingTheater = (theater) => {
    setEditingTheater({ ...theater });
  };

  const cancelEditingMovie = () => {
    setEditingMovie(null);
  };

  const cancelEditingTheater = () => {
    setEditingTheater(null);
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/movies/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  const handleDeleteTheater = async (id) => {
    if (window.confirm('Are you sure you want to delete this theater?')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/theaters/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting theater:', error);
      }
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo">
            <span className="logo-icon">B</span>
            <span className="logo-text">BookMyShow</span>
          </div>
          <span className="admin-badge">Admin Panel</span>
        </div>
        <div className="admin-header-right">
          <span className="admin-welcome">Welcome, {user?.fullName || user?.username}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Admin Content */}
      <div className="admin-content">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'movies' ? 'active' : ''}`}
              onClick={() => setActiveTab('movies')}
            >
              <span className="nav-icon">🎬</span>
              Movies
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'theaters' ? 'active' : ''}`}
              onClick={() => setActiveTab('theaters')}
            >
              <span className="nav-icon">🏛️</span>
              Theaters
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <span className="nav-icon">🎟️</span>
              Bookings
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              <h2>Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🎬</div>
                  <div className="stat-info">
                    <h3>{stats.movies}</h3>
                    <p>Total Movies</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏛️</div>
                  <div className="stat-info">
                    <h3>{stats.theaters}</h3>
                    <p>Total Theaters</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎟️</div>
                  <div className="stat-info">
                    <h3>{stats.bookings}</h3>
                    <p>Total Bookings</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>₹{stats.revenue?.toLocaleString() || 0}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="recent-section">
                <h3>Recent Bookings</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Seats</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((booking) => (
                        <tr key={booking.id}>
                          <td>{booking.customerName}</td>
                          <td>{booking.seats}</td>
                          <td>₹{booking.totalAmount}</td>
                          <td>{new Date().toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'movies' && (
            <div className="movies-content">
              <h2>Movie Management</h2>
              
              {/* Add/Edit Movie Form */}
              <div className="add-movie-form">
                <h3>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h3>
                <form onSubmit={editingMovie ? handleUpdateMovie : handleAddMovie}>
                  <div className="form-grid">
                    <input
                      type="text"
                      placeholder="Movie Title"
                      value={editingMovie ? editingMovie.title : newMovie.title}
                      onChange={(e) => editingMovie ? setEditingMovie({ ...editingMovie, title: e.target.value }) : setNewMovie({ ...newMovie, title: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Language"
                      value={editingMovie ? editingMovie.language : newMovie.language}
                      onChange={(e) => editingMovie ? setEditingMovie({ ...editingMovie, language: e.target.value }) : setNewMovie({ ...newMovie, language: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Genre"
                      value={editingMovie ? editingMovie.genre : newMovie.genre}
                      onChange={(e) => editingMovie ? setEditingMovie({ ...editingMovie, genre: e.target.value }) : setNewMovie({ ...newMovie, genre: e.target.value })}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Duration (min)"
                      value={editingMovie ? editingMovie.duration : newMovie.duration}
                      onChange={(e) => editingMovie ? setEditingMovie({ ...editingMovie, duration: parseInt(e.target.value) }) : setNewMovie({ ...newMovie, duration: parseInt(e.target.value) })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Poster Image URL"
                      value={editingMovie ? editingMovie.posterUrl : newMovie.posterUrl}
                      onChange={(e) => editingMovie ? setEditingMovie({ ...editingMovie, posterUrl: e.target.value }) : setNewMovie({ ...newMovie, posterUrl: e.target.value })}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="add-btn">{editingMovie ? 'Update Movie' : 'Add Movie'}</button>
                      {editingMovie && (
                        <button type="button" className="delete-btn" onClick={cancelEditingMovie}>Cancel</button>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Movies List */}
              <div className="movies-list">
                <h3>All Movies</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Language</th>
                        <th>Genre</th>
                        <th>Duration</th>
                        <th>Poster URL</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movies.map((movie) => (
                        <tr key={movie.id}>
                          <td>{movie.id}</td>
                          <td>{movie.title}</td>
                          <td>{movie.language}</td>
                          <td>{movie.genre}</td>
                          <td>{movie.duration} min</td>
                          <td>{movie.posterUrl ? <a href={movie.posterUrl} target="_blank" rel="noopener noreferrer">View</a> : 'N/A'}</td>
                          <td>
                            <button 
                              className="edit-btn"
                              onClick={() => startEditingMovie(movie)}
                              style={{ marginRight: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteMovie(movie.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theaters' && (
            <div className="theaters-content">
              <h2>Theater Management</h2>
              
              {/* Add/Edit Theater Form */}
              <div className="add-movie-form">
                <h3>{editingTheater ? 'Edit Theater' : 'Add New Theater'}</h3>
                <form onSubmit={editingTheater ? handleUpdateTheater : handleAddTheater}>
                  <div className="form-grid">
                    <input
                      type="text"
                      placeholder="Theater Name"
                      value={editingTheater ? editingTheater.name : newTheater.name}
                      onChange={(e) => editingTheater ? setEditingTheater({ ...editingTheater, name: e.target.value }) : setNewTheater({ ...newTheater, name: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={editingTheater ? editingTheater.location : newTheater.location}
                      onChange={(e) => editingTheater ? setEditingTheater({ ...editingTheater, location: e.target.value }) : setNewTheater({ ...newTheater, location: e.target.value })}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Capacity"
                      value={editingTheater ? editingTheater.capacity : newTheater.capacity}
                      onChange={(e) => editingTheater ? setEditingTheater({ ...editingTheater, capacity: parseInt(e.target.value) }) : setNewTheater({ ...newTheater, capacity: parseInt(e.target.value) })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Screen Type (2D/3D/IMAX)"
                      value={editingTheater ? editingTheater.screenType : newTheater.screenType}
                      onChange={(e) => editingTheater ? setEditingTheater({ ...editingTheater, screenType: e.target.value }) : setNewTheater({ ...newTheater, screenType: e.target.value })}
                      required
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="add-btn">{editingTheater ? 'Update Theater' : 'Add Theater'}</button>
                      {editingTheater && (
                        <button type="button" className="delete-btn" onClick={cancelEditingTheater}>Cancel</button>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Theaters List */}
              <div className="movies-list">
                <h3>All Theaters</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Capacity</th>
                        <th>Screen Type</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {theaters.map((theater) => (
                        <tr key={theater.id}>
                          <td>{theater.id}</td>
                          <td>{theater.name}</td>
                          <td>{theater.location}</td>
                          <td>{theater.capacity}</td>
                          <td>{theater.screenType}</td>
                          <td>
                            <button 
                              className="edit-btn"
                              onClick={() => startEditingTheater(theater)}
                              style={{ marginRight: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteTheater(theater.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-content">
              <h2>Booking Management</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Seats</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.customerName}</td>
                        <td>{booking.seats}</td>
                        <td>₹{booking.totalAmount}</td>
                        <td>{new Date().toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
