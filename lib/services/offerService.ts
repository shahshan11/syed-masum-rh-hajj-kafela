import { db } from '../../config/firebase';
import { SpecialOffer } from '../../types';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

const OFFERS_COLLECTION = 'offers';

export const getOffers = async (): Promise<SpecialOffer[]> => {
  const querySnapshot = await getDocs(collection(db, OFFERS_COLLECTION));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SpecialOffer));
};

export const createOffer = async (offer: Omit<SpecialOffer, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, OFFERS_COLLECTION), offer);
  return docRef.id;
};

export const updateOffer = async (id: string, offer: Partial<SpecialOffer>): Promise<void> => {
  const docRef = doc(db, OFFERS_COLLECTION, id);
  await updateDoc(docRef, offer);
};

export const deleteOffer = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, OFFERS_COLLECTION, id));
};