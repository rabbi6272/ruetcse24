"use client";

import { useState, FormEvent } from "react";
import { CreateProfilePage } from "../../components/CreateProfilePage";
import toast from "react-hot-toast";
import { createUser } from "../../../util/Database";
import { Student } from "../../../types/Student";
import { useRouter } from "next/navigation";

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function Page() {
  const [studentInfo, setStudentInfo] = useState<Student>({
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
  const [createLoading, setCreateLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const router = useRouter();

  const handleCreateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !studentInfo.fullName ||
      !studentInfo.email ||
      !studentInfo.pincode ||
      !studentInfo.roll ||
      !studentInfo.sec
    ) {
      toast.error("Full name, email, pincode, roll, and section are required");
      return;
    }
    setCreateLoading(true);
    try {
      const response = await createUser(studentInfo);
      if (!response) {
        toast.error("Profile creation failed");
        setCreateLoading(false);
        return;
      }
      toast.success("Profile created successfully");
      router.push("/profiles");
    } catch (error) {
      toast.error("Profile creation failed");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file: File = formData.get("profile") as File;
    if (file.size === 0) {
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
      studentInfo.profilePicUrl = url;
      studentInfo.profilePicPublicId = publicId;
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setImageUploadLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-6 xl:p-8">
      <CreateProfilePage
        studentInfo={studentInfo}
        setStudentInfo={setStudentInfo}
        handleCreateProfile={handleCreateProfile}
        createLoading={createLoading}
        handleImageUpload={handleImageUpload}
        imageUploadLoading={imageUploadLoading}
      />
    </main>
  );
}
