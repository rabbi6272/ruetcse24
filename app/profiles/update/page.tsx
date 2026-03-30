"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import { getUserByEmail, updateUser } from "../../../util/Database";

import type { Student } from "../../../types/Student";

import { LoginPage } from "../../components/LoginPage";
import { StudentPortalPage } from "../../components/StudentPortalPage";

import { useStudentStore } from "../../../store/StudentStore";

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ProfileUpdatePage() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPincode, setLoginPincode] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Profile state
  const [updateLoading, setUpdateLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // Zustand store
  const updateStudentInStore = useStudentStore((state) => state.updateStudent);

  // Profile form data
  const [profileData, setProfileData] = useState<Student>({
    id: "",
    fullName: "",
    nickname: "",
    email: "",
    hobby: "",
    roll: "",
    mobileNumber: "",
    bloodGroup: "",
    fbProfile: "",
    bio: "",
    pincode: "",
    sec: "",
    profilePicture: {
      publicId: "",
      url: "",
    },
    createdAt: Date.now(),
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const user = await getUserByEmail(loginEmail);
      if (!user || user.pincode !== loginPincode) {
        toast.error("Invalid email or pincode");
        setLoginLoading(false);
        return;
      }

      setIsLoggedIn(true);
      setProfileData(user);
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
      profilePicture: {
        publicId: "",
        url: "",
      },
      createdAt: Date.now(),
      roll: "",
      bloodGroup: "",
      mobileNumber: "",
    });
  };

  // Handle profile update
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
      // Update the store to reflect changes in the profiles page
      updateStudentInStore(updated.id, updated);
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
    const file: File | null = formData.get("profile") as File | null;
    if (!file) {
      toast.error("No file selected");
      return;
    }
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    try {
      setImageUploadLoading(true);

      // Delete existing image
      if (profileData?.profilePicture?.publicId) {
        const response = await fetch("/api/profiles/delete-image", {
          method: "DELETE",
          body: JSON.stringify({
            publicId: profileData.profilePicture.publicId,
          }),
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
      const { success, url, publicId } = await response.json();
      if (!success) {
        toast.error("Image upload failed");
        return;
      }
      const updated = await updateUser(profileData.id, {
        ...profileData,
        profilePicture: {
          url: url,
          publicId: publicId,
        },
      });
      if (updated) {
        setProfileData(updated);
        // Update the store to reflect changes in the profiles page
        updateStudentInStore(updated.id, updated);
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-3 md:p-6 xl:p-8">
      {!isLoggedIn ? (
        <LoginPage
          handleLogin={handleLogin}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPincode={loginPincode}
          setLoginPincode={setLoginPincode}
          loginLoading={loginLoading}
        />
      ) : (
        <StudentPortalPage
          handleLogout={handleLogout}
          profileData={profileData}
          setProfileData={setProfileData}
          handleUpdateProfile={handleUpdateProfile}
          updateLoading={updateLoading}
          handleImageUpload={handleImageUpload}
          imageUploadLoading={imageUploadLoading}
          handleDeleteAccount={handleDeleteAccount}
        />
      )}
    </div>
  );
}
