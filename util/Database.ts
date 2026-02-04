import { db } from "./FirebaseConfig";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  DocumentData,
} from "firebase/firestore";

import { Student } from "../types/Student";

const USERS_COLLECTION = "users";

export async function createUser(
  userData: Omit<Student, "id" | "createdAt" | "updatedAt">,
): Promise<Student> {
  const now = Date.now();
  const cleanData = { ...userData, createdAt: now, updatedAt: now };
  const ref = await addDoc(collection(db, USERS_COLLECTION), cleanData);

  // Update the document to include its own ID
  await updateDoc(ref, { id: ref.id });

  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Failed to create user");
  return docToStudent(snap.data() as DocumentData);
}

export async function getAllUsers(): Promise<Student[]> {
  const snaps = await getDocs(collection(db, USERS_COLLECTION));
  if (snaps.empty) throw new Error("Document does not exist");
  const users: Student[] = [];
  snaps.forEach((docSnap) => {
    users.push(docToStudent(docSnap.data() as DocumentData));
  });
  return users;
}

export async function getUserByEmail(email: string): Promise<Student | null> {
  const ref = collection(db, USERS_COLLECTION);
  const q = query(ref, where("email", "==", email));
  const snaps = await getDocs(q);
  if (snaps.empty) return null;
  const first = snaps.docs[0];
  return docToStudent(first.data() as DocumentData);
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<Student, "id" | "createdAt">>,
): Promise<Student | null> {
  const ref = doc(db, USERS_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const payload = { ...updates, updatedAt: Date.now() } as any;
  await updateDoc(ref, payload);
  const updatedSnap = await getDoc(ref);
  if (!updatedSnap.exists()) return null;
  return docToStudent(updatedSnap.data() as DocumentData);
}

export async function deleteUser(id: string): Promise<boolean> {
  const ref = doc(db, USERS_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  await deleteDoc(ref);
  return true;
}

function docToStudent(data: DocumentData): Student {
  return {
    id: data.id,
    fullName: data.fullName,
    nickname: data.nickname,
    email: data.email,
    pincode: data.pincode,
    roll: data.roll,
    bio: data.bio,
    hobby: data.hobby,
    fbProfile: data.fbProfile,
    sec: data.sec,
    profilePicUrl: data.profilePicUrl,
    profilePicPublicId: data.profilePicPublicId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
