'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getBookingsByUserId } from '../../lib/services/bookingService';
import { Booking } from '../../types';
import { Calendar, Users, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        try {
          const data = await getBookingsByUserId(user.uid);
          setBookings(data);
        } catch (err) {
          console.error('Error fetching bookings:', err);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className="p-16 text-center text-gray-500 font-medium">Loading your bookings...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 bg-yellow-50 text-yellow-800 rounded-xl text-center font-medium border border-yellow-200">
        Please sign in to view your bookings.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
      <p className="text-gray-600 mb-8">Manage and view the status of your tour reservations.</p>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No Bookings Found</h3>
          <p className="text-gray-500 mt-1">You haven't booked any tour packages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900">{booking.tourTitle}</h3>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {booking.status === 'confirmed' && <CheckCircle className="h-3.5 w-3.5" />}
                    {booking.status === 'cancelled' && <XCircle className="h-3.5 w-3.5" />}
                    {booking.status === 'pending' && <Clock className="h-3.5 w-3.5" />}
                    <span className="capitalize">{booking.status}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-600" /> Date: {booking.bookingDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-600" /> Guests: {booking.guests}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                <div>
                  <span className="block text-xs text-gray-500">Total Price</span>
                  <span className="text-xl font-bold text-gray-900">${booking.totalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}