'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';

const steps = [
  { num: 1, label: 'Verify ID' },
  { num: 2, label: 'Patient Info' },
  { num: 3, label: 'Payment' },
  { num: 4, label: 'Review' },
  { num: 5, label: 'Complete' },
];

export default function PatientRegistrationPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1
  const [nationalId, setNationalId] = useState('');
  const [idVerified, setIdVerified] = useState(false);
  const [verifiedInfo, setVerifiedInfo] = useState({ name: '', dob: '', ref: '' });

  // Step 2
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 3
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentTxId, setPaymentTxId] = useState('');

  // Step 5
  const [registeredPatient, setRegisteredPatient] = useState<any>(null);

  const verifyId = async () => {
    setLoading(true);
    setError('');
    // Mock verification
    await new Promise((r) => setTimeout(r, 1500));
    setIdVerified(true);
    setVerifiedInfo({
      name: 'Abebe Tadesse',
      dob: 'January 15, 1990',
      ref: `SEC-${Math.random().toString(36).substring(2, 7).toUpperCase()}-ETH`,
    });
    setLoading(false);
  };

  const processPayment = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPaymentComplete(true);
    setPaymentTxId(`TB-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
    setLoading(false);
  };

  const registerPatient = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.registerPatient({
        nationalId,
        email,
        phone,
        password,
        paymentRequired,
        amount: paymentRequired ? parseFloat(amount) : undefined,
        hospitalId: user?.hospitalId,
      });
      setRegisteredPatient(res.data);
      setCurrentStep(5);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-tighter mb-1">
          Patients / <span className="font-bold text-primary">Register New Patient</span>
        </p>
        <h2 className="text-3xl font-headline font-bold text-primary mb-2">New Patient Enrollment</h2>
        <p className="text-on-surface-variant text-sm">
          Initiate the sovereign identity protocol for clinical admission.
        </p>
      </div>

      {/* Step Progress */}
      <div className="bg-surface-container-lowest p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep > step.num
                    ? 'bg-primary-container text-white'
                    : currentStep === step.num
                    ? 'bg-primary-container text-white ring-2 ring-gold/30'
                    : 'bg-surface-container text-outline'
                }`}>
                  {currentStep > step.num ? (
                    <span className="material-symbols-outlined text-sm">check</span>
                  ) : (
                    step.num
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  currentStep >= step.num ? 'text-primary' : 'text-outline'
                }`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 h-[2px] mx-4 ${
                  currentStep > step.num ? 'bg-primary-container' : 'bg-outline-variant/30'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-container text-error text-sm rounded flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      {/* Step Content */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-surface-container-lowest p-8 shadow-sm">
            <h3 className="text-xl font-headline font-bold text-primary mb-2">Verify National ID</h3>
            <p className="text-on-surface-variant text-sm mb-8">
              Enter the patient&apos;s national identification number to verify their identity through the Sovereign Registry.
            </p>
            <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Identification Number
            </label>
            <div className="relative mb-6">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">badge</span>
              <input
                type="text"
                placeholder="Enter National ID (e.g., ET-1234567890)"
                className="w-full pl-10 pr-4 py-4 border border-outline-variant/30 focus:border-primary focus:ring-0 text-on-surface font-medium bg-transparent"
                value={nationalId}
                onChange={(e) => { setNationalId(e.target.value); setIdVerified(false); }}
              />
            </div>
            <button
              onClick={verifyId}
              disabled={!nationalId || loading}
              className="w-full bg-primary-container text-white py-4 font-headline font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined">verified_user</span>
              )}
              {loading ? 'Verifying...' : 'Verify Identity'}
            </button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {idVerified && (
              <div className="bg-surface-container-lowest p-6 shadow-sm border-l-4 border-primary-container">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary-container">check_circle</span>
                  <h4 className="font-headline font-bold text-primary">Identity Verified</h4>
                </div>
                <p className="font-mono text-[10px] text-on-surface-variant mb-4">REF: {verifiedInfo.ref}</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Full Legal Name</span>
                    <span className="text-sm font-semibold text-primary">{verifiedInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Date of Birth</span>
                    <span className="text-sm font-semibold text-primary">{verifiedInfo.dob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Registry Status</span>
                    <span className="px-2 py-0.5 bg-primary-container/10 text-primary-container text-[10px] font-bold uppercase">Valid</span>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-surface-container-low/50 p-4 border-l-4 border-outline-variant/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-sm text-outline">info</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Privacy Notice</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Identity verification is conducted through the Ministry of Health&apos;s centralized ledger. This action is logged for security auditing.
              </p>
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="max-w-2xl mx-auto bg-surface-container-lowest p-8 shadow-sm">
          <h3 className="text-xl font-headline font-bold text-primary mb-6">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" placeholder="patient@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Phone</label>
              <input type="tel" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" placeholder="+251 911 112 233" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Password</label>
              <input type="password" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Confirm Password</label>
              <input type="password" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto bg-surface-container-lowest p-8 shadow-sm">
          <h3 className="text-xl font-headline font-bold text-primary mb-6">Payment</h3>
          <div className="flex items-center gap-4 mb-8">
            <label className="text-sm font-medium text-on-surface">Registration fee required?</label>
            <button
              onClick={() => setPaymentRequired(!paymentRequired)}
              className={`relative w-12 h-6 rounded-full transition-colors ${paymentRequired ? 'bg-primary-container' : 'bg-outline-variant'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${paymentRequired ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          {paymentRequired ? (
            <div className="space-y-6">
              <div>
                <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Amount (ETB)</label>
                <input type="number" className="w-full px-4 py-3 border border-outline-variant/30 focus:border-primary focus:ring-0 text-2xl font-headline font-bold" placeholder="500" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              {!paymentComplete ? (
                <button onClick={processPayment} disabled={!amount || loading} className="w-full bg-primary-container text-white py-4 font-headline font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-colors disabled:opacity-50">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined">payment</span>}
                  {loading ? 'Processing...' : 'Pay via TeleBirr'}
                </button>
              ) : (
                <div className="p-4 bg-primary-container/5 border border-primary-container/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary-container">check_circle</span>
                    <span className="font-headline font-bold text-primary">Payment Successful</span>
                  </div>
                  <p className="font-mono text-xs text-on-surface-variant">Transaction ID: {paymentTxId}</p>
                  <p className="font-mono text-xs text-on-surface-variant">Amount: {amount} ETB</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-surface-container-low/50 border border-outline-variant/20">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">skip_next</span>
              <p className="text-on-surface-variant font-medium">No payment required for this registration</p>
            </div>
          )}
        </div>
      )}

      {currentStep === 4 && (
        <div className="max-w-2xl mx-auto bg-surface-container-lowest p-8 shadow-sm">
          <h3 className="text-xl font-headline font-bold text-primary mb-6">Review & Confirm</h3>
          <div className="space-y-6">
            <div className="p-4 border border-outline-variant/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-sm text-primary-container">check_circle</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Identity Verification</span>
              </div>
              <p className="text-sm">National ID: <span className="font-mono font-bold">{nationalId}</span></p>
              <p className="text-sm">Name: <span className="font-semibold">{verifiedInfo.name}</span></p>
            </div>
            <div className="p-4 border border-outline-variant/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-sm text-primary-container">check_circle</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Patient Information</span>
              </div>
              <p className="text-sm">Email: {email}</p>
              <p className="text-sm">Phone: {phone}</p>
            </div>
            <div className="p-4 border border-outline-variant/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-sm text-primary-container">check_circle</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Payment</span>
              </div>
              <p className="text-sm">{paymentRequired ? `Paid: ${amount} ETB (${paymentTxId})` : 'Skipped'}</p>
            </div>
          </div>
          <button
            onClick={registerPatient}
            disabled={loading}
            className="w-full mt-8 bg-primary text-white py-5 font-headline font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary-container transition-colors ring-2 ring-gold/20 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
            {loading ? 'Registering...' : 'Register Patient'}
          </button>
        </div>
      )}

      {currentStep === 5 && registeredPatient && (
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-surface-container-lowest p-12 shadow-sm mb-8">
            <div className="w-20 h-20 bg-primary-container/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl text-primary-container">check_circle</span>
            </div>
            <h3 className="text-2xl font-headline font-bold text-primary mb-2">Patient Registered Successfully!</h3>
            <p className="text-on-surface-variant mb-8">The patient has been registered in the EthioChart system</p>
            <div className="inline-block bg-primary-container/5 border-2 border-primary-container/20 px-8 py-4 mb-6">
              <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">EthioChart ID</p>
              <p className="font-mono text-3xl font-bold text-primary-container">{registeredPatient.ethioChartId}</p>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={() => { setCurrentStep(1); setNationalId(''); setIdVerified(false); setEmail(''); setPhone(''); setPassword(''); setPaymentRequired(false); }} className="px-6 py-3 border border-primary-container text-primary-container font-headline font-semibold hover:bg-primary-container/5 transition-colors">
              Register Another
            </button>
            <button onClick={() => router.push(`/admin/patients/${registeredPatient.id}`)} className="px-6 py-3 bg-primary-container text-white font-headline font-semibold hover:bg-primary transition-colors">
              View Patient
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      {currentStep > 1 && currentStep < 5 && (
        <div className="flex justify-between mt-8">
          <button onClick={() => setCurrentStep(currentStep - 1)} className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-headline font-medium transition-colors">
            <span className="material-symbols-outlined">arrow_back</span> Back
          </button>
          {currentStep < 4 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={
                (currentStep === 2 && (!email || !phone || !password || password !== confirmPassword)) ||
                (currentStep === 3 && paymentRequired && !paymentComplete)
              }
              className="flex items-center gap-2 bg-primary-container text-white px-8 py-3 font-headline font-semibold hover:bg-primary transition-colors disabled:opacity-50"
            >
              Next Step <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          )}
        </div>
      )}
      {currentStep === 1 && (
        <div className="flex justify-between mt-8">
          <button disabled className="flex items-center gap-2 text-outline cursor-not-allowed font-headline font-medium">
            <span className="material-symbols-outlined">arrow_back</span> Back
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            disabled={!idVerified}
            className="flex items-center gap-2 bg-primary-container text-white px-8 py-3 font-headline font-semibold hover:bg-primary transition-colors disabled:opacity-50"
          >
            Next Step <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      )}
    </>
  );
}
