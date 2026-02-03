"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import styles from "./StudentManager.module.css";
import { ProfileCard } from "./ProfileCard";
import { getAllUsers } from "../../util/Database";

import type { Student } from "../../types/Student";

export default function StudentManager() {
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [filteredData, setFilteredData] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");

  // Filter students when search or filter changes
  useEffect(() => {
    async function fetchUsers() {
      const res = await getAllUsers();
      setStudentsList(res);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, sectionFilter, studentsList]);

  const filterStudents = () => {
    const filtered = studentsList.filter((student) => {
      const matchesSearch =
        student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.hobby?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSection =
        sectionFilter === "all"
          ? true
          : sectionFilter === "none"
            ? !student.sec
            : student.sec === sectionFilter;

      return matchesSearch && matchesSection;
    });

    setFilteredData(filtered);
  };

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-5xl font-light text-gray-800 mb-2">
            RUET CSE 24
          </h1>
          <p className="text-gray-600 text-md font-normal">
            Browse our community members
          </p>
        </div>

        {/* <!-- Search and Stats --> */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-8 mb-8 transition-all duration-300 hover:shadow-md card-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative grow flex">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-full bg-white text-gray-700 shadow-sm focus:outline-none  focus:border-indigo-500 transition duration-300"
                placeholder="Search by name, nickname, or hobby..."
              />
              <button
                id="searchButton"
                className={`${styles["search-btn"]} bg-indigo-600 text-white px-4 py-2 rounded-r-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                Search
              </button>
            </div>
            <div className="bg-indigo-50 text-indigo-800 px-4 py-2 rounded-full flex items-center transition duration-300 hover:bg-indigo-100">
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z"></path>
              </svg>
              <span id="profileCount">{filteredData.length}</span>&nbsp;
              profiles found
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        <div
          id="profilesContainer"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredData.length === 0
            ? null
            : filteredData.map((student) => (
                <ProfileCard
                  key={student.email}
                  name={student.fullName}
                  nickname={student.nickname}
                  imageSrc={student.profilePicUrl || null}
                  bio={student.bio || null}
                  section={student.sec || null}
                  email={student.email}
                  hobby={student.hobby || null}
                  fbUrl={student.fbProfile || null}
                  updatedAt={
                    student.updatedAt
                      ? new Date(student.updatedAt)
                      : student.createdAt
                        ? new Date(student.createdAt)
                        : null
                  }
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
          {/* <i className="far fa-copyright"></i>  */}
          All Reserved by
          <span className="text-blue-500 font-semibold ml-1">RUET CSE 24</span>
        </span>

        <Link
          href="https://m.facebook.com/profile.php?id=61574730479807&name=xhp_nt__fb__action__open_user"
          target="_blank"
          className="text-gray-700 hover:underline flex items-center space-x-1"
        >
          {/* <i className="fab fa-facebook"></i> */}
          <span>Facebook</span>
        </Link>

        <Link
          href="mailto:ruetcse24@gmail.com"
          className="text-gray-700 hover:underline flex items-center space-x-1"
        >
          {/* <i className="fas fa-envelope"></i> */}
          <span>Email</span>
        </Link>
      </footer>
    </main>
  );
}
