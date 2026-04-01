'use client';

import { useState } from 'react';

export default function AiAssistantPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const queryHistory = [
    { title: 'Drug Contraindication', date: 'OCT 24, 2023' },
    { title: 'Lab Result Analysis', date: 'OCT 22, 2023' },
    { title: 'Treatment Protocol', date: 'OCT 15, 2023' },
  ];

  const quickActions = ['Summarize History', 'Verify Dosages', 'Check Lab Trends'];

  return (
    <>
      <h2 className="text-2xl font-headline font-bold text-primary mb-8">AI Clinical Assistant</h2>
      <div className="flex h-[calc(100vh-14rem)] gap-6">
        {/* Left Sidebar */}
        <div className="w-72 flex flex-col">
          <div className="bg-surface-container-lowest p-4 shadow-sm mb-4">
            <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Select Patient</label>
            <select className="w-full px-3 py-2 border border-outline-variant/30 text-sm focus:border-primary focus:ring-0">
              <option>Abebe Tadesse [EC-M5K2XRPA]</option>
              <option>Martha Kassaye [EC-M8827-F]</option>
            </select>
          </div>
          <div className="bg-surface-container-lowest p-4 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Query History</h3>
              <span className="material-symbols-outlined text-sm text-outline">history</span>
            </div>
            <div className="space-y-2">
              {queryHistory.map((q, i) => (
                <button key={i} className="w-full text-left p-3 border border-outline-variant/20 hover:border-primary/30 transition-colors">
                  <p className="text-sm font-semibold text-on-surface">{q.title}</p>
                  <p className="font-mono text-[10px] text-on-surface-variant">{q.date}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-primary-container/5 border border-primary-container/20 p-4 mt-4">
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Model Reliability</p>
            <p className="text-3xl font-headline font-bold text-primary-container">99.4% <span className="text-xs font-normal text-on-surface-variant">Verified</span></p>
          </div>
        </div>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col bg-surface-container-lowest shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center"><span className="material-symbols-outlined text-gold">smart_toy</span></div>
              <div>
                <p className="font-semibold text-sm">AI Clinical Assistant</p>
                <p className="text-[10px] text-on-surface-variant">Active Session: Abebe Tadesse [EC-M5K2XRPA]</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-primary-fixed-dim text-[10px] font-bold uppercase"><span className="w-2 h-2 rounded-full bg-primary-fixed-dim animate-pulse" />System Live</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="bg-gold/5 border-l-4 border-gold p-4 flex gap-2 items-start">
              <span className="material-symbols-outlined text-gold text-sm mt-0.5">warning</span>
              <p className="text-xs text-on-surface-variant italic">AI-assisted analysis. This tool is designed for clinical decision support. Always apply independent clinical judgment and verify results against official protocols.</p>
            </div>

            <div className="bg-surface-container-low/50 p-4 rounded-lg">
              <p className="text-sm italic text-primary">&quot;Check contraindications between Metformin and his new prescription for Lisinopril.&quot;</p>
            </div>

            <div className="border border-outline-variant/20 p-6">
              <div className="flex items-center justify-between mb-4 bg-primary-container text-white px-4 py-2 -mx-6 -mt-6">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"><span className="material-symbols-outlined text-sm">psychology</span>Clinical Interaction Analysis</span>
                <span className="font-mono text-[10px]">ID: REF-0092-X</span>
              </div>
              <p className="text-sm mb-4">No direct major contraindication found between <strong>Metformin</strong> and <strong>Lisinopril</strong> for this patient. However, concurrent use requires monitoring for potential additive hypotensive effects or changes in renal function.</p>
              <p className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Clinical Recommendations</p>
              <div className="space-y-2">
                {['Monitor serum creatinine and potassium levels within 1 week.', 'Observe for signs of orthostatic hypotension.', 'Continue Metformin as prescribed.'].map((r, i) => (
                  <p key={i} className="flex items-center gap-2 text-sm"><span className="material-symbols-outlined text-primary-container text-sm">check_circle</span>{r}</p>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                <div><p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Model Confidence</p><div className="w-48 h-2 bg-surface-container rounded-full mt-1"><div className="h-full bg-primary-container rounded-full" style={{width:'85%'}} /></div></div>
                <span className="font-headline font-bold text-primary">85%</span>
              </div>
              <p className="text-[10px] text-on-surface-variant italic mt-4">Data sources: Institutional Clinical Guidelines, WHO Pharmacopeia. Timestamp: 10:45 AM</p>
            </div>
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-outline-variant/20">
            <div className="flex items-end gap-3 mb-3">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about this patient's condition, drug interactions, or diagnostic possibilities..."
                className="flex-1 px-4 py-3 border border-outline-variant/30 text-sm focus:border-primary focus:ring-0 resize-none h-20"
              />
              <button className="px-6 py-3 bg-primary text-white font-headline font-semibold text-sm flex items-center gap-2 hover:bg-primary-container transition-colors">
                Ask AI <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
            <div className="flex gap-4">
              {quickActions.map((a) => (
                <button key={a} className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider hover:text-primary transition-colors">{a}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
