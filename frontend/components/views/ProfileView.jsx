"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/roles";
import { useProfile } from "@/hooks/useData";
import { put } from "@/lib/api";
import { toast } from "react-toastify";

function StatusBadge({ status }) {
  const styles = {
    Verified: "bg-success-100 text-success-700",
    Pending: "bg-warning-100 text-amber-700",
    Rejected: "bg-danger-100 text-red-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}

const DOC_TYPE_MAP = {
  pan: "PAN Card",
  aadhaar: "Aadhaar Card",
  addressProof: "Address Proof",
  photo: "Passport Photo",
};

export default function ProfileView() {
  const { user, isMember, logout } = useAuth();
  const { data: profile, refetch } = useProfile();
  const member = isMember ? profile?.member : null;
  const roleColor = ROLE_COLORS[user?.role] || ROLE_COLORS.member;
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null); // stores docType being uploaded
  const [uploadingGeneral, setUploadingGeneral] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || user?.name || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || member?.phone || "",
        address: member?.address || "",
      });
    }
  }, [profile, member, user]);

  // Build KYC documents from API data
  const kycDocuments = member?.kycDocuments
    ? Object.entries(DOC_TYPE_MAP).map(([key, label]) => {
        const doc = member.kycDocuments[key];
        return {
          id: key,
          type: label,
          docKey: key,
          status: doc?.verified ? "Verified" : "Pending",
          uploadedDate: doc?.verified ? doc.date : null,
        };
      })
    : Object.entries(DOC_TYPE_MAP).map(([key, label]) => ({
        id: key,
        type: label,
        docKey: key,
        status: "Pending",
        uploadedDate: null,
      }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await put("/profile", {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      toast.success("Profile updated successfully!");
      setEditing(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDocUpload = async (file, documentType) => {
    if (!file) return;

    // Validate file type
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "jpg", "jpeg", "png"].includes(ext)) {
      toast.error("Only PDF, JPG, and PNG files are allowed");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(documentType);
    try {
      const formPayload = new FormData();
      formPayload.append("file", file);
      formPayload.append("document_type", documentType);

      const token = localStorage.getItem("glimmora_token");
      const res = await fetch("/api/v1/profile/kyc-upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Upload failed");

      toast.success(`${DOC_TYPE_MAP[documentType]} uploaded successfully!`);

      // Add to upload history
      setUploadHistory((prev) => [
        {
          id: Date.now(),
          name: file.name,
          type: DOC_TYPE_MAP[documentType],
          date: data.data?.uploadedDate || new Date().toLocaleDateString("en-IN"),
          size: data.data?.size || `${(file.size / 1024).toFixed(0)} KB`,
          status: "Verified",
        },
        ...prev,
      ]);

      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to upload document");
    } finally {
      setUploading(null);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // If no specific docType selected, prompt which type
      handleDocUpload(file, pendingDocType || "pan");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const [pendingDocType, setPendingDocType] = useState(null);

  const handleDocButtonClick = (docKey) => {
    setPendingDocType(docKey);
    fileInputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Find first pending document type
      const firstPending = kycDocuments.find((d) => d.status === "Pending");
      const docType = firstPending?.docKey || "pan";
      handleDocUpload(file, docType);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const initials = (user?.name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-success to-teal-500 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white flex items-center justify-center text-2xl font-bold text-success shadow-lg">
              {initials}
            </div>
          </div>
        </div>
        <div className="pt-14 px-6 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{profile?.name || user?.name}</h2>
              <p className="text-sm text-slate-500">{profile?.email || user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${roleColor.bg} ${roleColor.text}`}>
                  {ROLE_LABELS[user?.role]}
                </span>
                {isMember && member && (
                  <>
                    <span className="text-xs text-heading font-mono">{member.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${member.kyc === "Verified" ? "bg-success-100 text-success-700" : "bg-warning-100 text-amber-700"}`}>
                      KYC: {member.kyc}
                    </span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={saving}
              className="px-4 py-2 bg-success hover:bg-success-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? "Saving..." : editing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-sm font-semibold text-body mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-heading uppercase tracking-wider mb-1.5">Full Name</label>
            {editing ? (
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-success-500/50" />
            ) : (
              <p className="text-sm text-body font-medium">{formData.name}</p>
            )}
          </div>
          <div>
            <label className="block text-[10px] text-heading uppercase tracking-wider mb-1.5">Email</label>
            <p className="text-sm text-body font-medium">{formData.email}</p>
          </div>
          <div>
            <label className="block text-[10px] text-heading uppercase tracking-wider mb-1.5">Phone</label>
            {editing ? (
              <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-success-500/50" />
            ) : (
              <p className="text-sm text-body font-medium">{formData.phone || "—"}</p>
            )}
          </div>
          {isMember && (
            <div>
              <label className="block text-[10px] text-heading uppercase tracking-wider mb-1.5">Address</label>
              {editing ? (
                <input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-success-500/50" />
              ) : (
                <p className="text-sm text-body font-medium">{formData.address || "—"}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Member Stats (if member) */}
      {isMember && member && (
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-sm font-semibold text-body mb-4">Account Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-heading uppercase tracking-wider">Total Deposits</p>
              <p className="text-lg font-bold text-success font-mono">{member.deposits}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-heading uppercase tracking-wider">Active Loans</p>
              <p className="text-lg font-bold text-blue-600 font-mono">{member.loans}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-heading uppercase tracking-wider">Trust Score (STI)</p>
              <p className={`text-lg font-bold ${member.sti >= 80 ? "text-success" : member.sti >= 60 ? "text-warning" : "text-danger-500"}`}>{member.sti}/100</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-heading uppercase tracking-wider">Member Since</p>
              <p className="text-sm font-bold text-body">{member.joinDate}</p>
            </div>
          </div>
        </div>
      )}

      {/* KYC Documents (if member) */}
      {isMember && (
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-sm font-semibold text-body mb-4">KYC Documents</h3>

          {/* Document Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {kycDocuments.map((doc) => (
              <div key={doc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-body">{doc.type}</p>
                  <StatusBadge status={doc.status} />
                </div>
                <p className="text-[10px] text-heading uppercase tracking-wider">
                  {doc.uploadedDate ? `Uploaded: ${doc.uploadedDate}` : "Not uploaded"}
                </p>
                <button
                  onClick={() => handleDocButtonClick(doc.docKey)}
                  disabled={uploading === doc.docKey}
                  className="mt-1 w-full py-2 bg-primary-50 border border-primary-200 text-primary rounded-xl text-[13px] font-semibold hover:bg-primary-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploading === doc.docKey ? "Uploading..." : doc.status === "Verified" ? "Re-upload" : "Upload"}
                </button>
              </div>
            ))}
          </div>

          {/* Upload Area */}
          <div
            onClick={() => {
              const firstPending = kycDocuments.find((d) => d.status === "Pending");
              setPendingDocType(firstPending?.docKey || "pan");
              fileInputRef.current?.click();
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mb-6 flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors"
          >
            <svg className="w-10 h-10 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <p className="text-sm font-medium text-body">
              {uploadingGeneral ? "Uploading..." : "Drag & drop files here or click to browse"}
            </p>
            <p className="text-[10px] text-heading uppercase tracking-wider">
              Supported formats: PDF, JPG, PNG (Max 5MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>

          {/* Upload History */}
          {uploadHistory.length > 0 && (
            <div>
              <h4 className="text-[10px] text-heading uppercase tracking-wider mb-3">Recent Uploads</h4>
              <div className="space-y-2">
                {uploadHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-body truncate">{item.name}</p>
                        <p className="text-[10px] text-heading uppercase tracking-wider">{item.type} &middot; {item.date} &middot; {item.size}</p>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-sm font-semibold text-body mb-4">Security</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-lg">🔒</span>
              <div className="text-left">
                <p className="text-sm font-medium text-body">Change Password</p>
                <p className="text-xs text-heading">Update your account password</p>
              </div>
            </div>
            <span className="text-heading">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-lg">📱</span>
              <div className="text-left">
                <p className="text-sm font-medium text-body">Two-Factor Authentication</p>
                <p className="text-xs text-heading">Add an extra layer of security</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-warning-100 text-amber-700 text-xs rounded-lg font-medium">Not Set</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-between p-3 bg-danger-50 rounded-xl hover:bg-danger-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🚪</span>
              <p className="text-sm font-medium text-danger">Sign Out</p>
            </div>
            <span className="text-danger-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
