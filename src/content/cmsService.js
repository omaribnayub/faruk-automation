import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from "firebase/firestore";

import { defaultContent } from "./defaultContent";
import {
  CMS_STORAGE_KEY,
  getContent,
  resetContent,
  saveContent
} from "./cmsStorage";

import { db, isFirebaseConfigured } from "../lib/firebase";

const SITE_CONTENT_DOC = "siteContent";
const SETTINGS_COLLECTION = "settings";
const LEADS_COLLECTION = "leads";
const LEADS_STORAGE_KEY = `${CMS_STORAGE_KEY}_leads`;

/* ---------------- LOCAL STORAGE HELPERS ---------------- */

function getLocalLeads() {
  if (typeof window === "undefined") return [];

  const saved = window.localStorage.getItem(LEADS_STORAGE_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalLeads(leads) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
}

function mergeContent(raw) {
  return { ...defaultContent, ...(raw || {}) };
}

/* ---------------- SITE CONTENT ---------------- */

export async function getSiteContent() {
  if (!isFirebaseConfigured || !db) {
    return getContent();
  }

  const ref = doc(db, SETTINGS_COLLECTION, SITE_CONTENT_DOC);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      content: defaultContent,
      updatedAt: serverTimestamp()
    });
    return defaultContent;
  }

  const data = snap.data();
  return mergeContent(data.content);
}

export async function saveSiteContent(content) {
  if (!isFirebaseConfigured || !db) {
    saveContent(content);
    return;
  }

  const ref = doc(db, SETTINGS_COLLECTION, SITE_CONTENT_DOC);

  await setDoc(
    ref,
    {
      content,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function resetSiteContent() {
  if (!isFirebaseConfigured || !db) {
    resetContent();
    return defaultContent;
  }

  const ref = doc(db, SETTINGS_COLLECTION, SITE_CONTENT_DOC);

  await setDoc(ref, {
    content: defaultContent,
    updatedAt: serverTimestamp()
  });

  return defaultContent;
}

/* ---------------- LEADS ---------------- */

export async function submitLead(payload) {
  const lead = {
    ...payload,
    createdAtISO: new Date().toISOString()
  };

  // LOCAL MODE
  if (!isFirebaseConfigured || !db) {
    const leads = getLocalLeads();

    const newLead = {
      id: crypto.randomUUID(),
      ...lead
    };

    saveLocalLeads([newLead, ...leads]);
    return;
  }

  // FIREBASE MODE
  await addDoc(collection(db, LEADS_COLLECTION), {
    ...lead,
    createdAt: serverTimestamp()
  });
}

export async function getLeads() {
  if (!isFirebaseConfigured || !db) {
    return getLocalLeads();
  }

  const q = query(collection(db, LEADS_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      ...data,
      createdAtISO:
        data.createdAt?.toDate?.()?.toISOString?.() || data.createdAtISO || ""
    };
  });
}

export async function deleteLead(leadId) {
  if (!isFirebaseConfigured || !db) {
    const leads = getLocalLeads();
    saveLocalLeads(leads.filter((lead) => lead.id !== leadId));
    return;
  }

  await deleteDoc(doc(db, LEADS_COLLECTION, leadId));
}