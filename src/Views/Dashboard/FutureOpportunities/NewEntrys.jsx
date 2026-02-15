import { CalendarDays } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { request } from "../../../services/axios";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const tabs = [
    { name: "Strategic Partnership", color: "#67E8F9" },
    { name: "Influencer Results", color: "#93C5FD" },
    { name: "New Geos", color: "#C4B5FD" },
    { name: "Future Technologies", color: "#F0ABFC" },
    { name: "Missed Revenue Potential", color: "#FDA4AF" },
    { name: "AI Integration", color: "#FDBA74" },
    { name: "New Branding Channels", color: "#BEF264" },
    { name: "Misc. 1", color: "#FDE047" },
    { name: "Misc. 2", color: "#F9A8D4" },
];

const NewEntrys = ({ onSuccess, editMode = false, opportunityId = null, initialData = null }) => {
    const token = useSelector((state) => state.admin.token);
    const [activeTab, setActiveTab] = useState("Strategic Partnership");
    const [loading, setLoading] = useState(false);
    
    // Form States
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        reminder: "",
        description: "",
        poc: "",
        misc: ""
    });
    
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    
    const fileInputRef = useRef(null);
    const dateRef = useRef(null);
    const reminderRef = useRef(null);

    // ✅ Load initial data when in edit mode
    useEffect(() => {
        if (editMode && initialData) {
            setActiveTab(initialData.category || "Strategic Partnership");
            
            // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
            const formatDateForInput = (dateString) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                return date.toISOString().slice(0, 16);
            };

            setFormData({
                title: initialData.title || "",
                date: formatDateForInput(initialData.createdAt),
                reminder: formatDateForInput(initialData.reminderDate),
                description: initialData.description || "",
                poc: initialData.pocs?.join(", ") || "",
                misc: initialData.misc?.ideas?.join(", ") || ""
            });

            // If there are existing files, show the first one
            if (initialData.files && initialData.files.length > 0) {
                setFileName(initialData.files[0].split('/').pop() || "Existing file");
            }
        }
    }, [editMode, initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error("File size should be less than 5MB");
                return;
            }
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.title || !formData.description) {
            toast.error("Title and Description are required");
            return;
        }

        setLoading(true);

        try {
            // ✅ Prepare payload
            const payload = {
                category: activeTab,
                title: formData.title,
                description: formData.description,
                reminderDate: formData.reminder || null,
                pocs: formData.poc ? formData.poc.split(",").map(p => p.trim()) : [],
                misc: {
                    ideas: formData.misc ? formData.misc.split(",").map(m => m.trim()) : []
                }
            };

            // ✅ If editing, use PUT/PATCH request
            if (editMode && opportunityId) {
                await request({
                    method: "put", // or "patch" depending on your API
                    url: `dashboard/future-opportunities/${opportunityId}`,
                    data: payload,
                }, false, token);

                toast.success("Entry updated successfully!");
            } 
            // ✅ If creating new, use POST request
            else {
                await request({
                    method: "post",
                    url: "dashboard/future-opportunities",
                    data: payload,
                }, false, token);

                toast.success("Entry added successfully!");
            }

            // Reset Form (only if not in edit mode)
            if (!editMode) {
                setFormData({ 
                    title: "", 
                    date: "", 
                    reminder: "", 
                    description: "", 
                    poc: "", 
                    misc: "" 
                });
                setFileName("");
                setFile(null);
            }
            
            if (onSuccess) onSuccess();
            
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || `Failed to ${editMode ? 'update' : 'add'} entry`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-12 gap-4 text-white">
            {/* Left Side (Form Section) */}
            <div className="col-span-8 bg-black rounded-xl border border-[#87888C]" style={{ padding: "24px 44px", zIndex: 20, fontFamily: 'Montserrat, sans-serif' }}>
                
                <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    backgroundColor: tabs.find((t) => t.name === activeTab)?.color, 
                    color: "black", 
                    fontWeight: "bold", 
                    padding: "10px 20px", 
                    borderRadius: "5px", 
                    marginBottom: "20px", 
                    width: "100%" 
                }}>
                    {activeTab}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                    {/* Title */}
                    <div>
                        <label style={{ display: "block", marginBottom: "5px" }}>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Project 1"
                            maxLength={60}
                            style={{ 
                                width: "100%", 
                                padding: "12px 10px", 
                                borderRadius: "6px", 
                                border: "1px solid #444", 
                                color: "white", 
                                backgroundColor: "transparent" 
                            }}
                        />
                        <small style={{ fontSize: "12px", color: "#aaa" }}>
                            {formData.title.length}/60 characters
                        </small>
                    </div>

                    {/* Date (Read-only in edit mode) */}
                    <div style={{ position: "relative" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>Date Created</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            ref={dateRef}
                            disabled={editMode} // ✅ Can't change creation date
                            style={{ 
                                width: "100%", 
                                padding: "12px 40px 12px 10px", 
                                borderRadius: "6px", 
                                border: "1px solid #444", 
                                color: "white", 
                                backgroundColor: editMode ? "#1a1a1a" : "transparent",
                                outline: "none",
                                cursor: editMode ? "not-allowed" : "text"
                            }}
                        />
                        {!editMode && (
                            <CalendarDays 
                                onClick={() => dateRef.current.showPicker()} 
                                size={20} 
                                className="absolute right-3 top-10 cursor-pointer" 
                            />
                        )}
                    </div>

                    {/* Reminder */}
                    <div style={{ position: "relative" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>Set Reminder</label>
                        <input
                            type="datetime-local"
                            name="reminder"
                            value={formData.reminder}
                            onChange={handleInputChange}
                            ref={reminderRef}
                            style={{ 
                                width: "100%", 
                                padding: "12px 40px 12px 10px", 
                                borderRadius: "6px", 
                                border: "1px solid #444", 
                                color: "white", 
                                backgroundColor: "transparent", 
                                outline: "none" 
                            }}
                        />
                        <CalendarDays 
                            onClick={() => reminderRef.current.showPicker()} 
                            size={20} 
                            className="absolute right-3 top-10 cursor-pointer" 
                        />
                    </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter project details..."
                        rows="4"
                        maxLength={500}
                        style={{ 
                            width: "100%", 
                            padding: "8px", 
                            borderRadius: "6px", 
                            border: "1px solid #444", 
                            color: "white", 
                            backgroundColor: "transparent" 
                        }}
                    ></textarea>
                    <small style={{ display: "block", fontSize: "12px", color: "#aaa" }}>
                        {formData.description.length}/500 characters
                    </small>
                </div>

                {/* File Upload */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Attach a file (optional)
                    </label>
                    <div 
                        onClick={() => fileInputRef.current.click()} 
                        style={{ 
                            width: "100%", 
                            padding: "20px", 
                            borderRadius: "6px", 
                            border: "1px dashed #444", 
                            backgroundColor: "#222", 
                            textAlign: "center", 
                            cursor: "pointer", 
                            color: "white" 
                        }}
                    >
                        <FaPlus className="mx-auto mb-2" /> 
                        {fileName || "Choose a file or drag and drop here"}
                        <br />
                        <span style={{ fontSize: "12px" }}>Size limit: 5 MB</span>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: "none" }} 
                        onChange={handleFileChange} 
                    />
                </div>

                {/* PoCs */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        PoCs (comma separated)
                    </label>
                    <input
                        type="text"
                        name="poc"
                        value={formData.poc}
                        onChange={handleInputChange}
                        placeholder="john@example.com, jane@example.com"
                        style={{ 
                            width: "100%", 
                            padding: "8px", 
                            borderRadius: "6px", 
                            border: "1px solid #444", 
                            color: "white", 
                            backgroundColor: "transparent" 
                        }}
                    />
                </div>

                {/* Misc */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Misc. Ideas (comma separated)
                    </label>
                    <input
                        type="text"
                        name="misc"
                        value={formData.misc}
                        onChange={handleInputChange}
                        placeholder="Idea 1, Idea 2, Idea 3"
                        style={{ 
                            width: "100%", 
                            padding: "8px", 
                            borderRadius: "6px", 
                            border: "1px solid #444", 
                            color: "white", 
                            backgroundColor: "transparent" 
                        }}
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{ 
                            backgroundColor: loading ? "#555" : "#15803D", 
                            padding: "10px 40px", 
                            borderRadius: "7px", 
                            color: "white", 
                            fontWeight: "bold", 
                            marginTop: "10px", 
                            cursor: loading ? "not-allowed" : "pointer" 
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            editMode ? "Update Entry" : "Add Entry"
                        )}
                    </button>
                </div>
            </div>

            {/* Right Side Tabs */}
            <div className="col-span-4 flex flex-col gap-4">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(tab.name)}
                        style={{
                            padding: "15px", 
                            marginTop: "20px", 
                            width: "100%", 
                            position: "relative", 
                            left: -30, 
                            textAlign: "right", 
                            fontWeight: "bold", 
                            borderRadius: "6px", 
                            fontSize: "16px",
                            backgroundColor: tab.color, 
                            color: "black", 
                            opacity: activeTab === tab.name ? 1 : 0.6,
                            border: activeTab === tab.name ? "2px solid white" : "none",
                            zIndex: activeTab === tab.name ? 30 : 1
                        }}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NewEntrys;