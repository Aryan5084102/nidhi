"use client";

import { useState, useEffect } from "react";
import { useMembers } from "@/hooks/useData";
import { post, put } from "@/lib/api";
import MembersToolbar from "./MembersToolbar";
import MemberCardList from "./MemberCardList";
import MembersTable from "./MembersTable";
import MobilePagination from "./MobilePagination";
import AddMemberModal from "./AddMemberModal";
import ViewMemberModal from "./ViewMemberModal";
import EditMemberModal from "./EditMemberModal";

const ITEMS_PER_PAGE = 6;

export default function MembersView() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMember, setViewMember] = useState(null);
  const [editMember, setEditMember] = useState(null);

  // Fetch members from API
  const { data: members = [], loading: membersLoading, refetch } = useMembers();

  // Local members state — synced from API data
  const [localMembers, setLocalMembers] = useState([]);

  useEffect(() => {
    setLocalMembers(members);
  }, [members]);

  const filtered = localMembers.filter(
    (m) =>
      (filter === "All" || m.risk === filter) &&
      m.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMembers = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when search/filter changes
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handleFilter = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleAddMember = async (form) => {
    try {
      await post("/members", {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        risk: form.risk,
        kyc: form.kyc,
        nomineeName: form.nomineeName || null,
        nomineeRelation: form.nomineeRelation || null,
        nomineeAadhaar: form.nomineeAadhaar || null,
        nomineePan: form.nomineePan || null,
      });
      await refetch();
    } catch (err) {
      console.error("Failed to add member:", err.message);
    }
    setShowAddModal(false);
    setCurrentPage(1);
  };

  const handleEditSave = async (form) => {
    try {
      await put(`/members/${editMember.id}`, {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        risk: form.risk,
        kyc: form.kyc,
        nomineeName: form.nomineeName || null,
        nomineeRelation: form.nomineeRelation || null,
        nomineeAadhaar: form.nomineeAadhaar || null,
        nomineePan: form.nomineePan || null,
      });
      await refetch();
    } catch (err) {
      console.error("Failed to update member:", err.message);
    }
    setEditMember(null);
  };

  return (
    <div className="animate-fade-in">
      <MembersToolbar
        search={search}
        onSearch={handleSearch}
        filter={filter}
        onFilter={handleFilter}
        onAddMember={() => setShowAddModal(true)}
      />

      <MemberCardList
        members={paginatedMembers}
        onView={setViewMember}
        onEdit={setEditMember}
      />

      <MembersTable
        members={paginatedMembers}
        onView={setViewMember}
        onEdit={setEditMember}
        startIndex={startIndex}
        totalFiltered={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <MobilePagination
        startIndex={startIndex}
        itemsPerPage={ITEMS_PER_PAGE}
        totalFiltered={filtered.length}
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modals */}
      {showAddModal && (
        <AddMemberModal onClose={() => setShowAddModal(false)} onSave={handleAddMember} />
      )}
      {viewMember && (
        <ViewMemberModal member={viewMember} onClose={() => setViewMember(null)} />
      )}
      {editMember && (
        <EditMemberModal
          member={editMember}
          onClose={() => setEditMember(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}
