import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditProject() {
  const { id } = useParams(); // project _id from route like /edit/:id
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch project by ID
  const fetchProject = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`https://lifproject-management.onrender.com/api/projects/${id}`);
      setFormData(res.data);
    } catch (err) {
      setError("Failed to fetch project.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayChange = (index, key, value) => {
    const updated = [...formData.dayWiseRequirements];
    updated[index][key] = value;
    setFormData((prev) => ({ ...prev, dayWiseRequirements: updated }));
  };

  const handleDeliverableChange = (index, key, value) => {
    const updated = [...formData.deliverables];
    updated[index][key] = value;
    setFormData((prev) => ({ ...prev, deliverables: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.put(`https://lifproject-management.onrender.com/api/projects/${id}`, formData);
      alert("Project updated successfully!");
      navigate("/");
    } catch (err) {
      setError("Failed to update project.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (error) return <div style={{ color: "red", padding: "2rem" }}>{error}</div>;
  if (!formData) return null;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Edit Project: {formData.projectName}</h2>
      <form onSubmit={handleSubmit}>
        <label>Project Name:</label><br />
        <input
          type="text"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
        /><br /><br />

        <label>Project Type:</label><br />
        <input
          type="text"
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
        /><br /><br />

        <label>Invoice Name:</label><br />
        <input
          type="text"
          name="invoiceName"
          value={formData.invoiceName}
          onChange={handleChange}
        /><br /><br />

        <label>Primary Date:</label><br />
        <input
          type="date"
          name="primaryDate"
          value={formData.primaryDate?.slice(0, 10)}
          onChange={handleChange}
        /><br /><br />

        <h3>Day-Wise Requirements</h3>
        {formData.dayWiseRequirements.map((day, index) => (
          <div key={index} style={{ border: "1px solid gray", padding: "1rem", marginBottom: "1rem" }}>
            <label>Date:</label><br />
            <input
              type="date"
              value={day.date?.slice(0, 10)}
              onChange={(e) => handleDayChange(index, "date", e.target.value)}
            /><br />

            <label>Time Shift:</label><br />
            <select
              value={day.timeShift}
              onChange={(e) => handleDayChange(index, "timeShift", e.target.value)}
            >
              <option value="Half Day Morning">Half Day Morning</option>
              <option value="Half Day Evening">Half Day Evening</option>
              <option value="Full Day">Full Day</option>
            </select><br />

            <label>Traditional Photographers:</label>
            <input
              type="number"
              value={day.traditionalPhotographers}
              onChange={(e) => handleDayChange(index, "traditionalPhotographers", e.target.value)}
            /><br />

            <label>Assistant:</label>
            <input
              type="number"
              value={day.assistant}
              onChange={(e) => handleDayChange(index, "assistant", e.target.value)}
            /><br />
          </div>
        ))}

        <h3>Deliverables</h3>
        {formData.deliverables.map((item, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <label>Key:</label>
            <input type="text" value={item.key} readOnly />
            <label>Status:</label>
            <select
              value={item.status}
              onChange={(e) => handleDeliverableChange(index, "status", e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="complete">Complete</option>
            </select>
            <label>Deadline:</label>
            <input
              type="date"
              value={item.deadline?.slice(0, 10)}
              onChange={(e) => handleDeliverableChange(index, "deadline", e.target.value)}
            />
          </div>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Project"}
        </button>
      </form>
    </div>
  );
}

export default EditProject;
