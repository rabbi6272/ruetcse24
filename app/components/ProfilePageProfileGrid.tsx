import { Student } from "../../types/Student";

import { ProfileCard } from "./ProfileCard";

import { Skeleton } from "@heroui/react";

export function ProfilePageProfileGrid({
  filteredData,
  studentsLoading,
}: {
  filteredData: Student[];
  studentsLoading: boolean;
}) {
  if (studentsLoading) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            animationType="shimmer"
            className="h-60 w-full rounded-lg bg-white"
          />
        ))}
      </div>
    );
  }
  return (
    <div
      id="profilesContainer"
      className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4"
    >
      {filteredData.length !== 0 ? (
        filteredData.map((student, index) => (
          <ProfileCard key={index} index={index} {...student} />
        ))
      ) : (
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
      )}
    </div>
  );
}
