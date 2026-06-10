import Sidebar from "@/app/components/Sidebar";

// App shell: persistent sidebar (desktop) / top bar (mobile) around every app page.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-chalk">
      <Sidebar />
      <div className="md:pl-[248px]">
        <main className="mx-auto max-w-[1080px] px-5 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
