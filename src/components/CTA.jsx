import React from "react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="card text-center py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(108,71,255,0.12), transparent 70%)",
          }}
        />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Ready to start learning?
          </h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Join 50,000+ learners already building their future on StudyHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="btn-primary glow-primary px-8 py-3.5 text-base">
                Join for Free
              </button>
            </Link>
            <Link to="/courses">
              <button className="btn-ghost px-8 py-3.5 text-base">
                Browse Courses
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
