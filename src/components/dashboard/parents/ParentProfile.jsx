"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users2,
  Receipt,
  CreditCard,
  MessageSquareText,
  UserRound,
  Search,
  FileSpreadsheet,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import ViewInvoiceModal from "./ViewInvoiceModal";

const tabsConfig = [
  { key: "about", label: "About" },
  { key: "children", label: "Childrens" },
  { key: "invoices", label: "Invoices" },
  { key: "payments", label: "Payments Methods" },
  { key: "comments", label: "Comments" },
];

const ParentProfile = ({
  parent = {},
  tabs = tabsConfig,
  defaultTab = "about",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const profile = useMemo(
    () => ({
      name: "Abdifatah Soyan",
      role: "Parent",
      phone: "612-636-1149",
      email: "user@gmail.com",
      location: "1920 Portland Ave S Minneapolis MN",
      memberSince: "2025-01-01",
      spouse: {
        name: "Sadiya Hassan",
        phone: "612-636-1149",
        email: "user@gmail.com",
        location: "1920 Portland Ave S Minneapolis MN",
      },
      children: [
        {
          id: "21057",
          name: "Abdikadir Abdulkadir",
          classes: "2021 Mohamed Krie Class",
          birthDate: "September 18, 2018",
        },
      ],
      stats: {
        status: "Active",
        waitingList: "No",
        optedOut: "No",
      },
      quickActions: [
        { label: "Edit Profile", icon: UserRound },
        { label: "Send Message", icon: MessageSquareText },
        { label: "Edit Profile", icon: UserRound },
      ],
      invoices: [
        {
          id: "202501",
          item: "Fee",
          dueAmount: "$700",
          dueDate: "12-10-2025",
          status: "UnPaid",
        },
      ],
      paymentCards: [
        {
          id: "1",
          cardEnding: "57595",
          expiringDate: "57595",
          isDefault: true,
        },
        {
          id: "2",
          cardEnding: "57595",
          expiringDate: "57595",
          isDefault: false,
        },
      ],
      paymentRecords: [
        {
          receiptNo: "57595",
          paymentDate: "01 Jan 2025",
          paymentAmount: "$700",
          paymentMethod: "Card",
        },
        {
          receiptNo: "57595",
          paymentDate: "01 Jan 2025",
          paymentAmount: "$700",
          paymentMethod: "Card",
        },
      ],
      comments: [],
      ...parent,
    }),
    [parent]
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="rounded-[30px] border border-[#D2E2DB] bg-[#E5EFEB] p-6 shadow-sm">
            <SectionTitle>Primary Information</SectionTitle>
            <div className="mt-5 grid gap-4 text-sm text-[#123629] sm:grid-cols-2 xl:grid-cols-4">
              <InfoItem icon={Phone} label="Phone" value={profile.phone} />
              <InfoItem icon={Mail} label="Email" value={profile.email} />
              <InfoItem icon={MapPin} label="Location" value={profile.location} />
              <InfoItem
                icon={Calendar}
                label="Member Since"
                value={profile.memberSince}
              />
            </div>

            <div className="my-6 h-px w-full bg-[#CAD9D2]" />

            <SectionTitle>Spouse Information</SectionTitle>
            <div className="mt-5 grid gap-4 text-sm text-[#123629] sm:grid-cols-2 xl:grid-cols-4">
              <InfoItem
                icon={Users2}
                label="Spouse Name"
                value={profile.spouse.name}
              />
              <InfoItem
                icon={Phone}
                label="Phone"
                value={profile.spouse.phone}
              />
              <InfoItem
                icon={Mail}
                label="Email"
                value={profile.spouse.email}
              />
              <InfoItem
                icon={MapPin}
                label="Location"
                value={profile.spouse.location}
              />
            </div>
          </div>
        );
      case "children":
        return (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {profile.children.map((child) => (
              <div
                key={child.id}
                className="flex flex-col gap-5 rounded-[26px] border border-[#D2E2DB] bg-white/85 p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E1F4EC] text-3xl text-[#0B4B31]">
                    👤
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#0B4B31]">
                      {child.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#6A7A72]">
                      ID: {child.id}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-[#123629]">
                  <InfoRow label="Classes" value={child.classes} />
                  <InfoRow label="Date Of Birth" value={child.birthDate} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="rounded-full border border-[#0B4B31]/25 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                    View Profile
                  </button>
                  <button className="rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90">
                    Edit Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case "invoices":
        return <InvoicesTab invoices={profile.invoices} onViewInvoice={setSelectedInvoice} />;
      case "payments":
        return (
          <PaymentsTab
            cards={profile.paymentCards}
            onAddCard={() => {
              setEditingCard(null);
              setShowPaymentModal(true);
            }}
            onEditCard={(card) => {
              setEditingCard(card);
              setShowPaymentModal(true);
            }}
          />
        );
      case "comments":
        return <CommentsTab comments={profile.comments} />;
      default:
        return null;
    }
  };

  return (
    <>
      <section className="relative mx-auto max-w-4xl rounded-[28px] border border-[#E2E7E4] bg-white pb-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <div className="relative h-[240px] rounded-t-[28px] overflow-hidden">
          <Image
            src="/parentprofile.svg"
            alt="Parent profile background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0" />
        </div>

        {/* Profile Image - positioned outside overflow-hidden container */}
        <div className="absolute left-10 top-[152px] z-30">
          <div className="flex h-44 w-44 items-center justify-center rounded-full bg-white shadow-[0_30px_60px_-45px_rgba(0,0,0,0.7)] ring-8 ring-[#D5E2DB]">
            <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-[#C7D7D0] bg-white text-5xl text-[#0B4B31]">
              <Image
                src="/user-icon.svg"
                alt="Parent profile avatar"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="px-10 pb-8 pt-8 sm:px-12">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-[#0B4B31]">
                {profile.name}
              </h2>
              <p className="text-sm uppercase tracking-[0.35em] text-[#627169]">
                {profile.role}
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:mt-0 sm:grid-cols-2 sm:gap-6">
              <StatusCard stats={profile.stats} />
              <QuickActionCard actions={profile.quickActions} />
            </div>
          </div>

          <nav className="mt-8 flex flex-wrap items-center gap-3">
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab;
              // Define tab styles based on screenshot
              const getTabStyles = () => {
                if (isActive) {
                  // Active tab: dark forest green with white text/icons
                  return "bg-[#0B4B31] text-white";
                }
                // Inactive tabs with different colors
                switch (tab.key) {
                  case "about":
                    // Light teal/mint green with dark grey
                    return "bg-[#B9F2E3] text-[#4A5568]";
                  case "children":
                    // Muted medium-dark green-grey with light grey
                    return "bg-[#6B7F7A] text-[#E0ECE6]";
                  case "payments":
                    // Solid medium-dark grey with light grey
                    return "bg-[#6B7280] text-[#E0ECE6]";
                  case "comments":
                    // Very light pastel mint green with dark grey
                    return "bg-[#E1F4EC] text-[#4A5568]";
                  default:
                    return "bg-[#E0ECE6] text-[#4A5568]";
                }
              };
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-[18px] px-6 py-3 text-sm font-semibold transition ${getTabStyles()}`}
                >
                  <span className="text-lg">📁</span>
                  {tab.label}
                  <span className="ml-1 text-xs">▸</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 space-y-6">{renderTabContent()}</div>
        </div>
      </section>

      {/* View Invoice Modal */}
      {selectedInvoice && (
        <ViewInvoiceModal
          invoice={selectedInvoice}
          paymentRecords={profile.paymentRecords}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* Add/Edit Payment Card Modal */}
      {showPaymentModal && (
        <PaymentCardModal
          card={editingCard}
          onClose={() => {
            setShowPaymentModal(false);
            setEditingCard(null);
          }}
        />
      )}
    </>
  );
};

// Invoices Tab Component
const InvoicesTab = ({ invoices = [], onViewInvoice }) => {
  return (
    <div className="rounded-[26px] border border-[#D2E2DB] bg-[#E5EFEB] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#0B4B31]">Invoices</h3>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90">
          <FileSpreadsheet size={16} />
          Export Data
        </button>
        <div className="flex flex-1 items-center gap-3 sm:ml-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full border border-gray-200 bg-white px-10 py-2 text-sm focus:border-[#0B4B31] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button className="mb-6 flex items-center gap-2 rounded-full bg-[#B9F2E3] px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#A8E8D5]">
        See All
        <ArrowUpRight size={16} />
      </button>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#CAD9D2]">
              <th className="pb-3 text-left text-sm font-semibold text-[#7D8D87]">
                Items
              </th>
              <th className="pb-3 text-left text-sm font-semibold text-[#7D8D87]">
                Due Amount
              </th>
              <th className="pb-3 text-left text-sm font-semibold text-[#7D8D87]">
                Due Date
              </th>
              <th className="pb-3 text-left text-sm font-semibold text-[#7D8D87]">
                Status
              </th>
              <th className="pb-3 text-left text-sm font-semibold text-[#7D8D87]">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-[#CAD9D2]">
                  <td className="py-4 text-sm font-semibold text-[#123629]">
                    {invoice.item}
                  </td>
                  <td className="py-4 text-sm font-semibold text-[#123629]">
                    {invoice.dueAmount}
                  </td>
                  <td className="py-4 text-sm font-semibold text-[#123629]">
                    {invoice.dueDate}
                  </td>
                  <td className="py-4">
                    <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => onViewInvoice(invoice)}
                      className="rounded-full bg-[#0B4B31] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0B4B31]/90"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-[#5E6C64]">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// Payments Tab Component
const PaymentsTab = ({ cards = [], onAddCard, onEditCard }) => {
  return (
    <div className="rounded-[26px] border border-[#D2E2DB] bg-[#E5EFEB] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#0B4B31]">Cards</h3>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by date"
              className="w-full rounded-full border border-gray-200 bg-white px-10 py-2 text-sm focus:border-[#0B4B31] focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90">
            <FileSpreadsheet size={16} />
            Export Data
          </button>
          <button className="flex items-center gap-2 rounded-full bg-[#B9F2E3] px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#A8E8D5]">
            See All
            <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onAddCard}
            className="flex items-center gap-2 rounded-full bg-[#B9F2E3] px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#A8E8D5]"
          >
            <CreditCard size={16} />
            Add New Card
          </button>
          <button className="flex items-center gap-2 rounded-full bg-[#B9F2E3] px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#A8E8D5]">
            <CreditCard size={16} />
            Add New Bank
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#CAD9D2]">
              <th className="pb-3 text-left text-sm font-semibold text-[#7D8D87]">
                Card Ending
              </th>
              <th className="pb-3 text-left text-sm font-semibold text-[#7D8D87]">
                Expiring Date
              </th>
              <th className="pb-3 text-left text-sm font-semibold text-[#7D8D87]">
                Default
              </th>
              <th className="pb-3 text-left text-sm font-semibold text-[#7D8D87]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {cards.length > 0 ? (
              cards.map((card) => (
                <tr key={card.id} className="border-b border-[#CAD9D2]">
                  <td className="py-4 text-sm font-semibold text-[#123629]">
                    {card.cardEnding}
                  </td>
                  <td className="py-4 text-sm font-semibold text-[#123629]">
                    {card.expiringDate}
                  </td>
                  <td className="py-4">
                    <span
                      className={`text-sm font-semibold ${
                        card.isDefault
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {card.isDefault ? "Default" : "Not Default"}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => onEditCard(card)}
                      className="flex items-center gap-1 rounded-full bg-[#0B4B31] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0B4B31]/90"
                    >
                      Take Action
                      <ChevronDown size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-sm text-[#5E6C64]"
                >
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Payment Card Modal Component
const PaymentCardModal = ({ card, onClose }) => {
  const isEditing = !!card;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#0B4B31]">
            {isEditing ? "Edit Payment Method" : "Add Payment Method"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0B4B31]">
              Card Number
            </label>
            <input
              type="text"
              defaultValue={card?.cardNumber || "4242 XXXX XXXX XXXX"}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#0B4B31] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0B4B31]">
              Expiration
            </label>
            <input
              type="text"
              defaultValue={card?.expiration || "42/42"}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#0B4B31] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0B4B31]">
              CVC
            </label>
            <input
              type="text"
              defaultValue={card?.cvc || "XXX"}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#0B4B31] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {isEditing && (
            <button className="flex-1 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-200">
              Remove
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="flex-1 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Comments Tab Component
const CommentsTab = ({ comments = [] }) => {
  return (
    <div className="rounded-[26px] border border-[#D2E2DB] bg-[#E5EFEB] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#0B4B31]">Comments</h3>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90">
          <FileSpreadsheet size={16} />
          Export Data
        </button>
        <div className="flex flex-1 items-center gap-3 sm:ml-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full border border-gray-200 bg-white px-10 py-2 text-sm focus:border-[#0B4B31] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button className="mb-6 flex items-center gap-2 rounded-full bg-[#B9F2E3] px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#A8E8D5]">
        See All
        <ArrowUpRight size={16} />
      </button>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#CAD9D2]">
              <th className="pb-3 text-left text-sm font-semibold text-[#7D8D87]">
                Comments
              </th>
              <th className="pb-3 text-left text-sm font-semibold text-[#7D8D87]">
                Created By
              </th>
              <th className="pb-3 text-left text-sm font-semibold text-[#7D8D87]">
                Date
              </th>
              <th className="pb-3 text-left text-sm font-semibold text-[#7D8D87]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <tr key={index} className="border-b border-[#CAD9D2]">
                  <td className="py-4 text-sm font-semibold text-[#123629]">
                    {comment.text}
                  </td>
                  <td className="py-4 text-sm font-semibold text-[#123629]">
                    {comment.createdBy}
                  </td>
                  <td className="py-4 text-sm font-semibold text-[#123629]">
                    {comment.date}
                  </td>
                  <td className="py-4">
                    <button className="flex items-center gap-1 rounded-full bg-[#0B4B31] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0B4B31]/90">
                      Take Action
                      <ChevronDown size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-sm font-semibold text-[#0B4B31]"
                >
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-[#0B4B31]">{children}</h3>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-[18px] bg-white px-4 py-3 shadow-[0_12px_30px_-24px_rgba(0,0,0,0.45)]">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B4B31]/10 text-[#0B4B31]">
      <Icon size={16} />
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7D8D87]">
        {label}
      </span>
      <span className="text-sm font-semibold text-[#123629]">{value}</span>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-[18px] bg-[#F3F6F5] px-4 py-3">
    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7D8D87]">
      {label}
    </span>
    <span className="text-sm font-semibold text-[#123629]">{value}</span>
  </div>
);

const StatusCard = ({ stats }) => (
  <div className="rounded-[26px] bg-gradient-to-br from-white/95 via-white/85 to-[#C7E7DD]/60 p-5 text-[#0B4B31] shadow-[0_24px_60px_-50px_rgba(0,0,0,0.65)] backdrop-blur">
    <h3 className="text-sm font-semibold">Account Status</h3>
    <div className="mt-4 space-y-3 text-sm">
      <StatusRow label="Status" value={stats?.status ?? "Active"} />
      <StatusRow label="Waiting List" value={stats?.waitingList ?? "No"} />
      <StatusRow label="Opted Out of Text" value={stats?.optedOut ?? "No"} />
    </div>
  </div>
);

const StatusRow = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-[14px] bg-[#EDF3F0] px-3 py-2">
    <span className="text-xs font-semibold text-[#6F8279]">{label}</span>
    <span className="text-sm font-semibold text-[#0B4B31]">{value}</span>
  </div>
);

const QuickActionCard = ({ actions = [] }) => (
  <div className="rounded-[26px] bg-gradient-to-br from-[#114F36] via-[#1C6A45] to-[#3E9A74] p-5 text-white shadow-[0_24px_60px_-45px_rgba(0,0,0,0.6)] backdrop-blur">
    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
      Quick Action
    </h3>
    <div className="mt-4 space-y-3">
      {actions.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className="flex w-full items-center justify-between rounded-[16px] bg-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
        >
          <span className="flex items-center gap-2">
            {Icon ? <Icon size={16} /> : null}
            {label}
          </span>
          <span>↗</span>
        </button>
      ))}
    </div>
  </div>
);

export default ParentProfile;
