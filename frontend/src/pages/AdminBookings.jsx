import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './AdminBookings.scss'
const AdminBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
       const res = await API.get('/bookings/admin'); // <-- admin route
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching admin bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchBookings();
    }
  }, [user]);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div  className="admin-bookings">
      <h2>All Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Tour</th>
              <th>Status</th>
              <th>Date</th>
              <th>Participants</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
  <tr key={b._id}>
    <td>{b._id}</td>
    <td>{b.user?.name} ({b.user?.email})</td>
    <td>{b.tour ? b.tour.title : <em>Deleted Tour</em>}</td> {/* ✅ Safe access */}
    <td>{b.status}</td>
    <td>{new Date(b.date).toLocaleDateString()}</td>
    <td>{b.participants}</td>
  </tr>
))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBookings;
