/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

import { 
  SiteSettings, 
  Student, 
  Alumni, 
  ProgramRegistration, 
  PaymentTransaction, 
  PsychologicalResult, 
  CounselingSession 
} from './types';

import { 
  DEFAULT_SITE_SETTINGS,
  INITIAL_STUDENTS,
  INITIAL_ALUMNI,
  INITIAL_REGISTRATIONS,
  INITIAL_PAYMENTS,
  INITIAL_RESULTS,
  INITIAL_SESSIONS
} from './mockData';

// Initialize Firebase
const isConfigDummy = firebaseConfig.projectId.includes('dummy') || !firebaseConfig.apiKey;
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Core error handling structure mandated by Firebase Guidelines
export interface FirestoreErrorInfo {
  error: string;
  operationType: string;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: string, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('[Azta db] Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to keep a collection's document list perfectly in sync with an array of objects
export async function syncCollectionList(collectionName: string, newList: { id: string }[]) {
  const querySnap = await getDocs(collection(db, collectionName));
  const newIds = new Set(newList.map(item => item.id));

  // 1. Delete removed items
  for (const docSnap of querySnap.docs) {
    if (!newIds.has(docSnap.id)) {
      try {
        await deleteDoc(doc(db, collectionName, docSnap.id));
      } catch (err) {
        console.warn(`Failed to delete doc ${docSnap.id} from collection ${collectionName}:`, err);
      }
    }
  }

  // 2. Add or update items
  for (const item of newList) {
    await setDoc(doc(db, collectionName, item.id), item);
  }
}

// Ensure the local storage is populated with initial values if empty
const initLocalStorageKey = (key: string, defaultValue: any) => {
  const existing = localStorage.getItem(key);
  if (!existing) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(existing);
  } catch (e) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
};

// Double-layered backup sync with Developer Workspace /api/workspace-data
export async function syncToWorkspaceBackend(data: {
  siteSettings?: SiteSettings;
  students?: Student[];
  alumni?: Alumni[];
  registrations?: ProgramRegistration[];
  payments?: PaymentTransaction[];
  results?: PsychologicalResult[];
  sessions?: CounselingSession[];
}) {
  try {
    await fetch('/api/workspace-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn('Workspace sync not reachable:', err);
  }
}

// 1. Initialize data store
export function setupDataStore() {
  initLocalStorageKey('azta_site_settings', DEFAULT_SITE_SETTINGS);
  initLocalStorageKey('azta_students', INITIAL_STUDENTS);
  initLocalStorageKey('azta_alumni', INITIAL_ALUMNI);
  initLocalStorageKey('azta_registrations', INITIAL_REGISTRATIONS);
  initLocalStorageKey('azta_payments', INITIAL_PAYMENTS);
  initLocalStorageKey('azta_results', INITIAL_RESULTS);
  initLocalStorageKey('azta_sessions', INITIAL_SESSIONS);
}

// 2. Fetch all collections
export interface AztaDataStructure {
  siteSettings: SiteSettings;
  students: Student[];
  alumni: Alumni[];
  registrations: ProgramRegistration[];
  payments: PaymentTransaction[];
  results: PsychologicalResult[];
  sessions: CounselingSession[];
}

export async function fetchAllData(): Promise<AztaDataStructure> {
  setupDataStore();

  const data: AztaDataStructure = {
    siteSettings: JSON.parse(localStorage.getItem('azta_site_settings') || 'null') || DEFAULT_SITE_SETTINGS,
    students: JSON.parse(localStorage.getItem('azta_students') || '[]'),
    alumni: JSON.parse(localStorage.getItem('azta_alumni') || '[]'),
    registrations: JSON.parse(localStorage.getItem('azta_registrations') || '[]'),
    payments: JSON.parse(localStorage.getItem('azta_payments') || '[]'),
    results: JSON.parse(localStorage.getItem('azta_results') || '[]'),
    sessions: JSON.parse(localStorage.getItem('azta_sessions') || '[]'),
  };

  // Hydrate from back-end server if reachable
  try {
    const res = await fetch('/api/workspace-data');
    if (res.ok) {
      const serverData = await res.json();
      if (serverData) {
        if (serverData.siteSettings) {
          data.siteSettings = serverData.siteSettings;
          localStorage.setItem('azta_site_settings', JSON.stringify(serverData.siteSettings));
        }
        if (serverData.students) {
          data.students = serverData.students;
          localStorage.setItem('azta_students', JSON.stringify(serverData.students));
        }
        if (serverData.alumni) {
          data.alumni = serverData.alumni;
          localStorage.setItem('azta_alumni', JSON.stringify(serverData.alumni));
        }
        if (serverData.registrations) {
          data.registrations = serverData.registrations;
          localStorage.setItem('azta_registrations', JSON.stringify(serverData.registrations));
        }
        if (serverData.payments) {
          data.payments = serverData.payments;
          localStorage.setItem('azta_payments', JSON.stringify(serverData.payments));
        }
        if (serverData.results) {
          data.results = serverData.results;
          localStorage.setItem('azta_results', JSON.stringify(serverData.results));
        }
        if (serverData.sessions) {
          data.sessions = serverData.sessions;
          localStorage.setItem('azta_sessions', JSON.stringify(serverData.sessions));
        }
      }
    }
  } catch (err) {
    console.log('Notice: Workspace server not reachable, utilizing localStorage.');
  }

  // Double-sync active Firestore records if dynamic credentials are real and loaded
  if (!isConfigDummy) {
    try {
      // Load Site Settings
      let dbInitialized = false;
      const settingsDoc = await getDoc(doc(db, 'siteSettings', 'config'));
      if (settingsDoc.exists()) {
        data.siteSettings = settingsDoc.data() as SiteSettings;
        localStorage.setItem('azta_site_settings', JSON.stringify(data.siteSettings));
        dbInitialized = true;
      } else {
        // Seed blank default settings since it is empty
        await setDoc(doc(db, 'siteSettings', 'config'), data.siteSettings);
      }

      // Load/Seed Students
      const studentsSnap = await getDocs(collection(db, 'students'));
      if (!studentsSnap.empty) {
        const list: Student[] = [];
        studentsSnap.forEach(d => {
          list.push(d.data() as Student);
        });
        data.students = list;
        localStorage.setItem('azta_students', JSON.stringify(list));
      } else if (data.students && data.students.length > 0) {
        for (const item of data.students) {
          await setDoc(doc(db, 'students', item.id), item);
        }
      }

      // Load/Seed Alumni
      const alumniSnap = await getDocs(collection(db, 'alumni'));
      if (!alumniSnap.empty) {
        const list: Alumni[] = [];
        alumniSnap.forEach(d => {
          list.push(d.data() as Alumni);
        });
        data.alumni = list;
        localStorage.setItem('azta_alumni', JSON.stringify(list));
      } else if (data.alumni && data.alumni.length > 0) {
        for (const item of data.alumni) {
          await setDoc(doc(db, 'alumni', item.id), item);
        }
      }

      // Load/Seed Registrations
      const registrationsSnap = await getDocs(collection(db, 'registrations'));
      if (!registrationsSnap.empty) {
        const list: ProgramRegistration[] = [];
        registrationsSnap.forEach(d => {
          list.push(d.data() as ProgramRegistration);
        });
        data.registrations = list;
        localStorage.setItem('azta_registrations', JSON.stringify(list));
      } else if (data.registrations && data.registrations.length > 0) {
        for (const item of data.registrations) {
          await setDoc(doc(db, 'registrations', item.id), item);
        }
      }

      // Load/Seed Payments
      const paymentsSnap = await getDocs(collection(db, 'payments'));
      if (!paymentsSnap.empty) {
        const list: PaymentTransaction[] = [];
        paymentsSnap.forEach(d => {
          list.push(d.data() as PaymentTransaction);
        });
        data.payments = list;
        localStorage.setItem('azta_payments', JSON.stringify(list));
      } else if (data.payments && data.payments.length > 0) {
        for (const item of data.payments) {
          await setDoc(doc(db, 'payments', item.id), item);
        }
      }

      // Load/Seed Results
      const resultsSnap = await getDocs(collection(db, 'results'));
      if (!resultsSnap.empty) {
        const list: PsychologicalResult[] = [];
        resultsSnap.forEach(d => {
          list.push(d.data() as PsychologicalResult);
        });
        data.results = list;
        localStorage.setItem('azta_results', JSON.stringify(list));
      } else if (data.results && data.results.length > 0) {
        for (const item of data.results) {
          await setDoc(doc(db, 'results', item.id), item);
        }
      }

      // Load/Seed Sessions
      const sessionsSnap = await getDocs(collection(db, 'sessions'));
      if (!sessionsSnap.empty) {
        const list: CounselingSession[] = [];
        sessionsSnap.forEach(d => {
          list.push(d.data() as CounselingSession);
        });
        data.sessions = list;
        localStorage.setItem('azta_sessions', JSON.stringify(list));
      } else if (data.sessions && data.sessions.length > 0) {
        for (const item of data.sessions) {
          await setDoc(doc(db, 'sessions', item.id), item);
        }
      }
    } catch (err) {
      console.warn('Firestore read/write bypassed or pending rules activation:', err);
    }
  }

  return data;
}

// 3. Selective Save Operations
export async function saveSiteSettings(settings: SiteSettings) {
  localStorage.setItem('azta_site_settings', JSON.stringify(settings));
  await syncToWorkspaceBackend({ siteSettings: settings });

  if (!isConfigDummy) {
    const path = 'siteSettings/config';
    try {
      await setDoc(doc(db, 'siteSettings', 'config'), settings);
    } catch (err) {
      handleFirestoreError(err, 'write', path);
    }
  }
}

export async function saveStudents(students: Student[]) {
  localStorage.setItem('azta_students', JSON.stringify(students));
  await syncToWorkspaceBackend({ students });

  if (!isConfigDummy) {
    try {
      await syncCollectionList('students', students);
    } catch (err) {
      handleFirestoreError(err, 'write', 'students');
    }
  }
}

export async function saveAlumni(alumni: Alumni[]) {
  localStorage.setItem('azta_alumni', JSON.stringify(alumni));
  await syncToWorkspaceBackend({ alumni });

  if (!isConfigDummy) {
    try {
      await syncCollectionList('alumni', alumni);
    } catch (err) {
      handleFirestoreError(err, 'write', 'alumni');
    }
  }
}

export async function saveRegistrations(registrations: ProgramRegistration[]) {
  localStorage.setItem('azta_registrations', JSON.stringify(registrations));
  await syncToWorkspaceBackend({ registrations });

  if (!isConfigDummy) {
    try {
      await syncCollectionList('registrations', registrations);
    } catch (err) {
      handleFirestoreError(err, 'write', 'registrations');
    }
  }
}

export async function savePayments(payments: PaymentTransaction[]) {
  localStorage.setItem('azta_payments', JSON.stringify(payments));
  await syncToWorkspaceBackend({ payments });

  if (!isConfigDummy) {
    try {
      await syncCollectionList('payments', payments);
    } catch (err) {
      handleFirestoreError(err, 'write', 'payments');
    }
  }
}

export async function saveResults(results: PsychologicalResult[]) {
  localStorage.setItem('azta_results', JSON.stringify(results));
  await syncToWorkspaceBackend({ results });

  if (!isConfigDummy) {
    try {
      await syncCollectionList('results', results);
    } catch (err) {
      handleFirestoreError(err, 'write', 'results');
    }
  }
}

export async function saveSessions(sessions: CounselingSession[]) {
  localStorage.setItem('azta_sessions', JSON.stringify(sessions));
  await syncToWorkspaceBackend({ sessions });

  if (!isConfigDummy) {
    try {
      await syncCollectionList('sessions', sessions);
    } catch (err) {
      handleFirestoreError(err, 'write', 'sessions');
    }
  }
}

// 4. Test connection validation on start as required in instructions
export async function testConnection() {
  if (isConfigDummy) return;
  try {
    const { getDocFromServer } = await import('firebase/firestore');
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

testConnection();
