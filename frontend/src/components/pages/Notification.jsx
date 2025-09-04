// src/components/NotificationBell.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NotificationBell.css";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://lifproject-management.onrender.com/api/projects/all");
        const projects = res.data;

        const now = new Date();
        let upcoming = [];

        projects.forEach((project) => {
          project.deliverables.forEach((d) => {
            if (!d.deadline) return;
            const deadline = new Date(d.deadline);
            const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

            if (diffDays <= 10 && diffDays >= 0) {
              upcoming.push({
                project: project.projectName,
                deliverable: d.key,
                deadline: deadline.toDateString(),
                daysLeft: diffDays,
              });
            }
          });
        });

        setNotifications(upcoming);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="notification-bell-wrapper">
      {/* 🔔 Bell icon */}
      <button className="bell-btn" onClick={() => setIsOpen(true)}>
        🔔
        {notifications.length > 0 && (
          <span className="badge">{notifications.length}</span>
        )}
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // stop closing on inner click
          >
            <h2>Notifications</h2>
            {notifications.length > 0 ? (
              <ul className="notification-list">
                {notifications.map((n, index) => (
                  <li key={index} className="notification-item">
                    <strong>{n.deliverable}</strong> in <em>{n.project}</em>
                    <br />
                    <span>
                      Due in <b>{n.daysLeft} day(s)</b> ({n.deadline})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-notifications">
                ✅ No upcoming deadlines within 10 days!
              </p>
            )}
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
