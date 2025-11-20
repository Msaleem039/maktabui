"use client";

import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  X,
  Trash2
} from "lucide-react";
import ViewInvoiceModal from "./ViewInvoiceModal";
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { 
  addCardDetail, 
  clearCardError, 
  setDefaultCard, 
  removeCard 
} from "@/redux/slices/parentSlices/parentSlice";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51ST33BJVO0vFfpflc4DWY8yeQ544KDduqajZGHU0K8E9HByfBBrQmNLWjFd0wRkY3D5jFOAgHYswSZudeUBA2rgJ00Rs04VO1X");
const tabsConfig = [
  { key: "about", label: "About" },
  { key: "children", label: "Childrens" },
  { key: "invoices", label: "Invoices" },
  { key: "payments", label: "Payments Methods" },
];

const StripeCardInput = ({ label, className = "", onCardChange }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} *
      </label>
      <div className="w-full bg-[#D5E2DB] text-[#0B4B31] rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30 min-h-[50px] flex items-center">
        <div className="w-full">
          <CardElement
            onChange={onCardChange}
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#0B4B31',
                  '::placeholder': {
                    color: '#85A598',
                  },
                },
              },
            }}
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Test card: 4242 4242 4242 4242 | Exp: 12/34 | CVC: 123 | ZIP: 12345
      </p>
    </div>
  );
};

// Separate component for the payment modal to use Stripe hooks
const PaymentCardModalContent = ({ onAddCard, loading, error, cardComplete, onCardChange, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe not loaded");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error("Card element not found");
      return;
    }

    onAddCard(cardElement, stripe);
  };

  const handleCardChange = (event) => {
    onCardChange(event.complete);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[0.9375rem] font-medium text-[#0B4B31]">
            Add Payment Method
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <StripeCardInput
            label="Card Details"
            onCardChange={handleCardChange}
          />

          {error && (
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || !cardComplete || loading}
              className="flex-1 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Card...' : 'Add Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ParentProfile = ({
  parent = {},
  tabs = tabsConfig,
  defaultTab = "about",
}) => {
  const dispatch = useDispatch();
  const { loading: cardLoading, error: cardError, success: cardSuccess } = useSelector(
    state => state.addCardDetail || { loading: false, error: null, success: false }
  );
  const { loading: setDefaultLoading } = useSelector(
    state => state.setDefaultCard || { loading: false }
  );
  const { loading: removeCardLoading } = useSelector(
    state => state.removeCard || { loading: false }
  );

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  // Reset success state when modal closes
  useEffect(() => {
    if (cardSuccess && showPaymentModal) {
      setShowPaymentModal(false);
      window.location.reload();
    }
  }, [cardSuccess, showPaymentModal]);

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (showPaymentModal && cardError) {
      dispatch(clearCardError());
    }
  }, [showPaymentModal, cardError, dispatch]);

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

    const quickActions = [
      { label: "Edit Profile", icon: "UserRound" },
      { label: "Send Message", icon: "MessageSquareText" },
      { label: "View Reports", icon: "FileSpreadsheet" },
    ];

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
      quickActions,
      invoices: invoices.length > 0 ? invoices : [],
      paymentCards,
      paymentRecords,
    };
  }, [parent]);

  const getIconComponent = (iconName) => {
    const iconMap = {
      UserRound,
      MessageSquareText,
      FileSpreadsheet,
      Phone,
      Calendar,
      Users2,
      Receipt,
      CreditCard,
      Search,
      ArrowUpRight,
      ChevronDown,
      X,
      Trash2
    };
    return iconMap[iconName] || null;
  };

  const handleAddCard = async (cardElement, stripe) => {
    if (!cardElement || !stripe) {
      console.error("Card element or Stripe not available");
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      const cardData = {
        parentId: parent._id,
        cardData: {
          paymentMethodId: paymentMethod.id,
          cardBrand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          expMonth: paymentMethod.card.exp_month,
          expYear: paymentMethod.card.exp_year,
          stripeCustomerId: parent.cardDetail?.stripeCustomerId,
        },
      };

      dispatch(addCardDetail(cardData));

    } catch (error) {
      console.error("Error creating payment method:", error);
      dispatch(clearCardError());
      dispatch(addCardDetail.rejected({ message: error.message }));
    }
  };

  const handleRemoveCard = async (cardId) => {
    if (!confirm('Are you sure you want to remove this card?')) return;

    try {
      await dispatch(removeCard({
        parentId: parent._id,
        paymentMethodId: cardId
      })).unwrap();
      
      window.location.reload();
    } catch (error) {
      console.error('Error removing card:', error);
    }
  };

  const handleSetDefaultCard = async (cardId) => {
    try {
      await dispatch(setDefaultCard({
        parentId: parent._id,
        paymentMethodId: cardId
      })).unwrap();
      
      window.location.reload();
    } catch (error) {
      console.error('Error setting default card:', error);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setEditingCard(null);
    setCardComplete(false);
    dispatch(clearCardError());
  };

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
            onRemoveCard={handleRemoveCard}
            onSetDefaultCard={handleSetDefaultCard}
            setDefaultLoading={setDefaultLoading}
            removeCardLoading={removeCardLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Elements stripe={stripePromise}>
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
                <QuickActionCard actions={profile.quickActions} getIconComponent={getIconComponent} />
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

        {/* Add Payment Card Modal */}
        {showPaymentModal && (
          <PaymentCardModalContent
            onAddCard={handleAddCard}
            loading={cardLoading}
            error={cardError}
            cardComplete={cardComplete}
            onCardChange={setCardComplete}
            onClose={handleClosePaymentModal}
          />
        )}
      </>
    </Elements>
  );
};

