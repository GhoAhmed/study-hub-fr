import React from "react";
import { categories } from "../constants";
import { Link } from "react-router-dom";

const categoryStyles = [
  { bg: "rgba(108,71,255,0.12)", color: "var(--color-primary)" },
  { bg: "rgba(0,229,176,0.12)", color: "var(--color-accent)" },
  { bg: "rgba(255,107,107,0.12)", color: "var(--color-danger)" },
  { bg: "rgba(251,191,36,0.12)", color: "#fbbf24" },
  { bg: "rgba(56,189,248,0.12)", color: "#38bdf8" },
  { bg: "rgba(167,139,250,0.12)", color: "#a78bfa" },
];

const Categories = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-bold mb-3">
          Browse by Category
        </h2>
        <p className="text-muted">
          Find the perfect course in your field of interest
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(({ name, icon: Icon }, index) => {
          // eslint-disable-line
          const style = categoryStyles[index % categoryStyles.length];
          return (
            <Link
              key={name}
              to={`/courses?category=${encodeURIComponent(name)}`}
            >
              <div
                className="card p-6 text-center cursor-pointer hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-4 group"
                style={{ "--hover-border": style.color }}
              >
                {/* Icon container */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: style.bg }}
                >
                  <Icon size={28} style={{ color: style.color }} />
                </div>

                <span className="text-xs font-semibold leading-tight text-muted group-hover:text-text transition-colors">
                  {name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
