import React from "react";
import { features } from "../constants";

const Features = () => {
  return (
    <section className="border-t border-border bg-surface" id="features">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-display font-bold mb-3">
            Why StudyHub?
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Everything you need to learn faster, smarter, and with confidence.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(
            (
              { title, desc, icon: Icon }, // eslint-disable-line
            ) => (
              <div
                key={title}
                className="card hover:border-primary/30 transition-all duration-300 flex flex-col gap-4"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(108,71,255,0.12)",
                    color: "var(--color-primary)",
                  }}
                >
                  <Icon size={28} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default Features;
