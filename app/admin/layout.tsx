import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1A1917] flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 pt-14 md:pt-10 p-4 md:p-8 overflow-y-auto min-w-0">{children}</main>
    </div>
  );
}
