import Navigation from "@/components/layout/partials/navigation";
import Footer from "@/components/layout/partials/footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen w-full px-4 md:px-10 overflow-hidden md:max-h-screen">
      <Navigation />
      <main className="flex-1 pt-14 flex flex-col overflow-y-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}