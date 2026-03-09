import React, { useState, useEffect } from "react";
import axios from "axios";

function SeatBooking({ selectedMovie }) {
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [showToast, setShowToast] = useState(false);
  const defaultOccupied = ["A3", "A4", "B2", "B7", "C5", "D1", "D8", "E3", "E6", "F2"];
  const [occupiedSeats, setOccupiedSeats] = useState(defaultOccupied);

  const rows = [
    { label: "A", seats: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"] },
    { label: "B", seats: ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8"] },
    { label: "C", seats: ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"] },
    { label: "D", seats: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"] },
    { label: "E", seats: ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"] },
    { label: "F", seats: ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8"] },
  ];

  useEffect(() => {
    if (selectedMovie) {
      fetchBookedSeats();
    }
  }, [selectedMovie]);

  const fetchBookedSeats = async () => {
    if (!selectedMovie) return;

    try {
      const response = await axios.get(`http://localhost:8080/api/bookings/movie/${selectedMovie.id}`);
      const bookings = response.data;
      const bookedSeats = [];
      bookings.forEach((booking) => {
        if (booking.seats) {
          const seats = booking.seats.split(",").map((s) => s.trim());
          bookedSeats.push(...seats);
        }
      });
      setOccupiedSeats(bookedSeats);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Fallback to default occupied seats if API fails
      setOccupiedSeats(defaultOccupied);
    }
  };

  const toggle = (seat) => {
    if (occupiedSeats.includes(seat)) return;
    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((x) => x !== seat) : [...prev, seat]
    );
  };

  const book = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (selected.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    if (!selectedMovie) {
      alert("No movie selected");
      return;
    }

    try {
      const bookingData = {
        customerName: name,
        seats: selected.join(","),
        totalAmount: selected.length * 200,
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title
      };

      const response = await axios.post("http://localhost:8080/api/bookings", bookingData);

      // Update occupied seats with newly booked seats
      setOccupiedSeats((prev) => [...prev, ...selected]);

      setShowToast(true);
      setSelected([]);
      setName("");

      // Refresh booked seats after successful booking
      setTimeout(() => {
        setShowToast(false);
        fetchBookedSeats();
      }, 3000);

    } catch (error) {
      console.error("Booking error:", error);
      if (error.response && error.response.data) {
        alert("Booking failed: " + error.response.data);
      } else {
        alert("Booking failed. Please try again.");
      }
    }
  };

  const seatPrice = 200;
  const convenienceFee = 30;
  const total =
    selected.length * seatPrice + (selected.length > 0 ? convenienceFee : 0);

  return (
    <div className="booking-section">
      <div className="booking-header">
        <h2 className="booking-title">Select Seats</h2>
        {selectedMovie && (
          <span className="selected-movie">🎬 {selectedMovie.title}</span>
        )}
      </div>

      <div className="screen"></div>

      <div className="legend">
        <div className="legend-item">
          <div
            className="legend-seat"
            style={{ background: "rgba(255, 255, 255, 0.15)" }}
          ></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-seat"
            style={{
              background: "linear-gradient(135deg, #F845F5, #E21B70)",
            }}
          ></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-seat"
            style={{ background: "rgba(255, 255, 255, 0.05)" }}
          ></div>
          <span>Occupied</span>
        </div>
      </div>

      <div className="seat-grid">
        {rows.map((row) => (
          <div key={row.label} className="seat-row">
            <span className="row-label">{row.label}</span>
            {row.seats.map((seat) => {
              const isOccupied = occupiedSeats.includes(seat);
              const isSelected = selected.includes(seat);
              return (
                <button
                  key={seat}
                  className={`seat ${
                    isOccupied
                      ? "occupied"
                      : isSelected
                      ? "selected"
                      : "available"
                  }`}
                  onClick={() => toggle(seat)}
                  disabled={isOccupied}
                  title={isOccupied ? "Already booked" : `Seat ${seat}`}
                >
                  {seat}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="booking-form">
        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {selected.length > 0 && (
          <div className="price-summary">
            <div className="price-row">
              <span>
                Ticket Price (₹{seatPrice} x {selected.length})
              </span>
              <span>₹{selected.length * seatPrice}</span>
            </div>
            <div className="price-row">
              <span>Convenience Fee</span>
              <span>₹{convenienceFee}</span>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <span className="price-value">₹{total}</span>
            </div>
          </div>
        )}

        <button
          className="book-btn"
          onClick={book}
          disabled={selected.length === 0 || !name.trim()}
        >
          Book Tickets
        </button>
      </div>

      {showToast && (
        <div className="toast">
          🎉 Booking successful! Your tickets have been booked.
        </div>
      )}
    </div>
  );
}

export default SeatBooking;
