"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import { deleteUser, getUserByEmail, updateUser } from "../../../util/Database";

import type { Student } from "../../../types/Student";

import { LoginPage } from "../../components/LoginPage";
import { StudentPortalPage } from "../../components/StudentPortalPage";

import { useStudentStore } from "../../../store/StudentStore";

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export default function ProfileUpdatePage() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPincode, setLoginPincode] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Profile state
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // Zustand store
  const updateStudentInStore = useStudentStore((state) => state.updateStudent);
  const deleteStudentFromStore = useStudentStore(
    (state) => state.deleteStudent,
  );

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

    if (!profileData.id) {
      toast.error("Profile is missing an ID. Please login again.");
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
      console.error("Profile update failed:", err);
      toast.error("Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!profileData || deleteLoading) return;

    if (!profileData.id) {
      toast.error("Profile is missing an ID. Please login again.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    );

    if (!confirmed) return;

    setDeleteLoading(true);

    try {
      if (profileData.profilePicture?.publicId) {
        await deleteProfileImage(profileData.profilePicture.publicId);
      }

      const deleted = await deleteUser(profileData.id);
      if (!deleted) {
        toast.error("Failed to delete account");
        return;
      }

      deleteStudentFromStore(profileData.id);
      toast.success("Account deleted");
      handleLogout();
    } catch (err) {
      console.error("Account deletion failed:", err);
      toast.error("Failed to delete account");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (imageUploadLoading) return;

    const formData = new FormData(e.currentTarget);
    const file: File | null = formData.get("profile") as File | null;

    if (!file || file.size === 0) {
      toast.error("No file selected");
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    try {
      setImageUploadLoading(true);

      const previousPublicId = profileData?.profilePicture?.publicId;

      // Upload new image
      const response = await fetch("/api/profiles/upload-image", {
        method: "POST",
        body: formData,
      });
      const uploadData = await response.json();
      const { success, url, publicId } = uploadData;
      if (!response.ok || !success || !url || !publicId) {
        toast.error(uploadData.error || "Image upload failed");
        return;
      }

      const updated = await updateUser(profileData.id, {
        ...profileData,
        profilePicture: {
          url: url,
          publicId: publicId,
        },
      });

      if (!updated) {
        await deleteProfileImage(publicId);
        toast.error("Failed to update profile with image");
        return;
      }

      setProfileData(updated);
      // Update the store to reflect changes in the profiles page
      updateStudentInStore(updated.id, updated);

      if (previousPublicId && previousPublicId !== publicId) {
        const deletedPreviousImage = await deleteProfileImage(previousPublicId);
        if (!deletedPreviousImage) {
          toast.error("Image updated, but the old image cleanup failed");
          return;
        }
      }

      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setImageUploadLoading(false);
    }
  };

  const deleteProfileImage = async (publicId: string) => {
    const response = await fetch("/api/profiles/delete-image", {
      method: "DELETE",
      body: JSON.stringify({
        publicId,
        studentId: profileData.id,
        pincode: profileData.pincode,
      }),
      headers: { "Content-Type": "application/json" },
    });

    return response.ok;
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
          deleteLoading={deleteLoading}
        />
      )}
    </div>
  );
}
