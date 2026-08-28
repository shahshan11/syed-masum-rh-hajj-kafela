import { db } from '../../config/firebase';
import { Booking } from '../../types';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';

const BOOKINGS_COLLECTION = 'bookings';

export const getBookings = async (): Promise<Booking[]> => {
  const querySnapshot = await getDocs(collection(db, BOOKINGS_COLLECTION));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
};

export const getBookingsByUserId = async (userId: string): Promise<Booking[]> => {
  const q = query(collection(db, BOOKINGS_COLLECTION), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
};

export const createBooking = async (booking: Omit<Booking, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
    ...booking,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const updateBookingStatus = async (id: string, status: Booking['status']): Promise<void> => {
  const docRef = doc(db, BOOKINGS_COLLECTION, id);
  await updateDoc(docRef, { status });
};