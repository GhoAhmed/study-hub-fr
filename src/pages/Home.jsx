import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CTA from "../components/CTA";
import Features from "../components/Features";
import Stats from "../components/Stats";
import Categories from "../components/Categories";
import FeaturedCourses from "../components/FeaturedCourses";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* ── HERO ── */}
      <Hero />

      {/* ── STATS ── */}
      <Stats />

      {/* ── CATEGORIES ── */}
      <Categories />

      {/* ── FEATURED COURSES ── */}
      <FeaturedCourses />

      {/* ── FEATURES ── */}
      <Features />

      {/* ── CTA ── */}
      <CTA />

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}
