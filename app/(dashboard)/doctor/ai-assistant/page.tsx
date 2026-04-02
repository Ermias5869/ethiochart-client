'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { api } from '@/lib/api';

type AiMode = 'patient' | 'general';

interface PatientOption {
  id: number;
  name: string;
  ethioChartId: string;
}

export default function DoctorAiAssistantPage() {
  const { user } = useAuthStore();
  const [mode, setMode] = useState<AiMode>('general');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Patient mode state
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientOption | null>(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(false);

  // History
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (mode === 'patient') {
      loadPatients();
    }
  }, [mode]);

  const loadPatients = async () => {
    setPatientsLoading(true);
    try {
      const res = await api.getPatients();
      setPatients(
        res.data.map((p: any) => ({
          id: p.id,
          name: p.fullName || p.email?.split('@')[0] || 'Patient',
          ethioChartId: p.ethioChartId,
        }))
      );
    } catch {}
    setPatientsLoading(false);
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;
    if (mode === 'patient' && !selectedPatient) {
      setError('Please select a patient first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let res;
      if (mode === 'patient') {
        res = await api.patientAiAssist({
          patientId: selectedPatient!.id,
          question: question.trim(),
        });
      } else {
        res = await api.generalAiQuery({
          question: question.trim(),
        });
      }
      setResult(res.data || res);
    } catch (err: any) {
      setError(err.message || 'AI request failed. Please try again.');
    }
    setLoading(false);
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.ethioChartId.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const parsed = result?.parsedResponse || (typeof result?.response === 'string' ? (() => { try { return JSON.parse(result.response); } catch { return null; } })() : result?.response);

  const quickPrompts = mode === 'patient'
    ? [
        'Summarize patient medical history',
        'Check for drug interactions',
        'Analyze recent lab results',
        'Suggest treatment plan',
        'Assess risk factors',
      ]
    : [
        'Differential diagnosis for persistent cough',
        'Latest guidelines for hypertension management',
        'Drug interactions: Metformin and ACE inhibitors',
        'Pediatric dosage calculator for Amoxicillin',
        'Treatment protocol for Type 2 Diabetes',
      ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
            <span className="material-symbols-outlined text-gold" style={{ fontSize: 28 }}>smart_toy</span>
            AI Clinical Assistant
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">Powered by Google Gemini — Dual-mode medical intelligence</p>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="px-4 py-2 border border-outline-variant/30 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>history</span>
          {showHistory ? 'Hide History' : 'View History'}
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="bg-surface-container-lowest p-2 shadow-sm mb-8 flex">
        <button
          onClick={() => { setMode('patient'); setResult(null); setError(''); }}
          className={`flex-1 py-3 px-6 font-headline font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            mode === 'patient'
              ? 'bg-primary-container text-white shadow-md'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>person_search</span>
          Patient AI
        </button>
        <button
          onClick={() => { setMode('general'); setResult(null); setError(''); setSelectedPatient(null); }}
          className={`flex-1 py-3 px-6 font-headline font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            mode === 'general'
              ? 'bg-primary-container text-white shadow-md'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>school</span>
          General Medical AI
        </button>
      </div>

      {/* Mode Description */}
      <div className={`p-4 mb-6 border-l-4 ${mode === 'patient' ? 'border-primary-container bg-primary-container/5' : 'border-gold bg-gold/5'}`}>
        <p className="text-sm text-on-surface">
          {mode === 'patient'
            ? '🩺 Patient AI uses the selected patient\'s medical history, lab results, and medications to provide clinical insights.'
            : '📚 General Medical AI provides evidence-based medical knowledge without any patient-specific data.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Selector (only in patient mode) */}
          {mode === 'patient' && (
            <div className="bg-surface-container-lowest p-6 shadow-sm">
              <h3 className="text-sm font-headline font-semibold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
                Select Patient
              </h3>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: 18 }}>search</span>
                <input
                  value={patientSearch}
                  onChange={(e) => { setPatientSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search patient by name or EthioChart ID..."
                  className="w-full pl-10 pr-4 py-3 border border-outline-variant/30 text-sm focus:border-primary focus:ring-0 focus:outline-none"
                />
                {showDropdown && patientSearch && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-outline-variant/30 shadow-lg max-h-48 overflow-y-auto z-20">
                    {patientsLoading ? (
                      <div className="p-4 text-center"><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
                    ) : filteredPatients.length === 0 ? (
                      <p className="p-4 text-sm text-on-surface-variant text-center">No patients found</p>
                    ) : (
                      filteredPatients.slice(0, 8).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => { setSelectedPatient(p); setPatientSearch(p.name); setShowDropdown(false); }}
                          className="w-full text-left px-4 py-3 hover:bg-primary/5 flex items-center justify-between transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-sm">{p.name}</p>
                            <p className="font-mono text-[10px] text-primary">{p.ethioChartId}</p>
                          </div>
                          {selectedPatient?.id === p.id && <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>check_circle</span>}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {selectedPatient && (
                <div className="mt-3 px-4 py-3 bg-primary-container/5 border border-primary-container/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">{selectedPatient.name.charAt(0)}</div>
                    <div><p className="font-semibold text-sm">{selectedPatient.name}</p><p className="font-mono text-[10px] text-primary">{selectedPatient.ethioChartId}</p></div>
                  </div>
                  <button onClick={() => { setSelectedPatient(null); setPatientSearch(''); }} className="text-error text-xs font-semibold">Clear</button>
                </div>
              )}
            </div>
          )}

          {/* Question Input */}
          <div className="bg-surface-container-lowest p-6 shadow-sm">
            <h3 className="text-sm font-headline font-semibold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{mode === 'patient' ? 'clinical_notes' : 'help'}</span>
              {mode === 'patient' ? 'Clinical Question' : 'Medical Question'}
            </h3>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={mode === 'patient' ? 'Ask about this patient\'s condition, treatment options, drug interactions...' : 'Ask any medical question — diagnosis, treatment protocols, drug info...'}
              className="w-full h-32 p-4 border border-outline-variant/30 text-sm focus:border-primary focus:ring-0 focus:outline-none resize-none"
            />

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickPrompts.map((p) => (
                <button key={p} onClick={() => setQuestion(p)} className="px-3 py-1.5 bg-surface-container-low text-[11px] text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors truncate max-w-[220px]">
                  {p}
                </button>
              ))}
            </div>

            {error && <p className="mt-3 text-sm text-error flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || !question.trim() || (mode === 'patient' && !selectedPatient)}
              className={`mt-4 w-full py-3 font-headline font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                loading || !question.trim() || (mode === 'patient' && !selectedPatient)
                  ? 'bg-outline/20 text-on-surface-variant cursor-not-allowed'
                  : 'bg-primary-container text-white hover:bg-primary'
              }`}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Analyzing...</>
              ) : (
                <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>neurology</span>Ask AI</>
              )}
            </button>
          </div>

          {/* Results */}
          {parsed && (
            <div className="bg-surface-container-lowest shadow-sm border-t-4 border-gold">
              <div className="p-6 border-b border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline font-semibold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-gold" style={{ fontSize: 20 }}>auto_awesome</span>
                    AI Analysis
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${mode === 'patient' ? 'bg-primary-container/10 text-primary-container' : 'bg-gold/10 text-on-tertiary-container'}`}>
                      {mode === 'patient' ? 'Patient Mode' : 'General Mode'}
                    </span>
                    {parsed.confidence !== undefined && (
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        parsed.confidence >= 70 ? 'bg-primary-container/10 text-primary-container' : parsed.confidence >= 40 ? 'bg-gold/10 text-on-tertiary-container' : 'bg-error-container text-error'
                      }`}>
                        {parsed.confidence}% Confidence
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Summary / Clinical Summary */}
                {(parsed.clinical_summary || parsed.summary) && (
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">{mode === 'patient' ? 'Clinical Summary' : 'Summary'}</h4>
                    <p className="text-sm text-on-surface leading-relaxed">{parsed.clinical_summary || parsed.summary}</p>
                  </div>
                )}

                {/* Possible Conditions */}
                {parsed.possible_conditions?.length > 0 && (
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Possible Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {parsed.possible_conditions.map((c: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-error-container/10 text-error text-xs font-medium">{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Points (general mode) */}
                {parsed.key_points?.length > 0 && (
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Key Points</h4>
                    <ul className="space-y-1">
                      {parsed.key_points.map((p: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm"><span className="material-symbols-outlined text-primary-container mt-0.5" style={{ fontSize: 14 }}>check_circle</span>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Tests */}
                {parsed.recommended_tests?.length > 0 && (
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Recommended Tests</h4>
                    <ul className="space-y-1">
                      {parsed.recommended_tests.map((t: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm"><span className="material-symbols-outlined text-gold mt-0.5" style={{ fontSize: 14 }}>science</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Treatment */}
                {(parsed.treatment_suggestions?.length > 0 || parsed.treatment_options?.length > 0) && (
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Treatment {mode === 'patient' ? 'Suggestions' : 'Options'}</h4>
                    <ul className="space-y-1">
                      {(parsed.treatment_suggestions || parsed.treatment_options || []).map((t: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm"><span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: 14 }}>medication</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risks / Red Flags */}
                {(parsed.risks?.length > 0 || parsed.red_flags?.length > 0) && (
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">{mode === 'patient' ? 'Risks' : 'Red Flags'}</h4>
                    <div className="bg-error-container/5 border border-error/10 p-3">
                      <ul className="space-y-1">
                        {(parsed.risks || parsed.red_flags || []).map((r: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-error"><span className="material-symbols-outlined mt-0.5" style={{ fontSize: 14 }}>warning</span>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Drug Interactions (patient mode) */}
                {parsed.drug_interactions && (
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Drug Interactions</h4>
                    <p className="text-sm text-on-surface">{parsed.drug_interactions}</p>
                  </div>
                )}

                {/* Follow-up (patient mode) */}
                {parsed.follow_up && (
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Follow-up</h4>
                    <p className="text-sm text-on-surface">{parsed.follow_up}</p>
                  </div>
                )}

                {/* References (general mode) */}
                {parsed.references && (
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">References</h4>
                    <p className="text-sm text-on-surface-variant italic">{parsed.references}</p>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="px-6 py-4 bg-gold/5 border-t border-gold/20">
                <p className="text-[11px] text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-gold" style={{ fontSize: 14 }}>info</span>
                  <strong>Disclaimer:</strong> AI provides assistance only. This is NOT a medical decision. Always apply clinical judgment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Mode Info Card */}
          <div className={`p-6 shadow-sm ${mode === 'patient' ? 'bg-primary-container/5 border border-primary-container/20' : 'bg-gold/5 border border-gold/20'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: mode === 'patient' ? '#1B4332' : '#C09E3B' }}>
                {mode === 'patient' ? 'monitor_heart' : 'menu_book'}
              </span>
              <h4 className="font-headline font-semibold text-primary text-sm">
                {mode === 'patient' ? 'Patient AI Mode' : 'General AI Mode'}
              </h4>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {mode === 'patient'
                ? 'Analyzes patient medical history, conditions, current medications, and lab results to provide personalized clinical insights.'
                : 'Provides evidence-based medical knowledge, drug information, treatment protocols, and diagnostic guidance without any patient data.'}
            </p>
            <div className="mt-4 pt-4 border-t border-outline-variant/20">
              <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant mb-2">Capabilities</p>
              <ul className="space-y-1.5">
                {(mode === 'patient'
                  ? ['Drug interaction checks', 'Lab result analysis', 'Treatment planning', 'Risk assessment', 'Follow-up scheduling']
                  : ['Differential diagnosis', 'Drug reference', 'Treatment protocols', 'Clinical guidelines', 'Dosage calculations']
                ).map((c) => (
                  <li key={c} className="flex items-center gap-2 text-xs text-on-surface">
                    <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 12 }}>check</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* History */}
          {showHistory && (
            <div className="bg-surface-container-lowest p-6 shadow-sm">
              <h4 className="font-headline font-semibold text-primary text-sm mb-4">Query History</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-xs text-on-surface-variant text-center py-4">No history yet — ask a question to get started</p>
                ) : (
                  history.map((h: any) => (
                    <div key={h.id} className="p-3 border border-outline-variant/20 hover:border-primary/20 transition-colors cursor-pointer" onClick={() => setQuestion(h.query?.replace('[GENERAL] ', ''))}>
                      <p className="text-xs font-semibold truncate">{h.query?.replace('[GENERAL] ', '')}</p>
                      <p className="text-[10px] text-on-surface-variant mt-1">{new Date(h.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-surface-container-lowest p-6 shadow-sm">
            <h4 className="font-headline font-semibold text-primary text-sm mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-gold" style={{ fontSize: 16 }}>tips_and_updates</span>
              Tips for Better Results
            </h4>
            <ul className="space-y-2">
              {[
                'Be specific about symptoms and duration',
                'Mention relevant medications',
                'Include patient age and gender context',
                'Ask about specific drug interactions',
                'Request evidence-based guidelines',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-on-surface-variant">
                  <span className="text-gold mt-0.5">•</span>{tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
