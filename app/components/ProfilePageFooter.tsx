import Link from "next/link";

export function ProfilePageFooter() {
  return (
    <footer className="w-full py-2 text-center text-sm flex flex-wrap items-center justify-center space-x-4 font-sans">
      <span className="text-gray-600">
        <i className="far fa-copyright"></i>
        All Reserved by
        <span className="text-blue-500 font-semibold ml-1">RUET CSE 24</span>
      </span>

      <Link
        href="https://m.facebook.com/profile.php?id=61574730479807&name=xhp_nt__fb__action__open_user"
        target="_blank"
        className="text-gray-700 hover:underline flex items-center space-x-1"
      >
        <i className="fab fa-facebook"></i>
        <span>Facebook</span>
      </Link>

      <Link
        href="mailto:ruetcse24@gmail.com"
        className="text-gray-700 hover:underline flex items-center space-x-1"
      >
        <i className="fas fa-envelope"></i>
        <span>Email</span>
      </Link>
    </footer>
  );
}
