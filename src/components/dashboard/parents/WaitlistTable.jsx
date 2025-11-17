"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Download, ToggleLeft, ToggleRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getAllWaitListParents, 
  resetWaitListParentsState 
} from "@/redux/slices/getWaitListParentSlice";
import { removeFromWaitList, resetRemoveWaitList } from "@/redux/slices/removeFromWaitList";
import { addToWaitList, resetAddWaitList } from "@/redux/slices/addToWaitlistSlice";

const WaitlistTable = ({
  title = "Waitlist Parents",
  onSearchChange,
  searchValue = "",
  parents = [],
}) => {
  const dispatch = useDispatch();
  
  // Selectors for all slices
  const { parents: waitlistParents, status, error } = useSelector((state) => state.waitlistParents);
  const { 
    loading: removeLoading, 
    error: removeError,
    success: removeSuccess 
  } = useSelector((state) => state.removeFromWaitList);
  
  const {
    loading: addLoading,
    error: addError,
    success: addSuccess
  } = useSelector((state) => state.addToWaitList);

  const [selectedId, setSelectedId] = useState(null);
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [updatingParents, setUpdatingParents] = useState(new Set());

  useEffect(() => {
    dispatch(getAllWaitListParents());

    return () => {
      dispatch(resetWaitListParentsState());
      dispatch(resetRemoveWaitList());
      dispatch(resetAddWaitList());
    };
  }, [dispatch]);

  // Reset and refetch when any waitlist operation is successful
  useEffect(() => {
    if (removeSuccess || addSuccess) {
      dispatch(getAllWaitListParents());
      if (removeSuccess) dispatch(resetRemoveWaitList());
      if (addSuccess) dispatch(resetAddWaitList());
    }
  }, [removeSuccess, addSuccess, dispatch]);

  useEffect(() => {
    if (removeError) {
      dispatch(resetRemoveWaitList());
    }
    if (addError) {
      dispatch(resetAddWaitList());
    }
  }, [removeError, addError, dispatch]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setLocalSearch(value);
    onSearchChange?.(value);
  };

  const handleRowSelect = (parentId) => {
    setSelectedId(parentId);
  };

  const handleToggleWaitlist = async (parentId, parentData, currentStatus) => {
    try {
      setUpdatingParents(prev => new Set(prev).add(parentId));

      if (currentStatus) {
        // Remove from waitlist
        await dispatch(removeFromWaitList(parentId)).unwrap();
      } else {
        // Add to waitlist using Redux
        await dispatch(addToWaitList(parentId)).unwrap();
      }
    } catch (error) {
      console.error("Error updating waitlist status:", error);
      // Error handling is done through the Redux state and useEffect above
    } finally {
      setUpdatingParents(prev => {
        const newSet = new Set(prev);
        newSet.delete(parentId);
        return newSet;
      });
    }
  };

  const filteredParents = useMemo(() => {
    if (!waitlistParents || waitlistParents.length === 0) return [];

    const waitlistOnly = waitlistParents.filter(parent => parent.addToWaitList === true);

    if (!localSearch) return waitlistOnly;

    const searchTerm = localSearch.toLowerCase();
    return waitlistOnly.filter(parent =>
      parent.fullName?.toLowerCase().includes(searchTerm) ||
      parent.email?.toLowerCase().includes(searchTerm) ||
      parent.phone?.toLowerCase().includes(searchTerm) ||
      parent.identityNumber?.toLowerCase().includes(searchTerm)
    );
  }, [waitlistParents, localSearch]);

  const tableData = useMemo(() => {
    if (filteredParents.length > 0) {
      return filteredParents.map(parent => ({
        id: parent._id,
        name: parent.fullName,
        address: parent.address,
        phone: parent.phone,
        spouse: parent.spouse || "-",
        children: parent.students ? parent.students.length : 0,
        email: parent.email,
        identityNumber: parent.identityNumber,
        addToWaitList: parent.addToWaitList,
        originalData: parent
      }));
    }

    if (parents.length > 0) return parents;

    return [];
  }, [filteredParents, parents]);

  return (
    <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[#0B4B31]">{title}</h2>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-normal text-white transition hover:bg-[#0B4B31]/90"
          >
            <Download size={15} />
            Export Data
          </button>

          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm font-normal bg-[#0B4B3138] text-[#0B4B31] transition hover:bg-[#F3F6F5]"
          >
            See All ↗
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex w-full max-w-xl items-center">
          <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
          <input
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search waitlist parents by name, email, or phone..."
            className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
          />
        </label>

        {status === "loading" && (
          <div className="text-sm text-[#0B4B31]">Loading waitlist parents...</div>
        )}

        {status === "failed" && (
          <div className="text-sm text-red-600">Error: {error}</div>
        )}

        {status === "succeeded" && waitlistParents && (
          <div className="text-sm text-[#0B4B31]">
            Showing {filteredParents.length} waitlist parents
            {localSearch && ` for "${localSearch}"`}
          </div>
        )}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
          <thead className="text-xs font-normal uppercase tracking-wide text-black/40">
            <tr>
              <th className="px-4 font-normal text-[#0000008C]">Primary Parent</th>
              <th className="px-4 font-normal text-[#0000008C]">Address</th>
              <th className="px-4 font-normal text-[#0000008C]">Phone Number</th>
              <th className="px-4 font-normal text-[#0000008C]">Spouse</th>
              <th className="px-4 font-normal text-[#0000008C]">Children</th>
              <th className="px-4 font-normal text-center text-[#0000008C]">Waitlist Status</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((parent) => {
              const isSelected = parent.id === selectedId;
              const isUpdating = updatingParents.has(parent.id);

              return (
                <tr
                  key={parent.id}
                  onClick={() => handleRowSelect(parent.id)}
                  className={`group cursor-pointer rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm transition hover:shadow-md ${isSelected ? "bg-[#C9DCD4] border-[#AECDBF]" : ""
                    } ${isUpdating ? "opacity-50" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-[#0B4B31]">
                    <div className="relative flex items-center gap-3 pl-3">
                      <span
                        className={`absolute left-0 inline-flex h-2 w-2 rounded-full transition ${isSelected ? "bg-[#0B4B31]" : "bg-transparent group-hover:bg-[#0B4B31]/50"
                          }`}
                      ></span>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5EF] text-sm">
                        👤
                      </span>
                      <div className="flex flex-col">
                        <Link
                          href={`/dashboard/parent/${parent.id}`}
                          className="font-medium text-[#1E1E1E] transition hover:text-[#0B4B31]/70"
                        >
                          {parent.name}
                        </Link>
                        {parent.email && (
                          <span className="text-xs text-[#8A928F]">
                            {parent.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">{parent.address}</td>
                  <td className="px-4 py-3 font-normal text-black">{parent.phone}</td>
                  <td className="px-4 py-3 text-black">{parent.spouse}</td>
                  <td className="px-4 py-3 text-black">{parent.children}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWaitlist(parent.id, parent, parent.addToWaitList);
                      }}
                      disabled={isUpdating}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-normal transition ${parent.addToWaitList
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isUpdating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : parent.addToWaitList ? (
                        <ToggleRight className="text-green-600" size={18} />
                      ) : (
                        <ToggleLeft className="text-gray-400" size={18} />
                      )}
                      {parent.addToWaitList ? "On Waitlist" : "Off Waitlist"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {status === "succeeded" && tableData.length === 0 && (
          <div className="text-center py-8 text-[#0B4B31]">
            {localSearch ? `No waitlist parents found for "${localSearch}"` : "No parents in waitlist"}
          </div>
        )}

        {status === "idle" && (
          <div className="text-center py-8 text-[#0B4B31]">
            Ready to load waitlist parents...
          </div>
        )}
      </div>
    </section>
  );
};

export default WaitlistTable;