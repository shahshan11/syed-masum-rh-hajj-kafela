import Link from 'next/link';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Compass className="h-7 w-7 text-blue-500" />
              <span className="font-bold text-xl">TravelGo</span>
            </div>
            <p className="text-sm text-gray-400">
              Explore the world with us. Unforgettable experiences and unbelievable deals await!
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/tours" className="hover:text-white transition">All Tours</Link></li>
              <li><Link href="/offers" className="hover:text-white transition">Special Offers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" /> Dhaka, Bangladesh
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" /> +880 1234 567890
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" /> info@travelgo.com
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} TravelGo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}