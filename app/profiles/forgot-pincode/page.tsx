import { CheckEmailAndVerifyOTPForm } from "./CheckEmailAndVerifyOTPForm";

export default function ForgotPincodePage() {
  return (
    <div>
      <CheckEmailAndVerifyOTPForm />
    </div>
  );
}

// try {
//   const res = await getUserByEmail(email);
//   if (!res) {
//     toast.error("No account found with this email.");
//     setUpdateLoading(false);
//     return;
//   }

//   setEmailFound(true);

//   if (!pincode) return;

//   const updatedUser = await updateUser(res.id, { pincode: pincode });
//   if (updatedUser) {
//     toast.success("Pincode updated successfully. You can now login.");
//     setUpdateLoading(false);
//     router.push("/profiles/update");
//     return;
//   } else {
//     toast.error("Failed to update pincode. Please try again.");
//     setUpdateLoading(false);
//     return;
//   }
// } catch (err) {
//   toast.error("An error occurred while fetching user data.");
//   setUpdateLoading(false);
//   return;
// } finally {
//   setUpdateLoading(false);
// }

{
  /* <div className="pt-2">
  <button
    type="submit"
    disabled={updateLoading}
    className="w-full bg-indigo-500 text-white py-2.5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer"
  >
    {updateLoading && <Spinner color="current" />}
    <span>{updateLoading ? "Updating..." : "Update Pincode"}</span>
  </button>
</div>; */
}
