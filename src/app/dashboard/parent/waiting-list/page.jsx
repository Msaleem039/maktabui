"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllWaitListParents } from "@/redux/slices/parentSlices/parentSlice";

export default function ParentsWaitingListPage() {
  const dispatch = useDispatch();
  const { waitlistParents, loading, pagination } = useSelector((state) => state.waitlistParents);
  
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchWaitlistParents();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, currentPage, itemsPerPage, sortBy, sortOrder]);

  const fetchWaitlistParents = () => {
    dispatch(getAllWaitListParents({
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      sortBy,
      sortOrder
    }));
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getChildrenNames = (students) => {
    if (!students || students.length === 0) return "No children";
    return students.map(student => student.studentName).join(", ");
  };

  const generatePageNumbers = () => {
    if (!pagination) return [];
    
    const pages = [];
    const totalPages = pagination.totalPages;
    const current = currentPage;
    
    pages.push(1);
    
    let start = Math.max(2, current - 1);
    let end = Math.min(totalPages - 1, current + 1);
    
    if (start > 2) pages.push('...');
    
    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    
    if (end < totalPages - 1) pages.push('...');
    
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#104D2E]">Parents in Waiting List</h2>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative flex w-full max-w-xl items-center">
            <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
            <input
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search by name, email, phone..."
              className="w-full rounded-full border border-[#C5D2CD] bg-[#F7FAF8] py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
            />
          </label>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="rounded-full border border-[#0B4B31]/30 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
          >
            See All ↗
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 font-normal text-[#0000008C]">Parent Name</th>
                <th className="px-4 font-normal text-[#0000008C]">Email</th>
                <th className="px-4 font-normal text-[#0000008C]">Phone</th>
                <th className="px-4 font-normal text-[#0000008C]">Children</th>
                <th className="px-4 font-normal text-[#0000008C]">Added</th>
                <th className="px-4 font-normal text-right text-[#0000008C]">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#0B4B31] font-medium">
                    Loading...
                  </td>
                </tr>
              ) : !waitlistParents || waitlistParents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#0B4B31] font-medium">
                    No Data Available
                  </td>
                </tr>
              ) : (
                waitlistParents.map((parent) => (
                  <tr
                    key={parent._id}
                    className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                  >
                    <td className="px-4 py-3 font-medium text-[#0B4B31]">
                      {parent.fullName}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {parent.email}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {parent.phone}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {getChildrenNames(parent.students)}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {formatDate(parent.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0B4B31]/90">
                        Take Action
                        <span>▾</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#8A928F]">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} entries
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
              >
                <option value={10}>Display 10</option>
                <option value={20}>Display 20</option>
                <option value={50}>Display 50</option>
              </select>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                
                {generatePageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      page === currentPage
                        ? 'bg-[#0B4B31] text-white'
                        : 'border border-[#C5D2CD] bg-white text-[#0B4B31] hover:bg-[#F3F6F5]'
                    } ${page === '...' ? 'cursor-default hover:bg-white' : ''}`}
                    disabled={page === '...'}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}