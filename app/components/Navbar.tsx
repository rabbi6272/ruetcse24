import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="h-16 w-full sticky top-0 z-99 bg-white/40 text-gray-600 px-4 md:px-6 lg:px-8 xl:px-12 backdrop-blur-md shadow-sm flex items-center justify-between">
      <Link href={"/"}>
        <Image
          src={"/TitleIcon.png"}
          alt="Home icon"
          width={70}
          height={30}
          loading="lazy"
          style={{ height: "auto" }}
        />
      </Link>

      <div className="sm:space-x-1 md:space-x-2 lg:space-x-3 xl:space-x-4">
        {/* <Link
          href={"/profiles/create"}
          className="px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors duration-300"
        >
          {" "}
          Create
        </Link> */}
        <Link
          href={"/profiles/update"}
          className="px-4 py-1.5 font-medium rounded-full hover:bg-gray-200 transition-colors duration-300"
        >
          Update
        </Link>
      </div>
    </nav>
  );
}
