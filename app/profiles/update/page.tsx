"use client";

import { useState } from "react";
import Link from "next/link";

import toast from "react-hot-toast";

import { SquarePen } from "lucide-react";
import { Button, Input, Modal } from "@heroui/react";
import { CldImage } from "next-cloudinary";
import { getAllUsers, updateUser } from "../../../util/Database";

import type { Student } from "../../../util/Database";

export default function StudentPortal() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPincode, setLoginPincode] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Profile state
  const [updateLoading, setUpdateLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // Profile form data
  const [profileData, setProfileData] = useState<Student>({
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
  });

  // Handle login (use server API)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const data = await getAllUsers();
      const user = data.find(
        (s: Student) => s.email.toLowerCase() === loginEmail.toLowerCase(),
      );
      if (!user || user.pincode !== loginPincode) {
        toast.error("Invalid email or pincode");
        setLoginLoading(false);
        return;
      }

      setIsLoggedIn(true);
      setProfileData({
        id: user.id,
        fullName: user.fullName,
        nickname: user.nickname,
        email: user.email,
        hobby: user.hobby || "",
        fbProfile: user.fbProfile || "",
        bio: user.bio || "",
        pincode: user.pincode,
        sec: user.sec || "",
        profilePicUrl: user.profilePicUrl,
        profilePicPublicId: user.profilePicPublicId || "",
        createdAt: user.createdAt,
        roll: user.roll,
      });
      toast.success("Login successful!");
    } catch (err) {
      toast.error("Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginEmail("");
    setLoginPincode("");
    setProfileData({
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
      createdAt: Date.now(),
      roll: "",
    });
  };

  // Handle profile update (use server API)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    if (!profileData) {
      toast.error("No profile data found.");
      setUpdateLoading(false);
      return;
    }

    try {
      const updated = await updateUser(profileData.id, profileData);
      if (!updated) {
        toast.error("Update failed");
        setUpdateLoading(false);
        return;
      }
      setProfileData(updated);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle account deletion (use server API)
  const handleDeleteAccount = async () => {
    if (!profileData) return;
    try {
      const res = await fetch(`/api/students`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (!res.ok) {
        toast.error("Failed to delete account");
        return;
      }
      toast.success("Account deleted");
      handleLogout();
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("profile");
    if (!file) {
      toast.error("No file selected");
      return;
    }
    try {
      setImageUploadLoading(true);

      // Delete existing image
      if (profileData?.profilePicPublicId) {
        const response = await fetch("/api/profiles/delete-image", {
          method: "DELETE",
          body: JSON.stringify({ publicId: profileData.profilePicPublicId }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          toast.error(data.error || "Failed to delete existing image");
          return;
        }
      }

      // Upload new image
      const response = await fetch("/api/profiles/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Image upload failed");
        return;
      }

      const updated = await updateUser(profileData.id, {
        ...profileData,
        profilePicUrl: data.secure_url,
        profilePicPublicId: data.asset_id,
      });
      if (updated) {
        setProfileData(updated);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to update profile with image");
      }
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setImageUploadLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        body {
          font-family: "Lato", sans-serif;
        }
        @keyframes spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .loader {
          border-top-color: #6366f1;
          animation: spinner 1.5s linear infinite;
        }
        .tab-button {
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-button.active {
          background-color: #6366f1;
          color: white;
        }
        .profile-tab {
          padding: 8px 16px;
          border-radius: 4px 4px 0 0;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }
        .profile-tab.active {
          border-bottom: 3px solid #6366f1;
          color: #6366f1;
          font-weight: bold;
        }
      `}</style>

      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        {!isLoggedIn ? (
          /* Login Container */
          <div className="bg-white rounded-2xl shadow hover:shadow-lg p-6 w-full max-w-md">
            <h1 className="text-2xl  text-gray-800 text-center mb-6">
              Login to Your Account
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="loginEmail"
                  className="block text-sm text-gray-700 mb-1 pl-3"
                >
                  Email Address*
                </label>
                <input
                  type="email"
                  id="loginEmail"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="loginPincode"
                  className="block text-sm text-gray-700 mb-1 pl-3"
                >
                  6-digit Pincode*
                </label>
                <input
                  type="password"
                  id="loginPincode"
                  value={loginPincode}
                  onChange={(e) => setLoginPincode(e.target.value)}
                  pattern="\d{6}"
                  maxLength={6}
                  className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
                <Link href="/forgot-pincode">
                  <p className="text-indigo-600 hover:text-indigo-800 text-sm cursor-pointer mt-1 pl-3">
                    Forgot Pincode?
                  </p>
                </Link>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-indigo-500 text-white py-2.5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors"
                >
                  <span>{loginLoading ? "Logging in..." : "Login"}</span>
                  {loginLoading && (
                    <div className="loader border-4 border-gray-200 h-5 w-5 ml-2 rounded-full"></div>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Profile Container */
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              {/* Header with Logout */}
              <div>
                <h1 className="text-2xl text-gray-800">Your Profile</h1>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>

              {/* Profile Picture Upload */}
              <div className="rounded-full h-30 w-30 ring-2 ring-indigo-500  relative">
                {profileData?.profilePicUrl ? (
                  <CldImage
                    crop="fill"
                    width={120}
                    height={120}
                    gravity="face"
                    src={profileData?.profilePicUrl}
                    alt="Profile Preview"
                    className="rounded-full object-cover overflow-hidden"
                  />
                ) : (
                  <div className="h-30 w-30 bg-gray-300 rounded-full flex items-center justify-center text-indigo-600 text-3xl">
                    {profileData?.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
                <Modal>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-0 right-0 bg-gray-200 rounded-full shadow-md cursor-pointer"
                  >
                    <SquarePen color="blue" size={20} />
                  </Button>
                  <Modal.Backdrop variant={"blur"}>
                    <Modal.Container>
                      <Modal.Dialog className="sm:max-w-90">
                        <Modal.Header>
                          <Modal.Heading>Update Profile Picture</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                          <form
                            id="uploadForm"
                            onSubmit={handleImageUpload}
                            className="text-white"
                          >
                            <Input
                              variant="secondary"
                              type="file"
                              name="profile"
                              accept="image/*"
                            />
                          </form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            className={
                              "w-full" +
                              (imageUploadLoading ? " cursor-not-allowed " : "")
                            }
                            form="uploadForm"
                            type="submit"
                          >
                            {imageUploadLoading ? "Uploading..." : "Upload"}
                            {imageUploadLoading && (
                              <div className="loader border-4 border-gray-200 h-5 w-5 ml-2 rounded-full"></div>
                            )}
                          </Button>
                        </Modal.Footer>
                      </Modal.Dialog>
                    </Modal.Container>
                  </Modal.Backdrop>
                </Modal>
              </div>
            </div>

            <form
              onSubmit={handleUpdateProfile}
              className="space-y-3 text-gray-600"
            >
              <div>
                <label
                  htmlFor="updateFullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="updateFullName"
                  value={profileData?.fullName}
                  onChange={(e) =>
                    setProfileData((prev) =>
                      prev
                        ? {
                            ...prev,
                            fullName: e.target.value,
                          }
                        : prev,
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="updateNickname"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nickname
                </label>
                <input
                  type="text"
                  id="updateNickname"
                  value={profileData?.nickname}
                  onChange={(e) =>
                    setProfileData((prev) =>
                      prev
                        ? {
                            ...prev,
                            nickname: e.target.value,
                          }
                        : prev,
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="updateEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="updateEmail"
                  value={profileData?.email}
                  onChange={(e) =>
                    setProfileData((prev) =>
                      prev ? { ...prev, email: e.target.value } : prev,
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="updateRoll"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Roll (Must)
                </label>
                <input
                  type="text"
                  id="updateRoll"
                  value={profileData?.roll ?? ""}
                  onChange={(e) =>
                    setProfileData((prev) =>
                      prev
                        ? {
                            ...prev,
                            roll: e.target.value,
                          }
                        : prev,
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="updateHobby"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hobby (Optional)
                </label>
                <input
                  type="text"
                  id="updateHobby"
                  value={profileData?.hobby}
                  onChange={(e) =>
                    setProfileData((prev) =>
                      prev ? { ...prev, hobby: e.target.value } : prev,
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="updateFbProfile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Facebook Profile (Optional)
                </label>
                <input
                  type="url"
                  id="updateFbProfile"
                  value={profileData?.fbProfile}
                  onChange={(e) =>
                    setProfileData((prev) =>
                      prev
                        ? {
                            ...prev,
                            fbProfile: e.target.value,
                          }
                        : prev,
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="updateBio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Short Bio (Optional)
                </label>
                <textarea
                  id="updateBio"
                  rows={3}
                  value={profileData?.bio}
                  onChange={(e) =>
                    setProfileData((prev) =>
                      prev ? { ...prev, bio: e.target.value } : prev,
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="updatePincode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  6-digit Pincode
                </label>
                <input
                  type="text"
                  id="updatePincode"
                  value={profileData?.pincode}
                  onChange={(e) =>
                    setProfileData((prev) =>
                      prev
                        ? {
                            ...prev,
                            pincode: e.target.value,
                          }
                        : prev,
                    )
                  }
                  pattern="\d{6}"
                  maxLength={6}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <hr />

              <div>
                <label
                  htmlFor="abcSelect"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Section:
                </label>
                <select
                  id="abcSelect"
                  value={profileData?.sec}
                  onChange={(e) =>
                    setProfileData((prev) =>
                      prev ? { ...prev, sec: e.target.value } : prev,
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Select one</option>
                  <option value="a">a</option>
                  <option value="b">b</option>
                  <option value="c">c</option>
                </select>
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 bg-indigo-500 text-white py-2.5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors"
                >
                  <span>
                    {updateLoading ? "Updating..." : "Update Profile"}
                  </span>
                  {updateLoading && (
                    <div className="loader border-4 border-gray-200 h-5 w-5 ml-2 rounded-full"></div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-500 text-white py-2.5 rounded-full hover:bg-red-600 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

{
  /* Post Status Tab */
}
{
  /* {activeProfileTab === "status" && (
              <div className="space-y-4">
                {currentStatus && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Your Current Status
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{currentStatus.text}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {formatTimestamp(currentStatus.timestamp)}
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={handleEditStatus}
                        className="text-sm bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteStatus}
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handlePostStatus} className="space-y-4">
                  <div>
                    <label
                      htmlFor="statusText"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      What&apos;s on your mind?
                    </label>
                    <textarea
                      id="statusText"
                      rows={4}
                      maxLength={50}
                      value={statusText}
                      onChange={(e) => setStatusText(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="Share your thoughts (max 50 chars)..."
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {statusText.length} / 50
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={statusLoading || !statusText.trim()}
                      className="w-full bg-indigo-500 text-white py-2.5 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors disabled:opacity-50"
                    >
                      <span>
                        {statusLoading ? "Posting..." : "Post Status"}
                      </span>
                      {statusLoading && (
                        <div className="loader border-4 border-gray-200 h-5 w-5 ml-2 rounded-full"></div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )} */
}
