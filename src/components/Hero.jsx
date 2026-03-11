import React from "react";
import { FaGraduationCap } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden px-6 py-28 text-center">
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none -top-32 -left-32 pulse-slow"
        style={{
          background:
            "radial-gradient(circle, rgba(108,71,255,0.15), transparent)",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none -bottom-20 -right-20 pulse-slow"
        style={{
          background:
            "radial-gradient(circle, rgba(0,229,176,0.12), transparent)",
          animationDelay: "2s",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 fade-up"
          style={{
            background: "rgba(108,71,255,0.12)",
            border: "1px solid rgba(108,71,255,0.3)",
            color: "var(--color-accent)",
          }}
        >
          <FaGraduationCap size={16} /> The platform built for serious learners
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-tight mb-6 fade-up-2">
          Master skills that
          <br />
          <span className="text-primary">shape your future</span>
        </h1>

        <p className="text-lg text-muted max-w-xl mx-auto mb-10 fade-up-3 leading-relaxed">
          Learn from verified experts. Build real projects. Earn certificates
          that open doors.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-up-4">
          <Link to="/courses">
            <button className="btn-primary glow-primary text-base px-8 py-3.5 flex items-center gap-2">
              Explore Courses <MdArrowForward size={18} />
            </button>
          </Link>
          <Link to="/register">
            <button className="btn-ghost text-base px-8 py-3.5">
              Start for Free
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
