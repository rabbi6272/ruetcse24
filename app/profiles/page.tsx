"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { getAllUsers } from "../../util/Database";

import type { Student } from "../../types/Student";

import { useStudentStore } from "../../store/StudentStore";

import { ProfileCard } from "../components/ProfileCard";
import { ProfilePageHeader } from "../components/ProfilePageHeader";
import { ProfilePageSearchAndStats } from "../components/ProfilePageSearch&Stats";

export default function StudentManager() {
  const [filteredData, setFilteredData] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const allStudents = useStudentStore((state) => state.allStudents);
  const setAllStudents = useStudentStore((state) => state.setAllStudents);

  async function fetchUsers() {
    const res = await getAllUsers();
    setAllStudents(res);
  }

  // Filter students when search or filter changes
  useEffect(() => {
    if (allStudents.length > 0) return;
    fetchUsers();
  }, []);

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
        <div
          id="profilesContainer"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredData.length === 0
            ? null
            : filteredData.map((student, index) => (
                <ProfileCard
                  index={index}
                  key={student.id}
                  fullName={student.fullName}
                  nickname={student.nickname}
                  profilePicUrl={student.profilePicUrl}
                  bio={student.bio}
                  sec={student.sec}
                  email={student.email}
                  hobby={student.hobby}
                  fbProfile={student.fbProfile}
                  bloodGroup={student.bloodGroup}
                  mobileNumber={student.mobileNumber}
                  id={""}
                  pincode={""}
                  roll={""}
                  createdAt={0}
                />
              ))}
        </div>

        {/* Empty State */}
        <div id="emptyState" className="text-center py-12 hidden min-h-dvh">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No profiles found
          </h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      </div>

      <br />
      <br />
      <br />

      <footer className="w-full py-2 text-center text-sm flex flex-wrap items-center justify-center space-x-4 font-sans">
        <span className="text-gray-600">
          <i className="far fa-copyright"></i>
          All Reserved by
          <span className="text-blue-500 font-semibold ml-1">RUET CSE 24</span>
        </span>

        <Link
          href="https://m.facebook.com/profile.php?id=61574730479807&name=xhp_nt__fb__action__open_user"
          target="_blank"
          className="text-gray-700 hover:underline flex items-center space-x-1"
        >
          <i className="fab fa-facebook"></i>
          <span>Facebook</span>
        </Link>

        <Link
          href="mailto:ruetcse24@gmail.com"
          className="text-gray-700 hover:underline flex items-center space-x-1"
        >
          <i className="fas fa-envelope"></i>
          <span>Email</span>
        </Link>
      </footer>
    </main>
  );
}
