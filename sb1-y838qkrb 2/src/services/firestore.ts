import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  getDoc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { InjuryData } from '../types';

const BATCH_SIZE = 20;

/**
 * Saves a new assessment to Firestore with error handling
 */
export async function saveAssessment(userId: string, assessment: InjuryData) {
  try {
    // First generate the assessment with a specific ID
    const assessmentWithTimestamp = {
      ...assessment,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Option 1: Use setDoc with a custom ID
    if (assessment.id) {
      const docRef = doc(db, 'assessments', assessment.id);
      await setDoc(docRef, assessmentWithTimestamp);
      return assessment.id;
    } 
    // Option 2: Let Firestore generate an ID
    else {
      const docRef = await addDoc(collection(db, 'assessments'), assessmentWithTimestamp);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving assessment to Firestore:', error);
    throw new Error('Failed to save assessment to database');
  }
}

/**
 * Gets assessments for a specific user with pagination
 */
export async function getUserAssessments(
  userId: string,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
) {
  try {
    let q = query(
      collection(db, 'assessments'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(BATCH_SIZE)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const assessments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as InjuryData[];

    return {
      assessments,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: querySnapshot.docs.length === BATCH_SIZE
    };
  } catch (error) {
    console.error('Error getting assessments from Firestore:', error);
    throw new Error('Failed to retrieve assessment history');
  }
}

/**
 * Updates an existing assessment in Firestore
 */
export async function updateAssessment(assessmentId: string, data: Partial<InjuryData>) {
  try {
    const assessmentRef = doc(db, 'assessments', assessmentId);
    await updateDoc(assessmentRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating assessment in Firestore:', error);
    throw new Error('Failed to update assessment data');
  }
}

/**
 * Gets a single assessment by ID
 */
export async function getAssessmentById(assessmentId: string) {
  try {
    const docRef = doc(db, 'assessments', assessmentId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Assessment not found');
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    } as InjuryData;
  } catch (error) {
    console.error('Error getting assessment from Firestore:', error);
    throw new Error('Failed to retrieve assessment details');
  }
}