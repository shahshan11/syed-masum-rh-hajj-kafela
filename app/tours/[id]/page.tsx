'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getTourById } from '../../../lib/services/tourService';
import { createBooking } from '../../../lib/services/bookingService';
import { useAuth } from '../../../context/AuthContext';
import { Tour } from '../../../types';
import { MapPin, Clock, Users, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function TourDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tourId = resolvedParams.id;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const data = await getTourById(tourId);
        setTour(data);
      } catch (err) {
        console.error('Error fetching tour:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    if (!tour) return;

    setBookingLoading(true);
    setMessage('');

    try {
      const totalPrice = tour.price * guests;
      await createBooking({
        tourId: tour.id,
        userId: user.uid,
        userEmail: user.email || '',
        tourTitle: tour.title,
        bookingDate,
        guests,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      setMessage('Booking request submitted successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to place booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="p-16 text-center text-gray-500 font-medium">Loading tour details...</div>;
  if (!tour) return <div className="p-16 text-center text-red-500 font-medium">Tour package not found!</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tour Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
            <img
              src={tour.featuredImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
              {tour.category}
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{tour.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mt-3">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-blue-600" /> {tour.location}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-blue-600" /> {tour.durationDays} Days</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-blue-600" /> Max Group: {tour.maxGroupSize}</span>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">About this Tour</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{tour.description}</p>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 sticky top-24 space-y-6">
            <div className="flex items-baseline justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-3xl font-bold text-gray-900">${tour.price}</span>
                <span className="text-sm text-gray-500"> / person</span>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-lg text-sm flex items-start gap-2 ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.includes('successfully') ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <ShieldAlert className="h-5 w-5 shrink-0" />}
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max={tour.availableSeats || 10}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>${tour.price} x {guests} guests</span>
                  <span>${tour.price * guests}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total Cost</span>
                  <span>${tour.price * guests}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-2"
              >
                {bookingLoading ? 'Processing...' : user ? 'Book Now' : 'Sign in to Book'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}