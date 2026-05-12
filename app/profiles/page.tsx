"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAllUsers } from "../../util/Database";
import { queryKeys } from "../../util/queryKeys";

import type { SectionFilter } from "../../types/Student";

import { ProfilePageHeader } from "../components/ProfilePageHeader";
import { ProfilePageSearchAndStats } from "../components/ProfilePageSearch&Stats";
import { ProfilePageFooter } from "../components/ProfilePageFooter";
import { ProfilePageProfileGrid } from "../components/ProfilePageProfileGrid";

async function fetchStudents() {
  const students = await getAllUsers();
  return students
    .filter((student) => student.roll.includes("2403"))
    .sort((a, b) => a.roll.localeCompare(b.roll));
}

function getSectionFromRoll(roll: string): SectionFilter | null {
  const rollNumber = Number(roll);

  if (rollNumber >= 2403001 && rollNumber <= 2403060) return "a";
  if (rollNumber >= 2403061 && rollNumber <= 2403120) return "b";
  if (rollNumber >= 2403121 && rollNumber <= 2403180) return "c";

  return null;
}

export default function StudentManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState<SectionFilter>("All");

  const {
    data: allStudents = [],
    isLoading: studentsLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.students,
    queryFn: fetchStudents,
  });

  const filteredData = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return allStudents.filter((student) => {
      const searchableFields = [
        student.fullName,
        student.nickname,
        student.email,
        student.roll,
        student.mobileNumber,
      ];

      const matchesSearch =
        !normalizedSearchTerm ||
        searchableFields.some((field) =>
          field?.toLowerCase().includes(normalizedSearchTerm),
        );

      const matchesSection =
        selectedSection === "All" ||
        getSectionFromRoll(student.roll) === selectedSection;

      return matchesSearch && matchesSection;
    });
  }, [allStudents, searchTerm, selectedSection]);

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
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
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
