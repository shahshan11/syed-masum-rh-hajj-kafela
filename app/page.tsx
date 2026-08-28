'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFeaturedTours } from '../lib/services/tourService';
import { Tour } from '../types';
import { MapPin, Calendar, Compass } from 'lucide-react';

export default function HomePage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTours() {
      try {
        const data = await getFeaturedTours();
        setTours(data);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-24 px-4 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Explore the World’s Best Destinations
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Discover amazing places, create unforgettable memories, and book your next adventure with TravelGo.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg" href="/tours">
              Browse Tours
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Tours</h2>
            <p className="text-gray-600 mt-1">Handpicked popular tour packages for you</p>
          </div>
          <Link className="text-blue-600 font-semibold hover:underline" href="/tours">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading tours...</div>
        ) : tours.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <Compass className="h-12 w-12 text-gray-400 mx-auto mb-3"/>
            <p className="text-gray-600 font-medium">No featured tours available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={tour.featuredImage || 'https://via.placeholder.com/400x250'}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-gray-800">
                    {tour.category}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                    <MapPin className="h-4 w-4"/>
                    {tour.location}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{tour.title}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4"/> {tour.durationDays} Days
                    </span>
                    <span className="text-xl font-bold text-gray-900">${tour.price}</span>
                  </div>
                  <Link className="block text-center w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-2 rounded-lg transition" href={`/tours/${tour.slug}`}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}