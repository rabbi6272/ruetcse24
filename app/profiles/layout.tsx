import { Navbar } from "../components/Navbar";

export default function ProfilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen p-4"
      >
        {children}
      </main>
    </>
  );
}
