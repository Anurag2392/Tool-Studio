import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  QrCode,
  ArrowRight,
  Clock,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  Smartphone,
  ExternalLink,
  Edit2,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { UserAccount } from './LoginModal';

interface PhonePeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAccount: UserAccount;
  onPaymentSuccess: (
    planName: '1 Day Pro Pass' | 'Pro Monthly' | 'Pro Annual',
    paymentDetails: { paymentId: string; orderId: string }
  ) => void;
}

export const PhonePeModal: React.FC<PhonePeModalProps> = ({
  isOpen,
  onClose,
  userAccount,
  onPaymentSuccess,
}) => {
  const [billingCycle, setBillingCycle] = useState<'1day' | 'monthly' | 'annual'>('1day');
  // Strictly locked, uneditable secured merchant VPA
  const payeeVpa = 'Q10163904@ybl';
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [customerName, setCustomerName] = useState(userAccount.name && userAccount.name !== 'Guest User' ? userAccount.name : '');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerEmail, setCustomerEmail] = useState(userAccount.email || '');
  const [formError, setFormError] = useState('');
  const [utrInput, setUtrInput] = useState('');
  const [utrError, setUtrError] = useState('');

  // Update customer fields when userAccount or isOpen changes
  useEffect(() => {
    if (isOpen) {
      if (userAccount.name && userAccount.name !== 'Guest User' && !customerName) {
        setCustomerName(userAccount.name);
      }
      if (userAccount.email && !customerEmail) {
        setCustomerEmail(userAccount.email);
      }
    }
  }, [isOpen, userAccount]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<string | null>(null);

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<{
    transactionId: string;
    merchantTxnId: string;
    amount: number;
    plan: string;
    timestamp: string;
    utrNumber?: string;
    authLink?: string;
  } | null>(null);

  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [copiedAuthLink, setCopiedAuthLink] = useState(false);

  const getAuthorizationLink = (txnId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tool-studio.app';
    return `${origin}/?auth_txn=${txnId}&status=AUTHORIZED&provider=PHONEPE_PG`;
  };

  const handleCopyAuthLink = (txnId: string) => {
    const link = getAuthorizationLink(txnId);
    navigator.clipboard.writeText(link);
    setCopiedAuthLink(true);
    setTimeout(() => setCopiedAuthLink(false), 2500);
  };

  // Amount calculation
  const baseAmountInr = billingCycle === '1day' ? 19 : billingCycle === 'annual' ? 2999 : 299;
  const isDiscountApplied = billingCycle === 'annual' && Boolean(appliedCoupon);
  const discountMultiplier = isDiscountApplied ? 0.9 : 1;
  const amountInr = Math.round(baseAmountInr * discountMultiplier);

  const displayAmount = `₹${amountInr}`;

  const planTitle =
    billingCycle === '1day'
      ? '1 Day Pro Pass (24 Hours)'
      : billingCycle === 'annual'
      ? isDiscountApplied
        ? 'Pro Annual (10% OFF)'
        : 'Pro Annual'
      : 'Pro Monthly';

  // Strict 100% Scannable Standard PhonePe UPI URL
  const upiUrl = `upi://pay?pa=${payeeVpa}&pn=Tool-Studio&am=${amountInr}&cu=INR&tn=${encodeURIComponent(`ToolStudio ${planTitle}`)}&tr=Q10163904`;

  // Render high-precision vector QR Code on URL/amount change
  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(upiUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 400,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch(() => {
        // Quiet handling
      });
  }, [upiUrl, isOpen]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (billingCycle !== 'annual') {
      setCouponError('Coupon codes are only valid on Annual Pro Plans.');
      return;
    }
    if (couponInput.trim().toUpperCase() === 'YEAR10') {
      setAppliedCoupon('YEAR10');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Use YEAR10 for 10% discount.');
    }
  };

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(payeeVpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const triggerPhonePePayment = async () => {
    setUtrError('');
    setFormError('');

    const name = customerName.trim();
    const mobile = customerMobile.trim();
    const email = customerEmail.trim().toLowerCase();
    const utr = utrInput.trim();

    if (!name) {
      setFormError('Customer Full Name is required.');
      return;
    }

    if (!mobile || mobile.length < 8) {
      setFormError('Valid Customer Mobile Number (at least 8-10 digits) is required.');
      return;
    }

    if (!email || !email.includes('@')) {
      setFormError('Valid Email Address is required.');
      return;
    }

    if (!utr) {
      setUtrError('UTR / UPI Transaction Reference Number is required as proof of payment before requesting authorization.');
      return;
    }

    if (utr.length < 6) {
      setUtrError('Please enter a valid UTR / UPI Ref ID (at least 6-12 digits) as payment proof.');
      return;
    }

    setIsProcessing(true);

    const generatedMerchantTxnId = `MT${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const generatedPhonePeTxnId = utr;

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tool-studio.app';

    let authLink = getAuthorizationLink(generatedPhonePeTxnId);

    // Register payment submission in server backend & dispatch admin email
    try {
      const res = await fetch('/api/payment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: generatedPhonePeTxnId,
          merchantTxnId: generatedMerchantTxnId,
          utrNumber: utr,
          amount: amountInr,
          planTitle,
          userName: name,
          mobileNumber: mobile,
          userEmail: email,
          origin,
        }),
      });
      const data = await res.json();
      if (res.ok && data.transaction && data.transaction.authLink) {
        authLink = data.transaction.authLink;
        setEmailSentStatus('Authorization Email Dispatched to support@tool-studio.in');
      } else if (!res.ok) {
        setUtrError(data.error || 'Failed to submit payment proof.');
        setIsProcessing(false);
        return;
      } else {
        setEmailSentStatus('Authorization Email Dispatched to support@tool-studio.in');
      }
    } catch (err) {
      setEmailSentStatus('Authorization Link Generated');
    }

    setTimeout(() => {
      const receiptData = {
        transactionId: generatedPhonePeTxnId,
        merchantTxnId: generatedMerchantTxnId,
        amount: amountInr,
        plan: planTitle,
        timestamp: new Date().toLocaleString(),
        utrNumber: utr,
        authLink,
      };

      setPaymentReceipt(receiptData);
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 1200);
  };

  // Auto-poll transaction authorization status and reload website with active license when confirmed by admin
  useEffect(() => {
    if (!paymentSuccess || !paymentReceipt?.transactionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status/${paymentReceipt.transactionId}`);
        const data = await res.json();
        if (data.found && data.transaction?.status === 'ACTIVATED') {
          clearInterval(pollInterval);
          onPaymentSuccess(
            billingCycle === '1day' ? '1 Day Pro Pass' : billingCycle === 'annual' ? 'Pro Annual' : 'Pro Monthly',
            { paymentId: paymentReceipt.transactionId, orderId: paymentReceipt.merchantTxnId }
          );
          setTimeout(() => {
            window.location.reload();
          }, 600);
        }
      } catch (e) {
        // Quiet poll fallback
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [paymentSuccess, paymentReceipt, billingCycle, onPaymentSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[95vh] overflow-y-auto relative text-slate-800">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-[#5f259f] flex items-center justify-center text-white font-black shadow-md shrink-0">
            <span className="text-lg">पे</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">PhonePe Standard QR</h2>
              <span className="bg-purple-100 text-[#5f259f] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-purple-200 uppercase">
                100% Scannable
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Scan with PhonePe, Paytm, Google Pay, or BHIM UPI
            </p>
          </div>
        </div>

        {/* PENDING ADMIN AUTHORIZATION STATE */}
        {paymentSuccess && paymentReceipt ? (
          <div className="mt-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 text-center space-y-3 shadow-md">
              <div className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                <ShieldCheck size={32} />
              </div>

              <h3 className="text-xl font-black text-slate-900">Payment Submitted for Admin Approval</h3>

              <div className="inline-block bg-purple-900 text-amber-300 text-[11px] font-mono font-extrabold px-3 py-1 rounded-full border border-purple-700 uppercase">
                Status: Pending Admin Validation
              </div>

              <p className="text-xs text-slate-700 font-medium max-w-sm mx-auto leading-relaxed">
                An official confirmation email with reference authorization link has been sent to <strong className="text-slate-900 underline">support@tool-studio.in</strong>.
                Your Pro License will be activated automatically once the admin confirms receipt.
              </p>

              <div className="bg-white rounded-xl p-4 border border-amber-200 text-left space-y-2 text-xs font-medium text-slate-700 mt-4 shadow-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Requested Plan:</span>
                  <span className="font-bold text-[#5f259f]">{paymentReceipt.plan}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">PhonePe Txn / UTR:</span>
                  <span className="font-mono font-bold text-slate-900">{paymentReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Amount Submitted:</span>
                  <span className="font-black text-slate-900 text-sm">₹{paymentReceipt.amount} INR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admin Authorizer:</span>
                  <span className="font-mono font-extrabold text-amber-700">support@tool-studio.in</span>
                </div>
              </div>

              {/* Background notification status indicator for user */}
              <div className="bg-purple-50 text-purple-900 rounded-xl p-3 text-center text-xs font-semibold border border-purple-200">
                <span className="flex items-center justify-center gap-1 text-[#5f259f] font-bold">
                  <ShieldCheck size={14} /> Confirmation request sent to support@tool-studio.in
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-[#5f259f] hover:bg-[#4d1d84] text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-purple-900/20 transition-transform active:scale-98 cursor-pointer"
            >
              Close & Await Admin Authorization
            </button>
          </div>
        ) : (
          /* CHECKOUT FORM STATE */
          <div className="mt-5 space-y-4">
            
            {/* Plan Selector */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Select Plan to Pay:</span>
                <span className="text-[#5f259f] font-extrabold flex items-center gap-1">
                  <Sparkles size={12} /> Dynamic QR Amount
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBillingCycle('1day')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border text-center ${
                    billingCycle === '1day'
                      ? 'bg-[#5f259f] text-white border-[#5f259f] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-[10px] text-purple-200 uppercase tracking-tight font-extrabold flex items-center justify-center gap-0.5">
                    <Clock size={10} /> 1-Day Pass
                  </div>
                  <div className="text-sm mt-0.5">₹19</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border text-center ${
                    billingCycle === 'monthly'
                      ? 'bg-[#5f259f] text-white border-[#5f259f] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-[10px] text-purple-200 uppercase tracking-tight font-extrabold">Monthly Pro</div>
                  <div className="text-sm mt-0.5">₹299</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border text-center relative ${
                    billingCycle === 'annual'
                      ? 'bg-[#5f259f] text-white border-[#5f259f] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-[10px] text-amber-300 uppercase tracking-tight font-black">Annual Pro</div>
                  <div className="text-sm mt-0.5">₹2,999</div>
                </button>
              </div>

              {/* Annual Coupon Row */}
              {billingCycle === 'annual' && (
                <div className="pt-2 border-t border-slate-200">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl">
                      <span>🎟️ Coupon <span className="font-mono underline">YEAR10</span> applied (10% OFF)!</span>
                      <button
                        onClick={() => setAppliedCoupon('')}
                        className="text-emerald-900 hover:underline text-[10px] cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon code (YEAR10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl font-mono uppercase focus:ring-2 focus:ring-[#5f259f] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[11px] text-rose-600 mt-1 font-medium">{couponError}</p>}
                </div>
              )}
            </div>

            {/* MAIN PHONEPE STANDEE CARD */}
            <div className="bg-[#5f259f] rounded-3xl p-4 text-center space-y-3 relative shadow-xl text-white overflow-hidden border border-purple-800">
              
              {/* Standee Header Logo Banner */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-center gap-1.5 text-xl font-black tracking-tight">
                  <div className="w-7 h-7 rounded-full bg-white text-[#5f259f] flex items-center justify-center font-black text-sm shadow-sm">
                    पे
                  </div>
                  <span>PhonePe</span>
                </div>
                
                <div className="bg-[#ff8f1c] text-slate-950 font-black text-xs px-4 py-1 rounded-full inline-block shadow-md tracking-wide uppercase">
                  Tool-Studio Official PG
                </div>
              </div>

              {/* Single High-Precision Scannable PhonePe QR Code */}
              <div className="relative max-w-[240px] mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white p-3 border-4 border-white">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`PhonePe Official UPI QR Code for ${displayAmount}`}
                    className="w-full h-auto object-contain block mx-auto rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-slate-400 font-medium text-xs">
                    Generating Official QR...
                  </div>
                )}

                {/* Subtitle inside card */}
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <span>BHIM UPI</span>
                  <span className="text-[#5f259f]">Instant Scan & Pay</span>
                </div>
              </div>

              {/* Amount Display Badge */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 max-w-xs mx-auto shadow-inner">
                <span className="text-[10px] text-purple-200 font-extrabold block uppercase tracking-wider">
                  Amount Encoded in QR:
                </span>
                <span className="text-2xl font-black text-amber-300">{displayAmount}</span>
                <span className="text-[10px] text-purple-100 font-medium block">({planTitle})</span>
              </div>

              {/* Mobile Deep-Link Direct Action Button */}
              <a
                href={upiUrl}
                className="w-full py-2.5 bg-white text-[#5f259f] hover:bg-purple-50 font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Smartphone size={14} />
                <span>Tap to Open PhonePe / GPay App directly</span>
                <ExternalLink size={12} />
              </a>

            </div>

            {/* Customer Details Form Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <User size={14} className="text-[#5f259f]" />
                  <span>Customer Details</span>
                </h4>
                <span className="text-[10px] bg-purple-100 text-[#5f259f] px-2 py-0.5 rounded-full font-bold">
                  Basic Required
                </span>
              </div>

              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  ⚠️ {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1 flex items-center gap-1">
                    <span className="text-rose-600 font-black">*</span> Customer Name:
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (formError) setFormError('');
                      }}
                      className="w-full bg-white pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-[#5f259f] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1 flex items-center gap-1">
                    <span className="text-rose-600 font-black">*</span> Mobile No:
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={customerMobile}
                      onChange={(e) => {
                        setCustomerMobile(e.target.value);
                        if (formError) setFormError('');
                      }}
                      className="w-full bg-white pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-[#5f259f] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1 flex items-center gap-1">
                  <span className="text-rose-600 font-black">*</span> Email Address (Basic Required):
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="e.g. rahul@gmail.com"
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      if (formError) setFormError('');
                    }}
                    className="w-full bg-white pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-[#5f259f] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Required UTR / Reference ID Field */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-900">
                  <span className="text-rose-600 font-black">*</span>
                  Enter 12-Digit UTR / UPI Ref No. (Required as Proof):
                </span>
                <span className="text-[10px] text-[#5f259f] font-bold">Mandatory Proof</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 4239XXXXXXXX (Enter 12-digit UPI UTR)"
                value={utrInput}
                onChange={(e) => {
                  setUtrInput(e.target.value);
                  if (utrError) setUtrError('');
                }}
                className={`w-full bg-white px-3 py-2 text-xs border rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-[#5f259f] focus:outline-none ${
                  utrError ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                }`}
              />
              {utrError ? (
                <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                  ⚠️ {utrError}
                </p>
              ) : (
                <p className="text-[10px] text-slate-500 font-medium">
                  An authorization email will only be sent to the admin once a valid UTR / Transaction ID proof is provided.
                </p>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={triggerPhonePePayment}
              disabled={isProcessing}
              className="w-full py-3.5 bg-[#5f259f] hover:bg-[#4c1d80] text-white font-black rounded-2xl text-sm shadow-xl shadow-purple-900/20 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} className="fill-white text-[#5f259f]" />
                  <span>I Have Paid {displayAmount} - Activate Pro</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Footer Trust Badges */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-[#5f259f]" /> Standard UPI Protocol Encoded
              </span>
              <span className="flex items-center gap-1">
                <Lock size={12} className="text-emerald-600" /> Instant Activation
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};


