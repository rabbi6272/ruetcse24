import { ListBox, Select } from "@heroui/react";

import type { SectionFilter, Student } from "../../types/Student";

export function ProfilePageSearchAndStats({
  searchTerm,
  setSearchTerm,
  filteredData,
  selectedSection,
  setSelectedSection,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredData: Student[];
  selectedSection: SectionFilter;
  setSelectedSection: (section: SectionFilter) => void;
}) {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-4 md:p-8 mb-8 transition-all duration-300 hover:shadow-md card-border">
      <div className="flex flex-col gap-4">
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
            className={`search-btn bg-indigo-600 text-white px-4 md:px-8 xl:px-12 py-2 font-medium rounded-r-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            Search
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="bg-indigo-50 text-indigo-800 px-8 py-2 rounded-full w-full flex items-center justify-center transition duration-300 hover:bg-indigo-100">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z"></path>
            </svg>
            <span id="profileCount">{filteredData.length}</span>&nbsp; profiles
            found
          </div>
          <Select
            className="w-full md:max-w-[50%] drop-shadow"
            placeholder="Select Section"
            aria-labelledby="Section Selector"
            selectedKey={selectedSection}
            onSelectionChange={(key) => {
              setSelectedSection(String(key) as SectionFilter);
            }}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="All" textValue="All">
                  All Sections
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="a" textValue="A">
                  Section A
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="b" textValue="B">
                  Section B
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="c" textValue="C">
                  Section C
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>
    </div>
  );
}
