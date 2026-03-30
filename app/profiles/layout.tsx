import { Navbar } from "../components/Navbar";

export default function ProfilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
    </>
  );
}
