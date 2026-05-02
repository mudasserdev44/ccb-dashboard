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
    const [filePreviewUrl, setFilePreviewUrl] = useState(""); // ✅ NEW: for image preview
    const [existingFileUrl, setExistingFileUrl] = useState(""); // ✅ NEW: for edit mode existing file

    const fileInputRef = useRef(null);
    const dateRef = useRef(null);
    const reminderRef = useRef(null);

    // ✅ Cleanup object URL on unmount to avoid memory leaks
    useEffect(() => {
        return () => {
            if (filePreviewUrl && filePreviewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(filePreviewUrl);
            }
        };
    }, [filePreviewUrl]);

    // ✅ Load initial data when in edit mode
    useEffect(() => {
        if (editMode && initialData) {
            setActiveTab(initialData.category || "Strategic Partnership");

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

            // ✅ Store existing file URL for preview
            if (initialData.files && initialData.files.length > 0) {
                const existingPath = initialData.files[0];
                setFileName(existingPath.split('/').pop() || "Existing file");
                setExistingFileUrl(existingPath); // store for preview
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

            // ✅ Revoke previous blob URL before creating new one
            if (filePreviewUrl && filePreviewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(filePreviewUrl);
            }

            setFile(selectedFile);
            setFileName(selectedFile.name);

            // ✅ Create preview URL only for image files
            if (selectedFile.type.startsWith("image/")) {
                const previewUrl = URL.createObjectURL(selectedFile);
                setFilePreviewUrl(previewUrl);
            } else {
                setFilePreviewUrl(""); // not an image, no preview
            }

            // ✅ Clear existing file preview when new file is selected
            setExistingFileUrl("");
        }
    };

    // ✅ Helper: check if a URL/path is an image
    const isImageFile = (filePath) => {
        if (!filePath) return false;
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];
        const lowerPath = filePath.toLowerCase();
        return imageExtensions.some(ext => lowerPath.endsWith(ext));
    };

    const handleRemoveFile = () => {
        if (filePreviewUrl && filePreviewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(filePreviewUrl);
        }
        setFile(null);
        setFileName("");
        setFilePreviewUrl("");
        setExistingFileUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.description) {
            toast.error("Title and Description are required");
            return;
        }

        setLoading(true);

        try {
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

            if (editMode && opportunityId) {
                await request({
                    method: "put",
                    url: `dashboard/future-opportunities/${opportunityId}`,
                    data: payload,
                }, false, token);

                toast.success("Entry updated successfully!");
            } else {
                await request({
                    method: "post",
                    url: "dashboard/future-opportunities",
                    data: payload,
                }, false, token);

                toast.success("Entry added successfully!");
            }

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
                setFilePreviewUrl("");
                setExistingFileUrl("");
            }

            if (onSuccess) onSuccess();

        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || `Failed to ${editMode ? 'update' : 'add'} entry`);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Determine what to show in the preview area
    const previewImageUrl = filePreviewUrl || (isImageFile(existingFileUrl) ? existingFileUrl : "");
    const hasNonImageFile = fileName && !previewImageUrl;

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

                    {/* Date */}
                    <div style={{ position: "relative" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>Date Created</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            ref={dateRef}
                            disabled={editMode}
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

                    {/* ✅ Show image preview if available */}
                    {previewImageUrl && (
                        <div style={{ marginBottom: "10px", position: "relative", display: "inline-block" }}>
                            <img
                                src={previewImageUrl}
                                alt="File preview"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "200px",
                                    borderRadius: "8px",
                                    border: "1px solid #444",
                                    objectFit: "contain",
                                    display: "block"
                                }}
                            />
                            {/* ✅ Remove button on top of image */}
                            <button
                                onClick={handleRemoveFile}
                                style={{
                                    position: "absolute",
                                    top: "6px",
                                    right: "6px",
                                    backgroundColor: "rgba(0,0,0,0.7)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "24px",
                                    height: "24px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    lineHeight: 1
                                }}
                                title="Remove file"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* ✅ Show non-image file name badge */}
                    {hasNonImageFile && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "10px",
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #444",
                            borderRadius: "6px",
                            padding: "8px 12px"
                        }}>
                            <span style={{ fontSize: "20px" }}>📄</span>
                            <span style={{ fontSize: "13px", color: "#ccc", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {fileName}
                            </span>
                            <button
                                onClick={handleRemoveFile}
                                style={{
                                    backgroundColor: "transparent",
                                    color: "#aaa",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    lineHeight: 1,
                                    padding: "0 4px"
                                }}
                                title="Remove file"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* ✅ Upload area — hide when file already selected */}
                    {!fileName && (
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
                            Choose a file or drag and drop here
                            <br />
                            <span style={{ fontSize: "12px" }}>Size limit: 5 MB</span>
                        </div>
                    )}

                    {/* ✅ "Change file" link when a file is already selected */}
                    {fileName && (
                        <button
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#aaa",
                                fontSize: "12px",
                                cursor: "pointer",
                                marginTop: "4px",
                                textDecoration: "underline",
                                padding: 0
                            }}
                        >
                            Change file
                        </button>
                    )}

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