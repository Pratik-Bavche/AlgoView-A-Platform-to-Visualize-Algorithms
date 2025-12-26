import { Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Dashboard } from "@/pages/dashboard";
import { Visualizer } from "@/pages/visualizer";

function App() {
  return (
    <div className="h-full relative min-h-screen bg-background text-foreground font-sans antialiased">
      <Sidebar />
      <main className="md:pl-64 h-full">
        <Navbar />
        <div className="p-4 md:p-8 pt-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/visualize/:id" element={<Visualizer />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
