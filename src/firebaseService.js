// src/firebaseService.js
import { db, auth } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  query,
  orderBy 
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// ─── AUTH ACTIONS ────────────────────────────────────────────────────────────
// Logs the admin into the secure session using the account you made in the console
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase Login failed:", error.message);
    throw error;
  }
};

// Logs the admin out safely
export const logoutAdmin = async () => {
  await signOut(auth);
};

// ─── JOB MANIPULATION ACTIONS ────────────────────────────────────────────────
const jobsCollectionRef = collection(db, "jobs");

// Grabs all active jobs from the cloud sorted by deadline sequence
export const getLiveJobs = async () => {
  try {
    const q = query(jobsCollectionRef, orderBy("deadline", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error pulling live jobs:", error);
    return [];
  }
};

// Allows the admin to push a brand new job listing onto the board
export const addLiveJob = async (jobData) => {
  try {
    const docRef = await addDoc(jobsCollectionRef, jobData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding live job:", error);
    throw error;
  }
};

// Allows the admin to delete a job listing permanently
export const deleteLiveJob = async (jobId) => {
  try {
    const jobDoc = doc(db, "jobs", jobId);
    await deleteDoc(jobDoc);
  } catch (error) {
    console.error("Error removing live job:", error);
    throw error;
  }
};

// ─── WORKER APPLICATION ACTIONS ──────────────────────────────────────────────
const appsCollectionRef = collection(db, "applications");

// Submits a mason/builder's typed form metrics straight into the cloud
export const submitLiveApplication = async (applicationData) => {
  try {
    const completeData = {
      ...applicationData,
      dateApplied: new Date().toISOString(), // automatically marks the application date
    };
    const docRef = await addDoc(appsCollectionRef, completeData);
    return docRef.id;
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
};

// Lets the admin pull all worker applications for review inside the dashboard
export const getLiveApplications = async () => {
  try {
    const q = query(appsCollectionRef, orderBy("dateApplied", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error pulling applications list:", error);
    return [];
  }
};

