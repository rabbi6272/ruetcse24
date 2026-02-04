import { create } from "zustand";
import type { Student } from "../types/Student";

interface StudentStore {
  studentInfo: Student;
  setStudentInfo: (student: Student) => void;
  clearStudent: () => void;
}

export const useStudentStore = create<StudentStore>((set: any) => {
  return {
    studentInfo: {
      id: "",
      fullName: "",
      nickname: "",
      email: "",
      hobby: "",
      fbProfile: "",
      bio: "",
      pincode: "",
      sec: "",
      profilePicUrl: "",
      profilePicPublicId: "",
      createdAt: Date.now(),
      roll: "",
    },
    setStudentInfo: (student: Student) => set({ studentInfo: student }),
    clearStudent: () =>
      set({
        studentInfo: {
          id: "",
          fullName: "",
          nickname: "",
          email: "",
          hobby: "",
          fbProfile: "",
          bio: "",
          pincode: "",
          sec: "",
          profilePicUrl: "",
          profilePicPublicId: "",
          createdAt: Date.now(),
          roll: "",
        },
      }),
  };
});
