// src/components/pages/Reminder.jsx
import React, { useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Reminder() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔥 call your backend API (update URL if needed)
        const res = await axios.get("http://localhost:5000/api/projects");
        const projects = res.data;

        const now = new Date();
        projects.forEach((project) => {
          project.deliverables.forEach((d) => {
            if (!d.deadline) return;

            const deadline = new Date(d.deadline);
            const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

            if (diffDays <= 10 && diffDays >= 0) {
              toast.warning(
                `⏰ Deliverable "${d.key}" in project "${project.projectName}" is due in ${diffDays} day(s) (${deadline.toDateString()})`
              );
            }
          });
        });
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* ✅ This renders toast popup, not a div above pages */}
      <ToastContainer position="top-right" autoClose={6000} newestOnTop />
    </>
  );
}
