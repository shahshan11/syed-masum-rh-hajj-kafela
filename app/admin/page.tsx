'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createTour } from '../../lib/services/tourService';
import { uploadImage } from '../../lib/services/storageService';
import { Tour } from '../../types';
import { PlusCircle, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    location: '',
    price: 0,
    durationDays: 1,
    category: 'Adventure',
    isFeatured: false,
    maxGroupSize: 10,
    availableSeats: 10,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (authLoading) return <div className="p-12 text-center">Loading...</div>;

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 bg-red-50 text-red-700 rounded-lg text-center font-medium border border-red-200">
        Access Denied. You must be an Admin to view this page.
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'tours');
      }

      const tourData: Omit<Tour, 'id'> = {
        ...formData,
        featuredImage: imageUrl,
        includedServices: [],
        excludedServices: [],
      };

      await createTour(tourData);
      setMessage('Tour created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        slug: '',
        description: '',
        location: '',
        price: 0,
        durationDays: 1,
        category: 'Adventure',
        isFeatured: false,
        maxGroupSize: 10,
        availableSeats: 10,
      });
      setImageFile(null);
    } catch (err) {
      console.error(err);
      setMessage('Failed to create tour. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PlusCircle className="text-blue-600" /> Add New Tour Package
          </h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to create a new tour offering.</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            <CheckCircle className="h-5 w-5" /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tour Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Cox's Bazar Sunset Special"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL friendly)</label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none"
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the highlights and itinerary..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Sylhet, Bangladesh"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
              <input
                type="number"
                name="durationDays"
                required
                min="1"
                value={formData.durationDays}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="Adventure">Adventure</option>
                <option value="Relaxation">Relaxation</option>
                <option value="Cultural">Cultural</option>
                <option value="Wildlife">Wildlife</option>
                <option value="Beach">Beach</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
              Show on Home Page as Featured Tour
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {submitting ? 'Publishing Tour...' : 'Publish Tour'}
          </button>
        </form>
      </div>
    </div>
  );
}