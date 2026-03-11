import React from "react";
import { stats } from "../constants";

const Stats = () => {
  return (
    <section className="border-y border-border">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
        {stats.map(({ value, label }) => (
          <div key={label} className="py-10 text-center">
            <div className="text-4xl font-display font-bold text-accent mb-1">
              {value}
            </div>
            <div className="text-sm text-muted">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
