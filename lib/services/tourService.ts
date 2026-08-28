import { db } from '../../config/firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  query, 
  where, 
  limit 
} from 'firebase/firestore';
import { Tour } from '../../types';

const TOURS_COLLECTION = 'tours';

// Create a new tour
export const createTour = async (tourData: Omit<Tour, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, TOURS_COLLECTION), tourData);
  return docRef.id;
};

// Get all tours
export const getAllTours = async (): Promise<Tour[]> => {
  const querySnapshot = await getDocs(collection(db, TOURS_COLLECTION));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Tour[];
};

// Get featured tours for homepage
export const getFeaturedTours = async (): Promise<Tour[]> => {
  const q = query(
    collection(db, TOURS_COLLECTION),
    where('isFeatured', '==', true),
    limit(6)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Tour[];
};

// Get single tour by ID
export const getTourById = async (id: string): Promise<Tour | null> => {
  const docRef = doc(db, TOURS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Tour;
  }
  return null;
};