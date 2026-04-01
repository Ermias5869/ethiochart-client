'use client';
const bills = [
  { description: 'Cardiology Consultation', date: 'Oct 24, 2023', amount: 500, status: 'pending' },
  { description: 'Lab Tests - CBC', date: 'Oct 20, 2023', amount: 350, status: 'pending' },
  { description: 'General Checkup', date: 'Oct 10, 2023', amount: 200, status: 'paid' },
  { description: 'Prescription - Amoxicillin', date: 'Sep 15, 2023', amount: 150, status: 'paid' },
];
export default function PatientBillsPage() {
  const total = bills.filter(b => b.status === 'pending').reduce((s, b) => s + b.amount, 0);
  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-2">My Bills</h2>
      <p className="text-sm text-on-surface-variant mb-8">View and manage your medical bills</p>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-gold"><p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Pending Amount</p><h3 className="text-3xl font-headline font-bold text-on-tertiary-container">{total.toLocaleString()} <span className="text-sm font-normal">ETB</span></h3></div>
        <div className="bg-surface-container-lowest p-6 shadow-sm border-b-2 border-primary-container"><p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Total Paid</p><h3 className="text-3xl font-headline font-bold text-primary-container">{bills.filter(b=>b.status==='paid').reduce((s,b)=>s+b.amount,0).toLocaleString()} <span className="text-sm font-normal">ETB</span></h3></div>
      </div>
      <div className="bg-surface-container-lowest shadow-sm">
        {bills.map((b,i) => (
          <div key={i} className="flex items-center justify-between p-6 border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
            <div><p className="font-semibold text-sm">{b.description}</p><p className="text-xs text-on-surface-variant">{b.date}</p></div>
            <div className="flex items-center gap-4">
              <p className="font-headline font-bold text-primary">{b.amount.toLocaleString()} ETB</p>
              <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${b.status==='paid'?'bg-primary-container/10 text-primary-container':'bg-gold/10 text-on-tertiary-container'}`}>{b.status}</span>
              {b.status === 'pending' && <button className="px-4 py-2 bg-primary-container text-white text-xs font-semibold hover:bg-primary transition-colors">Pay Now</button>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
