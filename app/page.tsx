'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  Layers, 
  FileText, 
  Cpu, 
  AlertTriangle, 
  Terminal, 
  ArrowRight,
  Loader2,
  Sun,
  Moon,
  Download
} from 'lucide-react';

interface AnalysisResult {
  summary: string;
  userStories: string[];
  techStack: string[];
  edgeCases: string[];
}

export default function Home() {
  const [text, setText] = useState('');
  const [model, setModel] = useState('gemini-3.1-flash-lite');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Apply theme class to root html/body
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, model }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze specification');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  const handleDownloadMarkdown = () => {
    if (!result) return;

    const markdown = `### Executive Summary
${result.summary}

### User Stories
${result.userStories.map(s => `- ${s}`).join('\n')}

### Suggested Tech Stack
${result.techStack.map(t => `- ${t}`).join('\n')}

### Edge Cases & Risks
${result.edgeCases.map(e => `- ${e}`).join('\n')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contextcut-analysis.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    const element = document.getElementById('results-panel');
    if (!element) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save('contextcut-analysis.pdf');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      // Fallback to print if library fails
      window.print();
    }
  };

  const loadSample = () => {
    setText(`We need a modern SaaS platform for creative agencies called "DesignPulse". Clients should be able to submit feedback on branding assets directly through a visual annotation canvas. Agencies need client management, role-based access control, automated invoice generation via Stripe, and real-time activity notifications. Must support high-res image and video uploads up to 2GB with blazing-fast CDN delivery and local caching. Tech stack should be Next.js, PostgreSQL with Prisma, Tailwind CSS, and Vercel hosting.`);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${theme === 'dark' ? 'bg-neutral-950 text-neutral-100 selection:bg-neutral-100 selection:text-neutral-950' : 'bg-white text-black selection:bg-black selection:text-white'}`}>
      {/* Top Bar / Header */}
      <header className={`border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-colors duration-200 ${theme === 'dark' ? 'border-neutral-800 bg-neutral-950/90 backdrop-blur' : 'border-black bg-white/90 backdrop-blur'}`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 flex items-center justify-center font-mono font-bold text-lg tracking-tighter ${theme === 'dark' ? 'bg-white text-neutral-950' : 'bg-black text-white'}`}>
            CC
          </div>
          <div>
            <h1 className="font-mono font-bold tracking-tight text-lg leading-none">CONTEXTCUT</h1>
            <p className={`text-xs font-mono mt-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>AI Specification & Architecture Parser</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`text-xs font-mono border px-3 py-1.5 transition-colors flex items-center space-x-1.5 ${theme === 'dark' ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800' : 'border-black bg-white text-black hover:bg-black hover:text-white'}`}
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
          <button
            onClick={loadSample}
            className={`text-xs font-mono border px-3 py-1.5 transition-colors ${theme === 'dark' ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800' : 'border-black hover:bg-black hover:text-white'}`}
          >
            Load Sample Spec
          </button>
          <div className={`hidden md:flex items-center space-x-2 text-xs font-mono pl-4 border-l ${theme === 'dark' ? 'border-neutral-800 text-neutral-400' : 'border-neutral-300 text-neutral-500'}`}>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Gemini API Ready</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-73px)]">
        {/* Left Column: Input Form */}
        <section className={`lg:col-span-5 border-r p-6 flex flex-col justify-between transition-colors duration-200 print:hidden ${theme === 'dark' ? 'border-neutral-800 bg-neutral-900/40' : 'border-black bg-neutral-50/50'}`}>
          <form onSubmit={handleAnalyze} className="space-y-6 flex-1 flex flex-col">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="spec-input" className={`block font-mono text-xs uppercase tracking-wider font-semibold ${theme === 'dark' ? 'text-neutral-300' : 'text-black'}`}>
                  1. Raw Client Notes / Specs
                </label>
                <button
                  type="button"
                  onClick={handleClear}
                  className={`transition-colors ${theme === 'dark' ? 'text-neutral-500 hover:text-neutral-200' : 'text-neutral-400 hover:text-black'}`}
                  title="Clear text"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                id="spec-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste messy meeting notes, product requirements, or client emails here..."
                className={`w-full h-72 lg:h-96 p-4 border text-sm font-sans focus:outline-none focus:ring-1 resize-none placeholder:text-neutral-500 ${theme === 'dark' ? 'bg-neutral-900 border-neutral-700 text-neutral-100 focus:ring-neutral-400' : 'bg-white border-black text-black focus:ring-black'}`}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="model-select" className={`block font-mono text-xs uppercase tracking-wider font-semibold ${theme === 'dark' ? 'text-neutral-300' : 'text-black'}`}>
                2. Select Model
              </label>
              <div className="relative">
                <select
                  id="model-select"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className={`w-full p-3 border text-sm font-mono appearance-none focus:outline-none focus:ring-1 cursor-pointer ${theme === 'dark' ? 'bg-neutral-900 border-neutral-700 text-neutral-100 focus:ring-neutral-400' : 'bg-white border-black text-black focus:ring-black'}`}
                >
                  <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Fast & Efficient)</option>
                  <option value="gemma-4-31b-it">Gemma 4 31B IT (Advanced Open Architecture)</option>
                </select>
                <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${theme === 'dark' ? 'text-neutral-300' : 'text-black'}`}>
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !text.trim()}
              className={`w-full font-mono text-xs font-semibold py-4 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 border ${
                theme === 'dark' 
                  ? 'bg-neutral-100 text-neutral-950 border-neutral-100 hover:bg-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]' 
                  : 'bg-black text-white border-black hover:bg-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Context...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Specification</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className={`mt-4 p-4 border text-xs font-mono flex items-start space-x-2 ${theme === 'dark' ? 'border-red-900 bg-red-950/50 text-red-200' : 'border-black bg-red-50 text-red-900'}`}>
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <div className={`mt-8 pt-6 border-t text-xs font-mono ${theme === 'dark' ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-500'}`}>
            <span>ContextCut Engine v1.0 &bull; Powered by Gemini AI</span>
          </div>
        </section>

        {/* Right Column: Output Structured Cards */}
        <section id="results-panel" className={`lg:col-span-7 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto transition-colors duration-200 ${theme === 'dark' ? 'bg-neutral-950 text-neutral-100' : 'bg-white text-black'}`}>
          {result ? (
            <div className="space-y-6 flex-1">
              <div className={`flex items-center justify-end pb-4 border-b ${theme === 'dark' ? 'border-neutral-800' : 'border-black'}`}>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownloadMarkdown}
                    className={`flex items-center space-x-1.5 text-xs font-mono border px-3 py-1.5 transition-colors ${
                      theme === 'dark'
                        ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]'
                        : 'border-black bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .MD</span>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className={`flex items-center space-x-1.5 text-xs font-mono border px-3 py-1.5 transition-colors ${
                      theme === 'dark'
                        ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]'
                        : 'border-black bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Summary Card */}
              <div className={`border p-5 ${theme === 'dark' ? 'border-neutral-800 bg-neutral-900/50 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]' : 'border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                <div className="flex items-center space-x-2 mb-3 text-xs font-mono uppercase tracking-wider font-bold">
                  <FileText className="w-4 h-4" />
                  <span>Executive Summary</span>
                </div>
                <p className={`text-sm font-sans leading-relaxed ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'}`}>
                  {result.summary}
                </p>
              </div>

              {/* User Stories Card */}
              <div className={`border p-5 ${theme === 'dark' ? 'border-neutral-800 bg-neutral-900/50 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]' : 'border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                <div className="flex items-center space-x-2 mb-3 text-xs font-mono uppercase tracking-wider font-bold">
                  <Layers className="w-4 h-4" />
                  <span>User Stories ({result.userStories.length})</span>
                </div>
                <ul className="space-y-2">
                  {result.userStories.map((story, index) => (
                    <li key={index} className={`text-sm font-sans flex items-start space-x-3 p-3 border ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-800'}`}>
                      <span className="font-mono text-xs text-neutral-500 mt-0.5">0{index + 1}</span>
                      <span>{story}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Card */}
              <div className={`border p-5 ${theme === 'dark' ? 'border-neutral-800 bg-neutral-900/50 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]' : 'border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                <div className="flex items-center space-x-2 mb-3 text-xs font-mono uppercase tracking-wider font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>Suggested Architecture & Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.techStack.map((tech, index) => (
                    <span 
                      key={index} 
                      className={`font-mono text-xs px-3 py-1.5 border uppercase tracking-wider ${
                        theme === 'dark'
                          ? 'bg-neutral-100 text-neutral-950 border-neutral-100 font-semibold'
                          : 'bg-black text-white border-black'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Edge Cases Card */}
              <div className={`border p-5 ${theme === 'dark' ? 'border-neutral-800 bg-neutral-900/50 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]' : 'border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                <div className="flex items-center space-x-2 mb-3 text-xs font-mono uppercase tracking-wider font-bold text-red-500">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Edge Cases & Risks</span>
                </div>
                <ul className="space-y-2">
                  {result.edgeCases.map((risk, index) => (
                    <li key={index} className={`text-sm font-sans flex items-start space-x-3 p-3 border ${theme === 'dark' ? 'bg-red-950/20 border-red-900/40 text-neutral-300' : 'bg-red-50/50 border-red-200 text-neutral-800'}`}>
                      <span className="font-mono text-xs text-red-500 mt-0.5">!</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className={`h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed ${theme === 'dark' ? 'border-neutral-800' : 'border-neutral-300'}`}>
              <div className={`w-12 h-12 border flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-neutral-900 border-neutral-700 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] text-white' : 'bg-neutral-100 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black'}`}>
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">No Analysis Yet</h3>
              <p className={`text-xs font-sans max-w-xs leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Paste your product specs or meeting notes on the left and click <span className={`font-mono font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Analyze Specification</span> to generate structured engineering output.
              </p>
            </div>
          )}

          <div className="mt-8 pt-4"></div>
        </section>
      </main>
    </div>
  );
}
