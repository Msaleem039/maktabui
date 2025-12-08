"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MessageSquare, Phone, CreditCard } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
// import { processCardPaymentAction } from "@/redux/slices/invoiceSlices/invoiceSlices";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51ST33BJVO0vFfpflc4DWY8yeQ544KDduqajZGHU0K8E9HByfBBrQmNLWjFd0wRkY3D5jFOAgHYswSZudeUBA2rgJ00Rs04VO1X");

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
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Test card: 4242 4242 4242 4242 | Exp: 12/34 | CVC: 123 | ZIP: 12345
      </p>
    </div>
  );
};

function PaymentPageContent({ params }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [cardComplete, setCardComplete] = useState(false);
  const [stripeError, setStripeError] = useState("");
  const [cardDetails, setCardDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processCardPaymentState = useSelector((state) => state.processCardPayment);
  const loading = processCardPaymentState?.loading ?? false;

  const parentInfo = {
    name: "Abdalla Mumin",
    phone: "612-636-6438",
    email: "abdalla@example.com",
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setStripeError(event.error ? event.error.message : "");

    if (event.complete) {
      setCardDetails({
        brand: event.brand,
        last4: event.last4,
        expMonth: event.exp_month,
        expYear: event.exp_year
      });
    } else {
      setCardDetails(null);
    }
  };

  const handleMakePayment = async () => {
    // Validate amount
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setStripeError("Please enter a valid amount");
      return;
    }

    if (!stripe || !elements) {
      setStripeError("Stripe hasn't loaded yet. Please try again.");
      return;
    }

    if (!cardComplete) {
      setStripeError("Please complete the card details");
      return;
    }

    setIsProcessing(true);
    setStripeError("");

    const cardElement = elements.getElement(CardElement);

    try {
      const { paymentMethod: pm, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: parentInfo.name,
          email: parentInfo.email,
          phone: parentInfo.phone,
        },
      });

      if (error) {
        setStripeError(`Payment error: ${error.message}`);
        setIsProcessing(false);
        return;
      }

      // const response = await dispatch(
      //   processCardPaymentAction({
      //     invoiceId: params.id,
      //     payload: {
      //       amount: parseFloat(amount),
      //       selectedDate,
      //       paymentMethodId: pm.id,
      //       cardDetails: {
      //         brand: pm.card.brand,
      //         last4: pm.card.last4,
      //         expMonth: pm.card.exp_month,
      //         expYear: pm.card.exp_year
      //       }
      //     }
      //   })
      // );

      if (!response.payload) {
        setIsProcessing(false);
        return;
      }

      if (response.payload.requiresAction) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          response.payload.clientSecret
        );

        if (confirmError) {
          setStripeError(confirmError.message);
          setIsProcessing(false);
          return;
        }
      }

      // router.push(`/dashboard/finance/invoice/${params.id}/payment-done`);

    } catch (error) {
      console.error('Payment error:', error);
      setStripeError(error.message || "An error occurred while processing your payment.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold text-[#0B4B31]">
            Welcome to
          </p>
          <h1 className="text-[1.75rem] font-medium text-[#000000]">
            MaktabOS
          </h1>
        </div>
      </div>

      {stripeError && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Payment Error:</p>
          <p>{stripeError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <section className="rounded-[28px] border border-[#E2E7E4] bg-white px-8 py-8 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">

            <div className="flex gap-2 mb-6">
              <button className="flex-1 rounded-full px-6 py-3 text-sm font-semibold bg-[#0B4B31] text-white">
                Card Payment
              </button>
            </div>

            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-full border border-[#C5D2CD] bg-white py-3 px-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
                  required
                />
              </div>

              {/* Card Input */}
              <StripeCardInput
                label="Credit Card Details"
                onCardChange={handleCardChange}
              />

              {/* Card Verification Status */}
              {cardDetails && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CreditCard size={16} className="text-green-600" />
                  <span className="text-green-700 text-sm font-medium">
                    Card verified: {cardDetails.brand.charAt(0).toUpperCase() + cardDetails.brand.slice(1)} ending in {cardDetails.last4}
                  </span>
                </div>
              )}

              {/* Date Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-full border border-[#C5D2CD] bg-white py-3 px-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
                  required
                />
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleMakePayment}
              disabled={isProcessing || loading || !cardComplete || !amount || !selectedDate}
              className="mt-8 w-full rounded-full bg-gradient-to-r from-[#0B4B31] to-[#1C6A45] px-6 py-4 text-sm font-semibold text-white transition disabled:bg-gray-400 disabled:cursor-not-allowed hover:from-[#0a3d26] hover:to-[#155536]"
            >
              {isProcessing || loading ? "Processing Payment..." : "Pay with Card"}
            </button>
          </section>
        </div>

        {/* Contact Card */}
        <div className="lg:col-span-1">
          <div className="rounded-[18px] border border-[#E2E7E4] bg-[#E5EFEB] px-6 py-8 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="relative h-24 w-24 mb-4">
                <Image
                  src="/user-icon.svg"
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-[#0B4B31] mb-2 text-center">
                {parentInfo.name}
              </h3>
              <p className="text-sm text-gray-600 mb-1">{parentInfo.phone}</p>
              <p className="text-sm text-gray-600 mb-6">{parentInfo.email}</p>
              <div className="w-full space-y-3">
                <button className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0B4B31] to-[#1C6A45] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                  <MessageSquare size={16} />
                  Send Message
                </button>
                <button className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0B4B31] to-[#1C6A45] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                  <Phone size={16} />
                  Call Parent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage({ params }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentPageContent params={params} />
    </Elements>
  );
}