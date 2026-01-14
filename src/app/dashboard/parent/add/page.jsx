"use client";

import { useState, useEffect } from "react";
import { Trash2, Calendar, CreditCard, Repeat } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createParent,
  resetAllParentsState,
} from "@/redux/slices/parentSlices/parentSlice";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { getAllClassesNameAction } from "@/redux/slices/classSlices/classSlice";
import { getAdminId, getUserBranch } from "@/utils/getCookies";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
      />
    </div>
  );
};

const FormDropdown = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "Select",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div
        className="w-full bg-[#D5E2DB] text-[#0B4B31] rounded-full px-4 py-3 flex justify-between items-center cursor-pointer outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-[#0B4B31]" : "text-[#0B4B31]/60"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="text-[#0B4B31]">▾</span>
      </div>
      {isOpen && (
        <div className="absolute w-full bg-white border border-[#D2E2DB] rounded-xl shadow-lg z-10 mt-2 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange({ target: { name, value: option.value } });
                setIsOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer hover:bg-[#E5EFEB] ${
                value === option.value
                  ? "bg-[#0B4B31] text-white"
                  : "text-[#0B4B31]"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DateInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-[#0B4B31]/30 appearance-none"
          style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
        />
      </div>
    </div>
  );
};

function AddParentFormContent() {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const { status, error, parent, student } = useSelector(
    (state) => state.createParent
  );
  const adminId = getAdminId();
  const branch = getUserBranch();

  const {
    classNames,
    loading: classesLoading,
    error: classesError,
  } = useSelector((state) => state.getAllClassesName);

  const [parentData, setParentData] = useState({
    fullName: "",
    address: "",
    spouse: "",
    emergencyPhone: "",
    phone: "",
    spousePhone: "",
    email: "",
    password: "",
    identityNumber: "",
    addToWaitList: false,
    recurringEnabled: false,
    recurringFrequency: "monthly",
  });

  const [children, setChildren] = useState([
    {
      studentName: "",
      address: "",
      dateOfBirth: "",
      phone: "",
      addToWaitList: false,
      gender: "",
      enrollDate: "",
      fee: "",
      password: "",
      class: "",
      email: "",
    },
  ]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [stripeError, setStripeError] = useState("");
  const [cardDetails, setCardDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dispatch(getAllClassesNameAction(adminId));
  }, [dispatch]);

  const classOptions = Array.isArray(classNames)
    ? classNames.map((classItem) => ({
        label: classItem.name || classItem.className || "Unnamed Class",
        value: classItem._id || classItem.id,
      }))
    : [];

  // Recurring frequency options
  const recurringOptions = [
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
  ];

  const handleParentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChildChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setChildren((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: type === "checkbox" ? checked : value,
      };
      return updated;
    });
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setStripeError(event.error ? event.error.message : "");

    if (event.complete) {
      setCardDetails({
        brand: event.brand,
        last4: event.last4,
        expMonth: event.exp_month,
        expYear: event.exp_year,
      });
    } else {
      setCardDetails(null);
    }
  };

  const addMoreStudents = () => {
    setChildren((prev) => [
      ...prev,
      {
        studentName: "",
        address: "",
        dateOfBirth: "",
        phone: "",
        addToWaitList: false,
        gender: "",
        enrollDate: "",
        fee: "",
        password: "",
        class: "",
        email: "",
      },
    ]);
  };

  const removeStudent = (index) => {
    if (children.length > 1) {
      setChildren((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      console.error("Stripe hasn't loaded yet");
      setStripeError("Stripe hasn't loaded yet. Please try again.");
      setIsProcessing(false);
      return;
    }

    setStripeError("");

    try {
      const submissionData = {
        parent: {
          ...parentData,
          fee: parentData.fee ? Number(parentData.fee) : 0,
        },
        children: children.map((child) => ({
          ...child,
          dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth) : null,
          enrollDate: child.enrollDate
            ? new Date(child.enrollDate)
            : new Date(),
          fee: child.fee ? Number(child.fee) : 0,
          gender:
            child.gender === "male"
              ? "Male"
              : child.gender === "female"
              ? "Female"
              : "Other",
        })),
        adminId,
        branch,
      };

      const result = await dispatch(createParent(submissionData)).unwrap();

      if (result) {
        setShowSuccess(true);
        resetForm();

        setTimeout(() => {
          setShowSuccess(false);
          dispatch(resetAllParentsState());
        }, 5000);
      }
    } catch (error) {
      console.error("Error creating parent:", error);
      setStripeError(
        error.message || "An error occurred while processing your request."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setParentData({
      fullName: "",
      address: "",
      spouse: "",
      emergencyPhone: "",
      phone: "",
      spousePhone: "",
      email: "",
      password: "",
      identityNumber: "",
      addToWaitList: false
    });
    setChildren([
      {
        studentName: "",
        address: "",
        dateOfBirth: "",
        phone: "",
        addToWaitList: false,
        gender: "",
        enrollDate: "",
        fee: "",
        password: "",
        class: "",
        email: "",
      },
    ]);

    if (elements) {
      const cardElement = elements.getElement(CardElement);
      if (cardElement) {
        cardElement.clear();
      }
    }

    setCardComplete(false);
    setStripeError("");
    setCardDetails(null);
  };

  return (
    <>
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <p className="font-semibold">Family added successfully!</p>
          <p>
            Parent and student records have been created.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {stripeError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Payment Error:</p>
          <p>{stripeError}</p>
        </div>
      )}

      {/* Classes Loading/Error Messages */}
      {classesLoading && (
        <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
          <p className="font-semibold">Loading classes...</p>
        </div>
      )}

      {classesError && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
          <p className="font-semibold">Warning:</p>
          <p>Could not load classes - {classesError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Parent/Guardian
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              name="fullName"
              value={parentData.fullName}
              onChange={handleParentChange}
              placeholder="Your Full Name"
              required
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={parentData.email}
              onChange={handleParentChange}
              placeholder="your.email@example.com"
              required
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={parentData.password}
              onChange={handleParentChange}
              placeholder="Password"
              required
            />
            <FormInput
              label="Identity Number"
              name="identityNumber"
              value={parentData.identityNumber}
              onChange={handleParentChange}
              placeholder="Identity Number"
              required
            />
            <FormInput
              label="Address"
              name="address"
              value={parentData.address}
              onChange={handleParentChange}
              placeholder="Your Address"
              required
            />
            <FormInput
              label="Phone"
              name="phone"
              value={parentData.phone}
              onChange={handleParentChange}
              placeholder="Phone"
              required
            />
            <FormInput
              label="Spouse"
              name="spouse"
              value={parentData.spouse}
              onChange={handleParentChange}
              placeholder="Spouse Name"
            />
            <FormInput
              label="Spouse Phone"
              name="spousePhone"
              value={parentData.spousePhone}
              onChange={handleParentChange}
              placeholder="Spouse Phone"
            />
            <FormInput
              label="Emergency Phone Number"
              name="emergencyPhone"
              value={parentData.emergencyPhone}
              onChange={handleParentChange}
              placeholder="Emergency Phone"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="addToWaitList"
                checked={parentData.addToWaitList}
                onChange={handleParentChange}
                className="rounded border-gray-300 text-[#0B4B31] focus:ring-[#0B4B31]"
              />
              <label className="text-sm font-semibold text-gray-700">
                Add To Waiting List
              </label>
            </div>
          </div>
        </div>

        {/* Students Section */}
        {children.map((child, index) => (
          <div key={index} className="space-y-6 border-t pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                Student {index + 1}
              </h3>
              {children.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStudent(index)}
                  className="flex items-center gap-2 rounded-full bg-[#F16957] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#F16957]/90"
                >
                  <Trash2 size={16} />
                  Remove Student
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Student Name"
                name="studentName"
                value={child.studentName}
                onChange={(e) => handleChildChange(index, e)}
                placeholder="Student Name"
                required
              />
              <FormInput
                label="Student Email"
                name="email"
                type="email"
                value={child.email}
                onChange={(e) => handleChildChange(index, e)}
                placeholder="student.email@example.com"
                required
              />
              <FormInput
                label="Student Password"
                name="password"
                type="password"
                value={child.password}
                onChange={(e) => handleChildChange(index, e)}
                placeholder="Password"
                required
              />
              <FormInput
                label="Phone"
                name="phone"
                value={child.phone}
                onChange={(e) => handleChildChange(index, e)}
                placeholder="Phone"
              />
              <FormInput
                label="Address"
                name="address"
                value={child.address}
                onChange={(e) => handleChildChange(index, e)}
                placeholder="Student Address"
                required
              />
              <DateInput
                label="Date of Birth"
                name="dateOfBirth"
                value={child.dateOfBirth}
                onChange={(e) => handleChildChange(index, e)}
                placeholder="Select Date"
              />
              <FormDropdown
                label="Gender"
                name="gender"
                value={child.gender}
                onChange={(e) => handleChildChange(index, e)}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
                placeholder="Select Gender"
              />
              <DateInput
                label="Enroll Date"
                name="enrollDate"
                value={child.enrollDate}
                onChange={(e) => handleChildChange(index, e)}
                placeholder="Select Date"
              />
              <FormInput
                label="Fee"
                name="fee"
                type="number"
                value={child.fee}
                onChange={(e) => handleChildChange(index, e)}
                placeholder="0.00"
              />
              <FormDropdown
                label="Class"
                name="class"
                value={child.class}
                onChange={(e) => handleChildChange(index, e)}
                options={classOptions}
                placeholder={
                  classesLoading ? "Loading classes..." : "Select Class"
                }
                className={
                  classesLoading ? "opacity-50 cursor-not-allowed" : ""
                }
              />
              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  name="addToWaitList"
                  checked={child.addToWaitList}
                  onChange={(e) => handleChildChange(index, e)}
                  className="rounded border-gray-300 text-[#0B4B31] focus:ring-[#0B4B31]"
                />
                <label className="text-sm font-semibold text-gray-700">
                  Add Student To Waiting List
                </label>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={addMoreStudents}
            className="flex-1 rounded-full bg-[#E5EFEB] px-6 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE]"
          >
            Add More Students
          </button>
          <button
            type="submit"
            disabled={
              status === "loading" ||
              isProcessing ||
              classesLoading
            }
            className="flex-1 rounded-full bg-[#0B4B31] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing
              ? "Processing Payment..."
              : status === "loading"
              ? "Adding Family..."
              : "Add Family & Setup Payment"}
          </button>
        </div>
      </form>
    </>
  );
}

export default function AddParentForm() {
  return (
    <Elements stripe={stripePromise}>
      <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-10 py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <AddParentFormContent />
      </div>
    </Elements>
  );
}