const InvoicesTab = ({ invoices = [], onViewInvoice }) => {
  return (
    <div className="rounded-[26px] border border-[#D2E2DB] bg-[#E5EFEB] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[0.9375rem] font-medium text-[#0B4B31]">Invoices</h3>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
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

const PaymentsTab = ({ 
  cards = [], 
  onAddCard, 
  onRemoveCard, 
  onSetDefaultCard, 
  setDefaultLoading, 
  removeCardLoading 
}) => {
  return (
    <div className="rounded-[26px] border border-[#D2E2DB] bg-[#E5EFEB] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[0.9375rem] font-medium text-[#0B4B31]">Cards</h3>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by date"
              className="w-full rounded-full border border-gray-200 bg-white px-10 py-2 text-sm focus:border-[#0B4B31] focus:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onAddCard}
            className="flex items-center gap-2 rounded-full bg-[#B9F2E3] px-4 py-2 text-xs font-medium text-[#0B4B31] transition hover:bg-[#A8E8D5]"
          >
            <CreditCard size={16} />
            Add New Card
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
                Actions
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
                    <div className="flex gap-2">
                      {!card.isDefault && (
                        <button
                          onClick={() => onSetDefaultCard(card.id)}
                          disabled={setDefaultLoading}
                          className="rounded-full bg-[#0B4B31] px-3 py-1.5 text-xs font-normal text-white transition hover:bg-[#0B4B31]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {setDefaultLoading ? 'Setting...' : 'Set Default'}
                        </button>
                      )}
                      <button
                        onClick={() => onRemoveCard(card.id)}
                        disabled={removeCardLoading}
                        className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-normal text-white transition hover:bg-red-700 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={12} />
                        {removeCardLoading ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
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

const QuickActionCard = ({ actions = [], getIconComponent }) => (
  <div className="rounded-[26px] bg-gradient-to-br from-[#114F36] via-[#1C6A45] to-[#3E9A74] py-5 px-10 text-white shadow-[0_24px_60px_-45px_rgba(0,0,0,0.6)] backdrop-blur">
    <h3 className="text-base font-extrabold text-center text-white">
      Quick Action
    </h3>
    <div className="mt-4 space-y-3">
      {actions.map(({ label, icon }, index) => {
        const IconComponent = getIconComponent(icon);
        return (
          <button
            key={`${label}-${index}`}
            type="button"
            className="flex w-full items-center justify-between rounded-[16px] bg-[#F8F8F8] px-4 py-3 text-[0.6875rem] font-normal text-black transition"
          >
            <span className="flex items-center gap-2">
              {IconComponent ? <IconComponent size={14} /> : null}
              {label}
            </span>
            <span>↗</span>
          </button>
        );
      })}
    </div>
  </div>
);

export default ParentProfile;