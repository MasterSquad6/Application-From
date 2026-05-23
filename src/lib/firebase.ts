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
        if (result.success === false) {
          console.error('[Upload] Server reported failure:', result);
          reject(new Error(result.message || result.error || 'Upload failed'));
        } else if (result.url) {
          console.log(`[Upload] Successful: ${result.url}`);
          resolve(result.url);
        } else {
          // Handle direct ImageKit response if proxy returns it directly
          if (result.url) resolve(result.url);
          else reject(new Error('Upload failed: No URL returned by server.'));
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
    const docRef = await addDoc(collection(db, path), {
      ...data,
      status: 'pending',
      submittedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
