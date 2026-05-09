"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateProfilePage } from "../../components/CreateProfilePage";
import { createUser } from "../../../util/Database";
import { queryKeys } from "../../../util/queryKeys";
import { Student } from "../../../types/Student";

import toast from "react-hot-toast";

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
    profilePicture: {
      publicId: "",
      url: "",
    },
    createdAt: Date.now(),
    roll: "",
  });
  // const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const createProfileMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.students });
      toast.success("Profile created successfully");
      router.push("/profiles");
    },
    onError: () => {
      toast.error("Profile creation failed");
    },
  });

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
    createProfileMutation.mutate(studentInfo);
  };

  // const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const file: File = formData.get("profile") as File;
  //   if (file.size === 0) {
  //     toast.error("No file selected");
  //     return;
  //   }
  //   // Validate file size
  //   if (file.size > MAX_FILE_SIZE) {
  //     toast.error("File size exceeds 5MB limit");
  //     return;
  //   }
  //   try {
  //     setImageUploadLoading(true);
  //     // Upload new image
  //     const response = await fetch("/api/profiles/upload-image", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const { success, url, publicId } = await response.json();
  //     if (!success) {
  //       toast.error("Image upload failed");
  //       return;
  //     }
  //     studentInfo.profilePicture = {
  //       url: url,
  //       publicId: publicId,
  //     };
  //     toast.success("Image uploaded successfully");
  //   } catch (error) {
  //     toast.error("Image upload failed");
  //   } finally {
  //     setImageUploadLoading(false);
  //   }
  // };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-6 xl:p-8">
      <CreateProfilePage
        studentInfo={studentInfo}
        setStudentInfo={setStudentInfo}
        handleCreateProfile={handleCreateProfile}
        createLoading={createProfileMutation.isPending}
        // handleImageUpload={handleImageUpload}
        // imageUploadLoading={imageUploadLoading}
      />
    </main>
  );
}
