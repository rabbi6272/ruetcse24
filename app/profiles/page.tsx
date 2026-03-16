"use client";

import { useState, useEffect } from "react";

import { getAllUsers } from "../../util/Database";

import type { Student } from "../../types/Student";

import { useStudentStore } from "../../store/StudentStore";

import { ProfilePageHeader } from "../components/ProfilePageHeader";
import { ProfilePageSearchAndStats } from "../components/ProfilePageSearch&Stats";
import { ProfilePageFooter } from "../components/ProfilePageFooter";
import { ProfilePageProfileGrid } from "../components/ProfilePageProfileGrid";

export default function StudentManager() {
  const [filteredData, setFilteredData] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const allStudents = useStudentStore((state) => state.allStudents);
  const setAllStudents = useStudentStore((state) => state.setAllStudents);

  async function fetchUsers() {
    const res = await getAllUsers();
    setAllStudents(res);
  }

  // Fetch users on component mount
  useEffect(() => {
    if (allStudents.length > 0) return;
    fetchUsers();
  }, []);

  // Filter students when search or filter changes
  useEffect(() => {
    filterStudents();
  }, [searchTerm, allStudents]);

  const filterStudents = () => {
    const filtered = allStudents.filter((student) => {
      const matchesSearch =
        student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.hobby?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mobileNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    setFilteredData(filtered);
  };

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ProfilePageHeader />

        {/* <!-- Search and Stats --> */}
        <ProfilePageSearchAndStats
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredData={filteredData}
        />

        {/* Profiles Grid */}
        <ProfilePageProfileGrid filteredData={filteredData} />
      </div>

      <br />

      {/* Footer */}
      <ProfilePageFooter />
    </main>
  );
}
