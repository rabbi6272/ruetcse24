import { CldImage } from "next-cloudinary";
import { ImageUploadModal } from "./ImageUploadModal";

import type { Student } from "../../types/Student";
import { User2 } from "lucide-react";

export function CreateProfilePage({
  studentInfo,
  setStudentInfo,
  handleCreateProfile,
  createLoading,
  handleImageUpload,
  imageUploadLoading,
}: {
  studentInfo: Student;
  setStudentInfo: React.Dispatch<React.SetStateAction<Student>>;
  handleCreateProfile: (e: React.FormEvent<HTMLFormElement>) => void;
  createLoading: boolean;
  handleImageUpload: (e: React.FormEvent<HTMLFormElement>) => void;
  imageUploadLoading: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        {/* Header with Logout */}
        <div>
          <h1 className="text-2xl text-gray-800">Create Your Profile</h1>
        </div>

        {/* Profile Picture Upload */}
        <div className="rounded-full h-30 w-30 ring-2 ring-indigo-500  relative">
          {studentInfo?.profilePicUrl ? (
            <CldImage
              crop="fill"
              width={120}
              height={120}
              gravity="face"
              src={studentInfo?.profilePicUrl}
              alt="Profile Preview"
              className="rounded-full object-cover overflow-hidden"
            />
          ) : (
            <div className="h-30 w-30 bg-gray-300 rounded-full flex items-center justify-center  text-xl">
              <User2 size={40} color="gray" />
            </div>
          )}
          <ImageUploadModal
            handleImageUpload={handleImageUpload}
            imageUploadLoading={imageUploadLoading}
          />
        </div>
      </div>

      <form onSubmit={handleCreateProfile} className="space-y-3 text-gray-600">
        <div>
          <label
            htmlFor="updateFullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name*
          </label>
          <input
            type="text"
            id="updateFullName"
            value={studentInfo?.fullName}
            onChange={(e) =>
              setStudentInfo((prev) =>
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
            Nickname (Optional)
          </label>
          <input
            type="text"
            id="updateNickname"
            value={studentInfo?.nickname}
            onChange={(e) =>
              setStudentInfo((prev) =>
                prev
                  ? {
                      ...prev,
                      nickname: e.target.value,
                    }
                  : prev,
              )
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="updateEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address*
          </label>
          <input
            type="email"
            id="updateEmail"
            value={studentInfo?.email}
            onChange={(e) =>
              setStudentInfo((prev) =>
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
            Roll*
          </label>
          <input
            type="text"
            id="updateRoll"
            value={studentInfo?.roll}
            onChange={(e) =>
              setStudentInfo((prev) =>
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
            value={studentInfo?.hobby}
            onChange={(e) =>
              setStudentInfo((prev) =>
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
            value={studentInfo?.fbProfile}
            onChange={(e) =>
              setStudentInfo((prev) =>
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
            value={studentInfo?.bio}
            onChange={(e) =>
              setStudentInfo((prev) =>
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
            6-digit Pincode*
          </label>
          <input
            type="text"
            id="updatePincode"
            value={studentInfo?.pincode}
            onChange={(e) =>
              setStudentInfo((prev) =>
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
            Select Section*
          </label>
          <select
            required
            id="abcSelect"
            value={studentInfo?.sec}
            onChange={(e) =>
              setStudentInfo((prev) =>
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
            disabled={createLoading}
            className="flex-1 bg-indigo-500 text-white py-2.5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors"
          >
            <span>{createLoading ? "Creating..." : "Create Profile"}</span>
            {createLoading && (
              <div className="loader border-4 border-gray-200 h-5 w-5 ml-2 rounded-full"></div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
