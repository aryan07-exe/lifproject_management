import { useState } from "react";
import axios from "axios";
import {
	Save,
	X,
	FileText,
	PlusCircle,
	Trash2,
	Calendar,
	Camera,
	Video,
	Building2,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/ProjectForm.css";
import Navbar from "./Navbar.jsx";

const deliverableOptions = [
	{ key: "rawPhotos", label: "RAW Photos", icon: Camera, category: "Photo" },
	{ key: "editedPhotos", label: "Edited Photos", icon: Camera, category: "Photo" },
	{ key: "firstSetPhotos", label: "First Set Photos", icon: Camera, category: "Photo" },
	{ key: "digitalAlbum", label: "Digital Album", icon: Camera, category: "Photo" },
	{ key: "standardBook", label: "Standard Book", icon: Camera, category: "Photo" },
	{ key: "premiumBook", label: "Premium Book", icon: Camera, category: "Photo" },
	{ key: "Long Film", label: "Long Film", icon: Video, category: "Video" },
	{ key: "cineFilm", label: "Cine Film", icon: Video, category: "Video" },
	{ key: "highlights", label: "HighLights", icon: Video, category: "Video" },
	{ key: "reel", label: "Reel", icon: Video, category: "Video" },
	{ key: "teaser", label: "Teaser Video", icon: Video, category: "Video" },
];

const defaultDay = {
	date: "",
	timeShift: "",
	traditionalPhotographers: 0,
	traditionalCinematographers: 0,
	candidPhotographers: 0,
	candidcinematographers: 0,
	aerialCinematography: 0,
	additionalCinematographers: 0,
	additionalPhotographers: 0,
	assistant: 0,
	onSiteEditor: 0,
	additionalNotes: "",
};

function ProjectForm() {
	const [form, setForm] = useState({
		projectName: "",
		projectType: "",
		invoiceName: "",
		invoiceNumber: "",
		mobileNumber: "",
		primaryDate: "",
		projectCategory: "",
		dayWiseRequirements: [{ ...defaultDay }],
		deliverables: [],
		reelCount: 0,
		standardBookCount: 0,
		premiumBookCount: 0,
	});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleDayChange = (idx, e) => {
		const days = [...form.dayWiseRequirements];
		days[idx][e.target.name] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
		setForm({ ...form, dayWiseRequirements: days });
	};

	const addDay = () => {
		setForm({ ...form, dayWiseRequirements: [...form.dayWiseRequirements, { ...defaultDay }] });
	};

	const removeDay = (idx) => {
		setForm({ ...form, dayWiseRequirements: form.dayWiseRequirements.filter((_, i) => i !== idx) });
	};

	const handleDeliverableChange = (key) => {
		setForm((prev) => ({
			...prev,
			deliverables: prev.deliverables.includes(key)
				? prev.deliverables.filter((d) => d !== key)
				: [...prev.deliverables, key],
		}));
	};

	const handleQuantityChange = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: Math.max(0, Number(e.target.value)) }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setError("");
		setLoading(true);
		// No required fields; allow submission with any or no data
		try {
			const payload = {
				...form,
				reelCount: form.reelCount || 0,
				standardBookCount: form.standardBookCount || 0,
				premiumBookCount: form.premiumBookCount || 0,
				invoiceNumber: form.invoiceNumber,
				mobileNumber: form.mobileNumber,
			};
			// Use correct backend endpoint for project creation
			const response = await axios.post(" https://lifproject-management.onrender.com/api/projects/", payload, {
				headers: {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				},
			});
			if (response.status === 201 || response.status === 200) {
				setMessage("Project has been created successfully.");
				setForm({
					projectName: "",
					projectType: "",
					invoiceName: "",
					invoiceNumber: "",
					mobileNumber: "",
					primaryDate: "",
					projectCategory: "",
					dayWiseRequirements: [{ ...defaultDay }],
					deliverables: [],
					reelCount: 0,
					standardBookCount: 0,
					premiumBookCount: 0,
				});
				setTimeout(() => {
					setMessage("");
					window.location.reload();
				}, 1200);
			}
		} catch (err) {
			setError(err?.response?.data?.error || "Failed to create project. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const groupedDeliverables = deliverableOptions.reduce((acc, item) => {
		if (!acc[item.category]) acc[item.category] = [];
		acc[item.category].push(item);
		return acc;
	}, {});

	return (
    <>
    <Navbar/>
		<div className="app-container">
			<main className="main-content">
				<div className="content-container">
					<div className="page-header">
						<FileText size={28} className="page-icon" />
						<div className="page-title-section">
							<h2 className="page-title">Create New Project</h2>
							<p className="page-description">Configure project requirements and service specifications</p>
						</div>
					</div>
					<form className="project-form" onSubmit={handleSubmit}>
						{message && (
							<div className="alert alert-success">
								<CheckCircle2 size={20} />
								<span>{message}</span>
							</div>
						)}
						{error && (
							<div className="alert alert-error">
								<AlertCircle size={20} />
								<span>{error}</span>
							</div>
						)}
						<div className="form-section">
							<div className="section-header">
								<Building2 size={20} />
								<h3 className="section-title">Project Information</h3>
							</div>
							<div className="form-grid">
								<div className="form-field">
									<label className="field-label">Project Name <span className="required">*</span></label>
									  <input className="field-input" name="projectName" placeholder="Enter project name" value={form.projectName} onChange={handleChange} />
								</div>
								<div className="form-field">
									<label className="field-label">Project Type <span className="required">*</span></label>
									  <select className="field-input" name="projectType" value={form.projectType} onChange={handleChange}>
										<option value="">Select Project Type</option>
										<option value="Wedding">Wedding</option>
										<option value="Corporate Event">Corporate Event</option>
										<option value="Portrait Session">Portrait Session</option>
									</select>
								</div>
												{form.projectType === "Wedding" && (
													<div className="form-field">
														<label className="field-label">Project Category</label>
														<select className="field-input" name="projectCategory" value={form.projectCategory} onChange={handleChange}>
															<option value="">Select Category</option>
															<option value="Basic Wedding">Basic Wedding</option>
															<option value="Intimate Wedding">Intimate Wedding</option>
															<option value="Signature Wedding">Signature Wedding</option>
															<option value="Premium Wedding">Premium Wedding</option>
															<option value="Small">Small</option>
															<option value="Micro">Micro</option>
															<option value="Others">Others</option>
														</select>
													</div>
												)}
								<div className="form-field">
									<label className="field-label">Invoice Name <span className="required">*</span></label>
									  <input className="field-input" name="invoiceName" placeholder="e.g., Wedding, Corporate Event, Portrait Session" value={form.invoiceName} onChange={handleChange} />
								</div>
								<div className="form-field">
									<label className="field-label">Invoice Number</label>
									<input className="field-input" name="invoiceNumber" placeholder="Enter invoice number" value={form.invoiceNumber} onChange={handleChange} />
								</div>
								<div className="form-field">
									<label className="field-label">Mobile Number</label>
									<input className="field-input" name="mobileNumber" placeholder="Enter mobile number" value={form.mobileNumber} onChange={handleChange} />
								</div>
								<div className="form-field">
									<label className="field-label">Primary Date <span className="required">*</span></label>
									  <input className="field-input" name="primaryDate" type="date" value={form.primaryDate} onChange={handleChange} />
								</div>
							</div>
						</div>
						<div className="form-section">
							<div className="section-header">
								<Calendar size={20} />
								<h3 className="section-title">Daily Requirements</h3>
							</div>
							<div className="days-container">
								{form.dayWiseRequirements.map((day, idx) => (
									<div key={idx} className="day-card">
										<div className="day-card-header">
											<div className="day-info">
												<span className="day-label">Day {idx + 1}</span>
												<input className="field-input date-input" type="date" name="date" value={day.date} onChange={(e) => handleDayChange(idx, e)} />
												<select className="field-input" name="timeShift" value={day.timeShift} onChange={(e) => handleDayChange(idx, e)} style={{ marginLeft: 12 }}>
													<option value="">Select Time Shift</option>
													<option value="Half Day Morning">Half Day Morning</option>
													<option value="Half Day Evening">Half Day Evening</option>
													<option value="Full Day">Full Day</option>
												</select>
											</div>
											{form.dayWiseRequirements.length > 1 && (
												<button type="button" className="remove-btn" onClick={() => removeDay(idx)} title="Remove Day">
													<Trash2 size={16} />
												</button>
											)}
										</div>
										<div className="crew-grid">
											<div className="crew-field">
												<label className="field-label"><Camera size={16} />Traditional Photographers</label>
												<input className="field-input number-input" type="number" name="traditionalPhotographers" value={day.traditionalPhotographers} onChange={(e) => handleDayChange(idx, e)} min="0" />
											</div>
											<div className="crew-field">
												<label className="field-label"><Video size={16} />Traditional Cinematographers</label>
												<input className="field-input number-input" type="number" name="traditionalCinematographers" value={day.traditionalCinematographers} onChange={(e) => handleDayChange(idx, e)} min="0" />
											</div>
											<div className="crew-field">
												<label className="field-label"><Camera size={16} />Candid Photographers</label>
												<input className="field-input number-input" type="number" name="candidPhotographers" value={day.candidPhotographers} onChange={(e) => handleDayChange(idx, e)} min="0" />
											</div>
											<div className="crew-field">
												<label className="field-label"><Video size={16} />Candid Cinematographers</label>
												<input className="field-input number-input" type="number" name="candidcinematographers" value={day.candidcinematographers} onChange={(e) => handleDayChange(idx, e)} min="0" />
											</div>
											<div className="crew-field">
												<label className="field-label"><Video size={16} />Additional Cinematographers</label>
												<input className="field-input number-input" type="number" name="additionalCinematographers" value={day.additionalCinematographers} onChange={(e) => handleDayChange(idx, e)} min="0" />
											</div>
											<div className="crew-field">
												<label className="field-label"><Video size={16} />Additional Photographers</label>
												<input className="field-input number-input" type="number" name="additionalPhotographers" value={day.additionalPhotographers} onChange={(e) => handleDayChange(idx, e)} min="0" />
											</div>
											<div className="crew-field">
												<label className="field-label"><Video size={16} />OnSite Editor</label>
												<input className="field-input number-input" type="number" name="onSiteEditor" value={day.onSiteEditor} onChange={(e) => handleDayChange(idx, e)} min="0" />
											</div>
											<div className="crew-field">
												<label className="field-label"><Video size={16} />Assistant</label>
												<input className="field-input number-input" type="number" name="assistant" value={day.assistant} onChange={(e) => handleDayChange(idx, e)} min="0" />
											</div>
											<div className="crew-field">
												<label className="field-label"><Video size={16} />Aerial Cinematography</label>
												<input className="field-input number-input" type="number" name="aerialCinematography" value={day.aerialCinematography} onChange={(e) => handleDayChange(idx, e)} min="0" />
											</div>
										</div>
										<div className="form-field">
											<label className="field-label">Additional Requirements</label>
											<textarea className="field-textarea" name="additionalNotes" placeholder="Specify any special requirements, timing preferences, or equipment needs..." value={day.additionalNotes} onChange={(e) => handleDayChange(idx, e)} rows="3" />
										</div>
									</div>
								))}
								<button type="button" className="add-day-btn" onClick={addDay}>
									<PlusCircle size={18} /> Add Additional Day
								</button>
							</div>
						</div>
						<div className="form-section">
							<div className="section-header">
								<FileText size={20} />
								<h3 className="section-title">Service Deliverables</h3>
							</div>
							<div className="deliverables-container">
								{Object.entries(groupedDeliverables).map(([category, items]) => (
									<div key={category} className="deliverable-category">
										<h4 className="category-title">{category}</h4>
										<div className="deliverable-grid">
											{items.map((opt) => {
												const IconComponent = opt.icon;
												const isSelected = form.deliverables.includes(opt.key);
												if (["reel", "standardBook", "premiumBook"].includes(opt.key)) {
													let countKey = opt.key === "reel" ? "reelCount" : opt.key === "standardBook" ? "standardBookCount" : "premiumBookCount";
													return (
														<div key={opt.key} className="deliverable-card">
															<label style={{display:'flex',alignItems:'center',gap:8}}>
																<input type="checkbox" checked={isSelected} onChange={() => handleDeliverableChange(opt.key)} />
																<span style={{fontWeight:600}}>{opt.label}</span>
															</label>
															<div className="card-content">
																<div className="card-header">
																	<IconComponent size={20} />
																	<div className="card-check"><CheckCircle2 size={16} /></div>
																</div>
																<h5 className="card-title">{opt.label}</h5>
																<div style={{marginTop:8}}>
																	<label style={{fontWeight:500,color:'#6c0428'}}>Quantity:</label>
																	<input type="number" name={countKey} min={0} value={form[countKey]} onChange={handleQuantityChange} style={{width:60,padding:'4px 8px',marginLeft:8,border:'1px solid #e2e8f0',borderRadius:5}} />
																</div>
															</div>
														</div>
													);
												}
												return (
													<label key={opt.key} className={`deliverable-card ${isSelected ? "selected" : ""}`}>
														<input type="checkbox" checked={isSelected} onChange={() => handleDeliverableChange(opt.key)} />
														<div className="card-content">
															<div className="card-header">
																<IconComponent size={20} />
																<div className="card-check"><CheckCircle2 size={16} /></div>
															</div>
															<h5 className="card-title">{opt.label}</h5>
														</div>
													</label>
												);
											})}
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="form-actions">
							<button type="submit" className="btn btn-primary" disabled={loading}>
								<Save size={18} /> {loading ? "Creating Project..." : "Create Project"}
							</button>
							<button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>
								<X size={18} /> Cancel
							</button>
						</div>
					</form>
				</div>
			</main>
		</div></>
	);
}

export default ProjectForm;
