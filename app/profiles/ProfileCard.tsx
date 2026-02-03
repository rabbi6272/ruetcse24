import styles from "./StudentManager.module.css";
import Link from "next/link";

import { nunito } from "../ui/fonts";

import { CldImage } from "next-cloudinary";

export type ProfileCardProps = {
  name?: string;
  nickname?: string;
  imageSrc?: string | null;
  bio?: string | null;
  section?: string | null;
  email?: string | null;
  hobby?: string | null;
  fbUrl?: string | null;
  updatedAt?: string | Date | null;
};

function formatTimeAgo(updatedAt?: string | Date | null) {
  if (!updatedAt) return "0 mins ago";
  const d = typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt;
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff} secs ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export function ProfileCard({
  name = "Anonymous",
  nickname = "",
  imageSrc = null,
  bio = "No bio provided",
  section = "No verified",
  email = "email@example.com",
  hobby = "Hobby not specified",
  fbUrl = "#",
  updatedAt = null,
}: ProfileCardProps) {
  return (
    <div
      className={`${styles["profile-card"]} relative rounded-xl shadow-sm overflow-hidden hover:shadow-md ${styles["card-border"]}`}
    >
      {/* Profile Image */}
      <div className="h-auto flex items-center justify-center px-3 pt-3">
        <div className="rounded-full ring-2 ring-indigo-500 relative">
          {imageSrc ? (
            <CldImage
              crop="fill"
              width={140}
              height={140}
              gravity="face"
              src={imageSrc}
              alt="Profile Preview"
              className="rounded-full object-cover overflow-hidden"
            />
          ) : (
            <div className="h-30 w-30 bg-gray-300 rounded-full flex items-center justify-center text-indigo-600 text-3xl">
              {name
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
        <div className="flex flex-col items-center text-center">
          <h3
            className={`text-xl text-gray-600 font-bold ${nunito.className}`}
            data-name="name"
          >
            {name}
          </h3>
          {nickname ? (
            <span
              className={`text-sm text-gray-500 mt-2 ${nunito.className}`}
              data-name="nickname"
            >
              {nickname}
            </span>
          ) : null}
        </div>

        {/* Bio */}
        <div className="pt-4 border-t border-gray-100 flex items-start gap-2">
          <i style={{ fontSize: "15px", color: "gray" }} className="fa">
            &#xf10d;
          </i>
          <p
            className={`text-md text-gray-500 ${styles["bio-text"]}`}
            data-name="bio"
          >
            {bio}
          </p>
        </div>

        {/* Section Badge */}
        <div
          className={`${styles["hobby-badge"]} px-2.5 py-1 absolute top-2.5 right-2.5 z-9999999 `}
          data-name="sectionContainer"
        >
          <i className="fas fa-bookmark"></i>
          <span data-name="section" className="font-bold">
            {section}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-center text-md text-gray-400">
            <i className="fas fa-envelope mr-1.5 h-4 w-4 text-gray-400"></i>
            <span data-name="email">{email}</span>
          </div>

          <div className="flex justify-center" data-name="hobbyContainer">
            <span className="flex items-center text-md text-gray-400">
              <i className="fas fa-fire h-4 w-4 mr-1 text-red-400"></i>
              <span data-name="hobby">{hobby}</span>
            </span>
          </div>

          <div
            className="flex justify-center text-md text-gray-400"
            data-name="fbContainer"
          >
            <Link
              href={fbUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline flex items-center"
              data-name="fbProfile"
            >
              <i className="fab fa-facebook h-4 w-4 mr-1"></i>
              &nbsp; Facebook Profile
            </Link>
          </div>
          {/* 
          <span className="text-gray-400 text-xs">
            Updated <span id="uw">{formatTimeAgo(updatedAt)}</span>
          </span> */}
        </div>
      </div>
    </div>
  );
}
