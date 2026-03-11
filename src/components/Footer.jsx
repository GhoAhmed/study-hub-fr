import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xl font-display font-bold text-accent">
          StudyHub
        </span>
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} StudyHub. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-muted">
          <a href="#" className="hover:text-text transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-text transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-text transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
