import axios from "axios";
import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/courses?limit=6")
      .then((r) => setCourses(r.data.courses || []))
      .catch(() => {});
  }, []);

  return (
    <section id="instructors" className="max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-4xl font-display font-bold mb-2">
            Featured Courses
          </h2>
          <p className="text-muted">
            Hand-picked by our team for quality and impact
          </p>
        </div>
        <Link
          to="/courses"
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
        >
          View all <MdArrowForward size={16} />
        </Link>
      </div>

      {courses.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted">
          No courses available yet.
        </div>
      )}
    </section>
  );
};

export default FeaturedCourses;
