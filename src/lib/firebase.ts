import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = (firebaseConfig as any).firestoreDatabaseId 
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Proxied Upload URL
const PROXY_UPLOAD_URL = '/api/upload';

export async function uploadToImageKit(file: File, onProgress?: (progress: number) => void): Promise<string> {
  console.log(`[Upload] Starting REAL upload for: ${file.name} to ${PROXY_UPLOAD_URL}`);
  
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    // Unique file name with timestamp
    const uniqueName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    formData.append('file', file);
    formData.append('fileName', uniqueName);
    formData.append('folder', '/shopverse_applications');
    formData.append('useUniqueFileName', 'true');

    const xhr = new XMLHttpRequest();

    xhr.open('POST', PROXY_UPLOAD_URL);

    // Watch upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        if (onProgress) onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      let result;
      try {
        result = JSON.parse(xhr.responseText);
      } catch (e) {
        console.error('[Upload] Parse error (Status ' + xhr.status + '):', xhr.responseText);
        reject(new Error(`Server error (${xhr.status}): Invalid JSON response.`));
        return;
      }
      
      console.log(`[Upload] Server response (${xhr.status}):`, result);

      if (xhr.status >= 200 && xhr.status < 300) {
        // If the server returns success: false in a 200 OK
        if (result.success === false) {
          console.error('[Upload] Server reported failure:', result);
          reject(new Error(result.message || result.error || 'Upload failed'));
        } else if (result.url) {
          // Priority 1: Direct URL from my proxy/ImageKit
          console.log(`[Upload] Successful: ${result.url}`);
          resolve(result.url);
        } else if (result.data && result.data.url) {
          // Priority 2: Nested data.url format
          resolve(result.data.url);
        } else {
          console.error('[Upload] No URL found in response:', result);
          reject(new Error('Upload failed: No URL returned by server.'));
        }
      } else {
        const detailedError = result.message || result.error || xhr.statusText || 'Unknown error';
        console.error(`[Upload] HTTP ${xhr.status} Error:`, detailedError, result);
        reject(new Error(`Upload failed (${xhr.status}): ${detailedError}`));
      }
    };

    xhr.onerror = () => {
      console.error('[Upload] Network Error');
      reject(new Error('Network Error during upload'));
    };

    xhr.send(formData);
  });
}

// Validation check as per skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function submitApplication(data: any) {
  const path = 'applications';
  try {
    // Generate a 6-digit numeric password
    const password = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create a nicer display ID (shortened version of timestamp + random)
    const displayId = `SV-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const docRef = await addDoc(collection(db, path), {
      ...data,
      displayId,
      password,
      status: 'pending',
      adminNote: '',
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { 
      id: docRef.id, 
      displayId, 
      password 
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getApplicationByDisplayId(displayId: string, password?: string) {
  const path = 'applications';
  try {
    const { query, where, getDocs } = await import('firebase/firestore');
    
    let q;
    if (password) {
      // Secure mode: query by both for rule enforcement
      q = query(
        collection(db, path), 
        where('displayId', '==', displayId),
        where('password', '==', password)
      );
    } else {
      // Admin mode or initial fetch (will fail if not admin or rules don't allow)
      q = query(
        collection(db, path), 
        where('displayId', '==', displayId)
      );
    }
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    return { id: querySnapshot.docs[0].id, ...(querySnapshot.docs[0].data() as object) } as any;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${path}/${displayId}`);
  }
}

/**
 * Global Stats & Recent Applicants
 */

export async function getStats() {
  const { doc, getDoc } = await import('firebase/firestore');
  const docRef = doc(db, 'stats', 'vacancies');
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as {
      cs_admin_vacancies: number;
      va_vacancies: number;
      hired_count: number;
    };
  } else {
    // Default fallback
    return {
      cs_admin_vacancies: 5,
      va_vacancies: 10,
      hired_count: 0
    };
  }
}

export async function getRecentApplications(limitCount: number = 3) {
  const { query, collection, orderBy, limit, getDocs } = await import('firebase/firestore');
  const q = query(
    collection(db, 'applications'),
    orderBy('submittedAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as any[];
}

export async function updateApplicationStatus(docId: string, status: string, note: string) {
  const path = 'applications';
  try {
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
    const docRef = doc(db, path, docId);
    await updateDoc(docRef, {
      status,
      adminNote: note,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${docId}`);
  }
}

export async function updateStats(csVac: number, vaVac: number, hired: number) {
  const path = 'stats';
  try {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const docRef = doc(db, path, 'vacancies');
    await setDoc(docRef, {
      cs_admin_vacancies: csVac,
      va_vacancies: vaVac,
      hired_count: hired,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/vacancies`);
  }
}
