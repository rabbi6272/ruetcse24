"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAllUsers } from "../../util/Database";
import { queryKeys } from "../../util/queryKeys";

import type { Student } from "../../types/Student";

import { ProfilePageHeader } from "../components/ProfilePageHeader";
import { ProfilePageSearchAndStats } from "../components/ProfilePageSearch&Stats";
import { ProfilePageFooter } from "../components/ProfilePageFooter";
import { ProfilePageProfileGrid } from "../components/ProfilePageProfileGrid";

async function fetchStudents() {
  const students = await getAllUsers();

  return students.sort((a, b) => a.roll.localeCompare(b.roll));
}

export default function StudentManager() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: allStudents = [],
    isLoading: studentsLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.students,
    queryFn: fetchStudents,
  });

  const filteredData = useMemo(() => {
    const normalizedSearchTerm = searchTerm.toLowerCase();

    return allStudents.filter((student: Student) => {
      const matchesSearch =
        student.fullName?.toLowerCase().includes(normalizedSearchTerm) ||
        student.nickname?.toLowerCase().includes(normalizedSearchTerm) ||
        student.email?.toLowerCase().includes(normalizedSearchTerm) ||
        student.roll?.toLowerCase().includes(normalizedSearchTerm) ||
        student.hobby?.toLowerCase().includes(normalizedSearchTerm) ||
        student.mobileNumber?.toLowerCase().includes(normalizedSearchTerm);

      return matchesSearch;
    });
  }, [allStudents, searchTerm]);

  return (
    <div className="min-h-[calc(100vh-64px)] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ProfilePageHeader />

        {/* <!-- Search and Stats --> */}
        <ProfilePageSearchAndStats
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredData={filteredData}
        />

        {isError && (
          <p className="mb-4 text-center text-sm text-red-600">
            Failed to load profiles. Please try again later.
          </p>
        )}

        {/* Profiles Grid */}
        <ProfilePageProfileGrid
          filteredData={filteredData}
          studentsLoading={studentsLoading}
        />
      </div>

      <br />

      {/* Footer */}
      <ProfilePageFooter />
    </div>
  );
}
