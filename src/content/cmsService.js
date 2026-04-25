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

import { db } from "../lib/firebase";

const SITE_CONTENT_DOC = "siteContent";
const SETTINGS_COLLECTION = "settings";
const LEADS_COLLECTION = "leads";
const LEADS_STORAGE_KEY = `${CMS_STORAGE_KEY}_leads`;

/* ---------------- LOCAL ---------------- */

function getLocalLeads() {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(LEADS_STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveLocalLeads(leads) {
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
}

function mergeContent(raw) {
  return { ...defaultContent, ...(raw || {}) };
}

/* ---------------- CONTENT ---------------- */

export async function getSiteContent() {
  if (!db) return getContent();

  const ref = doc(db, SETTINGS_COLLECTION, SITE_CONTENT_DOC);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, { content: defaultContent });
    return defaultContent;
  }

  return mergeContent(snap.data().content);
}

export async function saveSiteContent(content) {
  if (!db) {
    saveContent(content);
    return;
  }

  await setDoc(doc(db, SETTINGS_COLLECTION, SITE_CONTENT_DOC), {
    content,
    updatedAt: serverTimestamp()
  });
}

export async function resetSiteContent() {
  if (!db) {
    resetContent();
    return defaultContent;
  }

  await setDoc(doc(db, SETTINGS_COLLECTION, SITE_CONTENT_DOC), {
    content: defaultContent
  });

  return defaultContent;
}

/* ---------------- LEADS ---------------- */

export async function submitLead(data) {
  const lead = {
    ...data,
    createdAtISO: new Date().toISOString()
  };

  if (!db) {
    const leads = getLocalLeads();
    saveLocalLeads([{ id: crypto.randomUUID(), ...lead }, ...leads]);
    return;
  }

  await addDoc(collection(db, LEADS_COLLECTION), {
    ...lead,
    createdAt: serverTimestamp()
  });
}

export async function getLeads() {
  if (!db) return getLocalLeads();

  const q = query(collection(db, LEADS_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data()
  }));
}

export async function deleteLead(id) {
  if (!db) {
    const leads = getLocalLeads();
    saveLocalLeads(leads.filter((l) => l.id !== id));
    return;
  }

  await deleteDoc(doc(db, LEADS_COLLECTION, id));
}