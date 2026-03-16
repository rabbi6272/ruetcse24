import Link from "next/link";

import { nunito } from "../ui/fonts";

import { CldImage } from "next-cloudinary";

import { Student } from "../../types/Student";

export function ProfileCard({
  index,
  fullName,
  nickname,
  bio,
  email,
  mobileNumber,
  hobby,
  fbProfile,
  bloodGroup,
  profilePicUrl,
}: { index: number } & Student) {
  return (
    <div
      className={`profile-card relative rounded-xl shadow-sm overflow-hidden hover:shadow-md card-border animate-fade-fast delay[${index * 100}ms]`}
    >
      {/* Blood Group */}
      <div
        className={`absolute top-2.5 right-2.5 px-2 py-1  rounded-full bg-[#e0e7ff] z-9 text-xs`}
        data-name="BloodGroupContainer"
      >
        <i className="fas fa-droplet text-red-500"></i>
        <span data-name="BloodGroup">{bloodGroup}</span>
      </div>

      {/* Profile Image */}
      <div className="h-auto flex items-center justify-center px-3 pt-3">
        <div className="rounded-full ring-2 ring-indigo-500 relative">
          {profilePicUrl ? (
            <CldImage
              crop="fill"
              width={140}
              height={140}
              gravity="face"
              src={profilePicUrl}
              alt="Profile Preview"
              className="rounded-full object-cover overflow-hidden"
            />
          ) : (
            <div className="h-35 w-35 bg-gray-300 rounded-full flex items-center justify-center text-indigo-600 text-3xl">
              {fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Name and Nickname */}
        <div
          className={`flex flex-col items-center text-center  ${nunito.className}`}
          data-name="nameContainer"
        >
          <h3 className="text-xl text-gray-700 font-bold" data-name="name">
            {fullName}
          </h3>
          {nickname && (
            <span
              className="text-sm text-gray-600 font-medium"
              data-name="nickname"
            >
              {nickname}
            </span>
          )}
        </div>

        {/* Bio, Email, Mobile Number, Hobby, Facebook Profile */}
        <div className="mt-4 space-y-3 text-gray-400 pt-2 border-t border-gray-300">
          {/* Bio */}
          <div
            className=" flex items-start gap-2 text-gray-500"
            data-name="bioContainer"
          >
            <i className="fas fa-quote-left h-4 w-4"></i>
            <p className="text-md bio-text" data-name="bio">
              {bio || "No bio available."}
            </p>
          </div>

          {/* Email */}
          <div
            className="flex items-center justify-center text-md"
            data-name="emailContainer"
          >
            <i className="fas fa-envelope mr-1.5 h-4 w-4 text-gray-400"></i>
            <span data-name="email">{email}</span>
          </div>

          {/* Mobile Number */}
          <div
            className="flex items-center justify-center text-md"
            data-name="mobileNumberContainer"
          >
            <i className="fas fa-phone mr-1.5 h-4 w-4 text-green-400"></i>
            <span data-name="mobileNumber">
              {mobileNumber || "Mobile number not provided"}
            </span>
          </div>

          {/* Hobby */}
          <div
            className="flex justify-center items-center"
            data-name="hobbyContainer"
          >
            <span className="flex items-center text-md">
              <i className="fas fa-fire h-4 w-4 mr-1 text-red-400"></i>
              <span data-name="hobby">{hobby || "No hobby specified"}</span>
            </span>
          </div>

          {/* Facebook Profile */}
          <div
            className="flex justify-center items-center text-md"
            data-name="fbContainer"
          >
            <Link
              href={fbProfile || "#"}
              target="_blank"
              rel="noreferrer"
              className=" hover:underline flex items-center"
              data-name="fbProfile"
            >
              <i className="fab fa-facebook h-4 w-4 mr-1 text-blue-400"></i>
              &nbsp; Facebook Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
