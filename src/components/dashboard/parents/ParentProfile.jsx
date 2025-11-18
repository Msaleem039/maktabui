"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Phone,
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
  X
} from "lucide-react";
import ViewInvoiceModal from "./ViewInvoiceModal";

const tabsConfig = [
  { key: "about", label: "About" },
  { key: "children", label: "Childrens" },
  { key: "invoices", label: "Invoices" },
  { key: "payments", label: "Payments Methods" },
];

const ParentProfile = ({
  parent = {},
  tabs = tabsConfig,
  defaultTab = "about",
}) => {

  console.log("parent", parent);

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const profile = useMemo(() => {
    const paymentCards = parent.cardDetail?.paymentMethods?.map(pm => ({
      id: pm.paymentMethodId,
      cardEnding: pm.last4,
      expiringDate: `${pm.expMonth}/${pm.expYear}`,
      isDefault: pm.isDefault,
      cardBrand: pm.cardBrand,
    })) || [];

    const children = parent.students?.map(student => ({
      id: student._id,
      name: student.studentName,
      classes: student.class || "Not Assigned",
      birthDate: student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "Not Available",
      enrollDate: student.enrollDate ? new Date(student.enrollDate).toLocaleDateString() : "Not Available",
      gender: student.gender,
      fee: student.fee,
    })) || [];

    const invoices = children.flatMap(child => [
      {
        id: `INV-${child.id}-001`,
        item: `Tuition Fee - ${child.name}`,
        dueAmount: `$${child.fee || 0}`,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        status: "UnPaid",
      }
    ]);

    const paymentRecords = [
      {
        receiptNo: "RC-001",
        paymentDate: new Date().toLocaleDateString(),
        paymentAmount: "$211",
        paymentMethod: "Card",
      }
    ];

    const spouse = {
      name: parent.spouse || "Not Available",
      phone: parent.spousePhone || "Not Available",
    };

    return {
      name: parent.fullName || "No Name",
      role: "Parent",
      phone: parent.phone || "Not Available",
      email: parent.email || "Not Available",
      location: parent.address || "Not Available",
      memberSince: parent.createdAt ? new Date(parent.createdAt).toLocaleDateString() : "Not Available",
      identityNumber: parent.identityNumber || "Not Available",
      spouseDetail: spouse,
      emergencyPhone: parent.emergencyPhone || "Not Available",
      children,
      stats: {
        status: parent.addToWaitList ? "Waiting List" : "Active",
        waitingList: parent.addToWaitList ? "Yes" : "No",
        optedOut: "No",
      },
      quickActions: [
        { label: "Edit Profile", icon: UserRound },
        { label: "Send Message", icon: MessageSquareText },
        { label: "View Reports", icon: FileSpreadsheet },
      ],
      invoices: invoices.length > 0 ? invoices : [],
      paymentCards,
      paymentRecords,
      ...parent,
    };
  }, [parent]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="rounded-[30px] border border-[#D2E2DB] bg-[#CEDBD6] p-6">
            <SectionTitle>Primary Information</SectionTitle>
            <div className="mt-5 grid gap-4 text-sm text-[#123629] sm:grid-cols-2 xl:grid-cols-3">
              <InfoItem icon={Phone} label="Phone" value={profile.phone} />
              <InfoItem iconSrc="/Email.svg" label="Email" value={profile.email} />
              <InfoItem iconSrc="/Location.svg" label="Location" value={profile.location} />
              <InfoItem
                icon={Calendar}
                label="Member Since"
                value={profile.memberSince}
              />
              <InfoItem
                icon={UserRound}
                label="Identity Number"
                value={profile.identityNumber}
              />
              <InfoItem
                icon={Phone}
                label="Emergency Phone"
                value={profile.emergencyPhone}
              />

              <InfoItem
                icon={Users2}
                label="Spouse Name"
                value={profile.spouseDetail?.name || "Not Available"}
              />
              <InfoItem
                icon={Phone}
                label="Spouse Phone"
                value={profile.spouseDetail?.phone || "Not Available"}
              />
            </div>


          </div>
        );
      case "children":
        return (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            {profile.children.length > 0 ? (
              profile.children.map((child) => (
                <div
                  key={child.id}
                  className="flex flex-col gap-5 rounded-[26px] border-[#00000030] bg-[#CEDBD6] px-6 py-10 shadow-[0_24px_60px_-45px_rgba(0,0,0,0.6)] backdrop-blur"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur text-3xl text-white">
                      👤
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0B4B31]">
                        {child.name}
                      </p>
                      <p className="text-sm font-medium text-black">
                        ID: {child.id.slice(-6)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <ChildInfoRow label="Classes" value={child.classes} />
                    <ChildInfoRow label="Date Of Birth" value={child.birthDate} />
                    <ChildInfoRow label="Enrollment Date" value={child.enrollDate} />
                    <ChildInfoRow label="Gender" value={child.gender} />
                    <ChildInfoRow label="Monthly Fee" value={`$${child.fee}`} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-white/25 backdrop-blur">
                      View Profile
                    </button>
                    <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-white/90">
                      Edit Profile
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center">
                <p className="text-sm text-[#5E6C64]">No Children Found</p>
              </div>
            )}
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

        {/* Profile Image */}
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

            <div className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 ">
              <StatusCard stats={profile.stats} />
              <QuickActionCard actions={profile.quickActions} />
            </div>
          </div>

          <nav className="mt-8 flex flex-wrap items-center gap-3">
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab;
              const getTabStyles = () => {
                if (isActive) {
                  return "bg-[#96E2D6FA] text-black font-medium";
                }
                switch (tab.key) {
                  case "about":
                    return "bg-[#0B4B3185] text-white font-medium";
                  case "children":
                    return "bg-[#0B4B3185] text-white font-medium";
                  case "payments":
                    return "bg-[#767D7A] text-white font-medium";
                  default:
                    return "bg-[#0B4B31] text-white font-medium";
                }
              };
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-[18px] px-6 py-3 text-sm font-medium transition ${getTabStyles()}`}
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

const InvoicesTab = ({ invoices = [], onViewInvoice }) => {
  return (
    <div className="rounded-[26px] border border-[#D2E2DB] bg-[#E5EFEB] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[0.9375rem] font-medium text-[#0B4B31]">Invoices</h3>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-normal text-white transition hover:bg-[#0B4B31]/90">
          <FileSpreadsheet size={14} />
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

      <button className="mb-6 flex items-center gap-2 rounded-full bg-[#B9F2E3] px-4 py-2 text-sm font-normal text-[#0B4B31] transition hover:bg-[#A8E8D5]">
        See All
        <ArrowUpRight size={14} />
      </button>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#CAD9D2]">
              <th className="pb-3 text-left text-sm font-normal text-[#0000008C]">
                Items
              </th>
              <th className="pb-3 text-left text-sm font-normal text-[#0000008C]">
                Due Amount
              </th>
              <th className="pb-3 text-left text-sm font-normal text-[#0000008C]">
                Due Date
              </th>
              <th className="pb-3 text-left text-sm font-normal text-[#0000008C]">
                Status
              </th>
              <th className="pb-3 text-left text-sm font-normal text-[#0000008C]">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-[#CAD9D2]">
                  <td className="py-4 text-sm font-medium text-[#1E1E1E]">
                    {invoice.item}
                  </td>
                  <td className="py-4 text-sm font-medium text-[#1E1E1E]">
                    {invoice.dueAmount}
                  </td>
                  <td className="py-4 text-sm font-medium text-[#1E1E1E]">
                    {invoice.dueDate}
                  </td>
                  <td className="py-4">
                    <span className="inline-block rounded-full bg-[#F14336] px-3 py-1 text-xs font-normal text-white">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => onViewInvoice(invoice)}
                      className="rounded-full bg-[#0B4B31] px-4 py-1.5 text-xs font-normal text-white transition hover:bg-[#0B4B31]/90"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-[#5E6C64]">
                  No Invoices Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PaymentsTab = ({ cards = [], onAddCard, onEditCard }) => {
  return (
    <div className="rounded-[26px] border border-[#D2E2DB] bg-[#E5EFEB] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[0.9375rem] font-medium text-[#0B4B31]">Cards</h3>
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
          <button className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0B4B31]/90">
            <FileSpreadsheet size={16} />
            Export Data
          </button>
          <button className="flex items-center gap-2 rounded-full bg-[#B9F2E3] px-4 py-2 text-sm font-medium text-[#0B4B31] transition hover:bg-[#A8E8D5]">
            See All
            <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onAddCard}
            className="flex items-center gap-2 rounded-full bg-[#B9F2E3] px-4 py-2 text-xs font-medium text-[#0B4B31] transition hover:bg-[#A8E8D5]"
          >
            <CreditCard size={16} />
            Add New Card
          </button>
          <button className="flex items-center gap-2 rounded-full bg-[#B9F2E3] px-4 py-2 text-xs font-medium text-[#0B4B31] transition hover:bg-[#A8E8D5]">
            <CreditCard size={16} />
            Add New Bank
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#CAD9D2]">
              <th className="pb-3 text-left text-sm font-normal text-[#0000008C]">
                Card Ending
              </th>
              <th className="pb-3 text-left text-sm font-normal text-[#0000008C]">
                Card Brand
              </th>
              <th className="pb-3 text-left text-sm font-normal text-[#0000008C]">
                Expiring Date
              </th>
              <th className="pb-3 text-left text-sm font-normal text-[#0000008C]">
                Default
              </th>
              <th className="pb-3 text-left text-sm font-normal text-[#0000008C]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {cards.length > 0 ? (
              cards.map((card) => (
                <tr key={card.id} className="border-b border-[#CAD9D2]">
                  <td className="py-4 text-sm font-medium text-[#1E1E1E]">
                    **** {card.cardEnding}
                  </td>
                  <td className="py-4 text-sm font-medium text-[#1E1E1E]">
                    {card.cardBrand?.toUpperCase() || 'Unknown'}
                  </td>
                  <td className="py-4 text-sm font-medium text-[#1E1E1E]">
                    {card.expiringDate}
                  </td>
                  <td className="py-4">
                    <span
                      className={`text-sm font-medium ${card.isDefault
                        ? "text-[#0B4B31]"
                        : "text-[#F14336]"
                        }`}
                    >
                      {card.isDefault ? "Default" : "Not Default"}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => onEditCard(card)}
                      className="flex items-center gap-1 rounded-full bg-[#0B4B31] px-3 py-1.5 text-sm font-normal text-[#71DD8C] transition hover:bg-[#0B4B31]/90"
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
                  colSpan={5}
                  className="py-8 text-center text-sm text-[#5E6C64]"
                >
                  No Payment Methods Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PaymentCardModal = ({ card, onClose }) => {
  const isEditing = !!card;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[0.9375rem] font-medium text-[#0B4B31]">
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
            <label className="mb-2 block text-sm font-medium text-[#0B4B31]">
              Card Number
            </label>
            <input
              type="text"
              defaultValue={card?.cardEnding ? `**** ${card.cardEnding}` : "4242 XXXX XXXX XXXX"}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#0B4B31] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#0B4B31]">
              Expiration
            </label>
            <input
              type="text"
              defaultValue={card?.expiringDate || "MM/YY"}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#0B4B31] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#0B4B31]">
              CVC
            </label>
            <input
              type="text"
              placeholder="XXX"
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

const SectionTitle = ({ children }) => (
  <h3 className="text-[0.9375rem] font-medium text-[#0B4B31]">{children}</h3>
);

const InfoItem = ({ icon: Icon, iconSrc, label, value }) => (
  <div className="flex items-center gap-3 rounded-[18px] px-4 py-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full">
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt={label}
          width={20}
          height={20}
          className="object-contain"
        />
      ) : Icon ? (
        <Icon size={20} className="text-[#0B4B31] fill-[#0B4B31]" />
      ) : null}
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-[#0B4B31]">
        {label}
      </span>
      <span className="text-xs font-medium text-black">{value}</span>
    </div>
  </div>
);

const ChildInfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-[18px] bg-gradient-to-r from-[#85A598] to-[#0B4B31] px-4 py-3">
    <span className="text-sm font-medium text-[#000000]">
      {label}
    </span>
    <span className="text-sm font-medium text-white">{value}</span>
  </div>
);

const StatusCard = ({ stats }) => (
  <div className="rounded-[26px] p-5 bg-gradient-to-br from-[#114F36] via-[#1C6A45] to-[#3E9A74]">
    <h3 className="text-base text-white text-center font-extrabold">Account Status</h3>
    <div className="mt-4 space-y-3 text-sm" >
      <StatusRow label="Status" value={stats?.status || "Active"} />
      <StatusRow label="Waiting List" value={stats?.waitingList || "No"} />
      <StatusRow label="Opted Out of Text" value={stats?.optedOut || "No"} />
    </div >
  </div >
);

const StatusRow = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-[14px] bg-[#F8F8F8] px-3 py-2">
    <span className="text-[0.6875rem] font-normal text-black">{label}</span>
    <span className="text-[0.6875rem] font-semibold text-black">{value}</span>
  </div>
);

const QuickActionCard = ({ actions = [] }) => (
  <div className="rounded-[26px] bg-gradient-to-br from-[#114F36] via-[#1C6A45] to-[#3E9A74] py-5 px-10 text-white shadow-[0_24px_60px_-45px_rgba(0,0,0,0.6)] backdrop-blur">
    <h3 className="text-base font-extrabold text-center text-white">
      Quick Action
    </h3>
    <div className="mt-4 space-y-3">
      {actions.map(({ label, icon: Icon }, index) => (
        <button
          key={`${label}-${index}`}
          type="button"
          className="flex w-full items-center justify-between rounded-[16px] bg-[#F8F8F8] px-4 py-3 text-[0.6875rem] font-normal text-black transition"
        >
          <span className="flex items-center gap-2">
            {Icon ? <Icon size={14} /> : null}
            {label}
          </span>
          <span>↗</span>
        </button>
      ))}
    </div>
  </div>
);

export default ParentProfile;