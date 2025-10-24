// src/components/BookingForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "./BookingForm.scss";

const BookingForm = () => {
  const navigate = useNavigate();
  const { tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [date, setDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);

  // Load Razorpay
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Fetch tour
  useEffect(() => {
    if (!tourId) {
      alert("Invalid tour");
      navigate("/tours");
      return;
    }

    const fetchTour = async () => {
      try {
        const res = await API.get(`/tours/${tourId}`);
        setTour(res.data);
        if (res.data.availableDates?.length > 0) {
          const firstDate = new Date(res.data.availableDates[0])
            .toISOString()
            .split("T")[0];
          setDate(firstDate);
        }
      } catch (err) {
        console.error("Fetch tour error:", err);
        alert("Failed to load tour details");
        navigate("/tours");
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [tourId, navigate]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!tourId || !date) return;
    const fetchSlots = async () => {
      try {
        const res = await API.get(`/tours/${tourId}/available-slots`, {
          params: { date },
        });
        setAvailableSlots(res.data.availableSlots || []);
        setSlotTime(res.data.availableSlots?.[0] || "");
      } catch (err) {
        console.error("Slot fetch error:", err);
        setAvailableSlots([]);
        setSlotTime("");
      }
    };
    fetchSlots();
  }, [date, tourId]);

  const handlePayment = async () => {
    if (!date || !slotTime) {
      alert("Please select a valid date and time slot");
      return;
    }

    setPaymentLoading(true);
    try {
      const isoDate = new Date(date).toISOString();

      const orderRes = await API.post("/bookings/create-order", {
        tourId,
        participants: Number(participants),
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "Club Canova",
        description: `Booking for ${tour?.title || "Tour"}`,
        order_id: orderRes.data.id,
        handler: async (response) => {
          try {
            await API.post("/bookings/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              tourId,
              date: isoDate,
              slotTime,
              participants: Number(participants),
            });
            alert("✅ Booking confirmed! Payment successful.");
            navigate("/profile");
          } catch (err) {
            console.error("Verification error:", err);
            const errorMsg = err.response?.data?.message || "";
            if (errorMsg.includes("just booked") || errorMsg.includes("already booked")) {
              alert("⚠️ This time slot was just booked by another user. Please select a new slot.");
              navigate(`/tour/${tourId}`); // ← GO BACK TO TOUR PAGE
            } else {
              alert("❌ Payment verification failed. Please try again.");
            }
          }
        },
        prefill: {
          name: "Rinshad T",
          email: "rinshadthamerasseri@gmail.com",
          contact: "7561012039",
        },
        theme: { color: "#0a5f75" },
        modal: {
          ondismiss: () => {
            alert("Payment cancelled");
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Payment gateway loading. Try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.message || "Payment failed. Try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const totalAmount = tour ? tour.price * participants : 0;

  if (loading) return <div className="booking-loading">Loading...</div>;
  if (!tour) return <div>Tour not found</div>;

  return (
    <div className="booking-container">
      <div className="booking-card">
        <div className="booking-header">
          <h1>Confirm Your Booking</h1>
          <p>Complete your kayaking adventure reservation</p>
        </div>

        <div className="tour-summary">
          <div className="tour-image">
            <img
              src={
                tour.image
                  ? `http://localhost:5000${tour.image}`
                  : "/default-tour.jpg"
              }
              alt={tour.title}
            />
          </div>
          <div className="tour-details">
            <h2>{tour.title}</h2>
            <p className="tour-location">📍 {tour.location}</p>
            <div className="tour-features">
              <span className="feature-tag">🕒 {tour.duration}</span>
              <span className="feature-tag">👥 Max {tour.maxParticipants}</span>
              {slotTime && (
                <span className="feature-tag">⏰ Slot: {slotTime}</span>
              )}
            </div>
          </div>
        </div>

        <div className="booking-form">
          <div className="form-group">
            <label>Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Select Time Slot</label>
            {availableSlots.length > 0 ? (
              <select
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Choose a time</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            ) : date ? (
              <div className="no-slots">No slots available</div>
            ) : (
              <div className="no-slots">Select a date first</div>
            )}
          </div>

          <div className="form-group">
            <label>Participants</label>
            <div className="participants-control">
              <button
                onClick={() => setParticipants((p) => Math.max(1, p - 1))}
                disabled={participants <= 1}
              >
                -
              </button>
              <span>{participants}</span>
              <button
                onClick={() =>
                  setParticipants((p) => Math.min(tour.maxParticipants, p + 1))
                }
                disabled={participants >= tour.maxParticipants}
              >
                +
              </button>
            </div>
            <small>Max {tour.maxParticipants} allowed</small>
          </div>

          <div className="price-breakdown">
            <h3>Price Breakdown</h3>
            <div className="price-row">
              <span>
                ₹{tour.price} × {participants}
              </span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={paymentLoading || !slotTime}
            className={`payment-btn ${paymentLoading ? "loading" : ""}`}
          >
            {paymentLoading ? "Processing..." : `Pay ₹${totalAmount}`}
          </button>
        </div>

        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back to Tour
        </button>
      </div>
    </div>
  );
};

export default BookingForm;