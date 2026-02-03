import { CldImage } from "next-cloudinary";
import { ImageUploadModal } from "./ImageUploadModal";

import type { Student } from "../../types/Student";

export function ProfilePage({
  handleLogout,
  profileData,
  setProfileData,
  handleUpdateProfile,
  updateLoading,
  handleImageUpload,
  imageUploadLoading,
  handleDeleteAccount,
}: {
  handleLogout: () => void;
  profileData: Student;
  setProfileData: React.Dispatch<React.SetStateAction<Student>>;
  handleUpdateProfile: (e: React.FormEvent<HTMLFormElement>) => void;
  updateLoading: boolean;
  handleImageUpload: (e: React.FormEvent<HTMLFormElement>) => void;
  imageUploadLoading: boolean;
  handleDeleteAccount: () => void;
}) {
  return (
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
          <ImageUploadModal
            handleImageUpload={handleImageUpload}
            imageUploadLoading={imageUploadLoading}
          />
        </div>
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-3 text-gray-600">
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
            <span>{updateLoading ? "Updating..." : "Update Profile"}</span>
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
  );
}
