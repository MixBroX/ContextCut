'use client';

import React, { useState } from 'react';
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
  Loader2
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

  const handleCopyMarkdown = () => {
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

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setText(`We need a modern SaaS platform for creative agencies called "DesignPulse". Clients should be able to submit feedback on branding assets directly through a visual annotation canvas. Agencies need client management, role-based access control, automated invoice generation via Stripe, and real-time activity notifications. Must support high-res image and video uploads up to 2GB with blazing-fast CDN delivery and local caching. Tech stack should be Next.js, PostgreSQL with Prisma, Tailwind CSS, and Vercel hosting.`);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Top Bar / Header */}
      <header className="border-b border-black px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="bg-black text-white p-2 flex items-center justify-center font-mono font-bold text-lg tracking-tighter">
            CC
          </div>
          <div>
            <h1 className="font-mono font-bold tracking-tight text-lg leading-none">CONTEXTCUT</h1>
            <p className="text-xs text-neutral-500 font-mono mt-1">AI Specification & Architecture Parser</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={loadSample}
            className="text-xs font-mono border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
          >
            Load Sample Spec
          </button>
          <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-neutral-500 border-l border-neutral-300 pl-4">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Gemini API Ready</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-73px)]">
        {/* Left Column: Input Form */}
        <section className="lg:col-span-5 border-r border-black p-6 flex flex-col justify-between bg-neutral-50/50">
          <form onSubmit={handleAnalyze} className="space-y-6 flex-1 flex flex-col">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="spec-input" className="block font-mono text-xs uppercase tracking-wider font-semibold">
                  1. Raw Client Notes / Specs
                </label>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-neutral-400 hover:text-black transition-colors"
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
                className="w-full h-72 lg:h-96 p-4 bg-white border border-black text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black resize-none placeholder:text-neutral-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="model-select" className="block font-mono text-xs uppercase tracking-wider font-semibold">
                2. Select Gemini Model
              </label>
              <div className="relative">
                <select
                  id="model-select"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-3 bg-white border border-black text-sm font-mono appearance-none focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                >
                  <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Fast & Efficient)</option>
                  <option value="gemma-4-31b-it">Gemma 4 31B IT (Advanced Open Architecture)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="w-full bg-black text-white font-mono text-xs font-semibold py-4 uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
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
            <div className="mt-4 p-4 border border-black bg-red-50 text-red-900 text-xs font-mono flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-neutral-200 text-xs text-neutral-500 font-mono">
            <span>ContextCut Engine v1.0 &bull; Powered by Gemini AI</span>
          </div>
        </section>

        {/* Right Column: Output Structured Cards */}
        <section className="lg:col-span-7 p-6 lg:p-8 bg-white flex flex-col justify-between overflow-y-auto">
          {result ? (
            <div className="space-y-6 flex-1">
              <div className="flex items-center justify-between pb-4 border-b border-black">
                <div className="font-mono text-xs uppercase tracking-wider font-semibold flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span>Structured Output Analysis</span>
                </div>
                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center space-x-1.5 text-xs font-mono border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
              </div>

              {/* Summary Card */}
              <div className="border border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center space-x-2 mb-3 text-xs font-mono uppercase tracking-wider font-bold">
                  <FileText className="w-4 h-4" />
                  <span>Executive Summary</span>
                </div>
                <p className="text-sm font-sans text-neutral-800 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* User Stories Card */}
              <div className="border border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center space-x-2 mb-3 text-xs font-mono uppercase tracking-wider font-bold">
                  <Layers className="w-4 h-4" />
                  <span>User Stories ({result.userStories.length})</span>
                </div>
                <ul className="space-y-2">
                  {result.userStories.map((story, index) => (
                    <li key={index} className="text-sm font-sans flex items-start space-x-3 bg-neutral-50 p-3 border border-neutral-200">
                      <span className="font-mono text-xs text-neutral-400 mt-0.5">0{index + 1}</span>
                      <span className="text-neutral-800">{story}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Card */}
              <div className="border border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center space-x-2 mb-3 text-xs font-mono uppercase tracking-wider font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>Suggested Architecture & Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.techStack.map((tech, index) => (
                    <span 
                      key={index} 
                      className="font-mono text-xs bg-black text-white px-3 py-1.5 border border-black uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Edge Cases Card */}
              <div className="border border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center space-x-2 mb-3 text-xs font-mono uppercase tracking-wider font-bold text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Edge Cases & Risks</span>
                </div>
                <ul className="space-y-2">
                  {result.edgeCases.map((risk, index) => (
                    <li key={index} className="text-sm font-sans flex items-start space-x-3 bg-red-50/50 p-3 border border-red-200">
                      <span className="font-mono text-xs text-red-400 mt-0.5">!</span>
                      <span className="text-neutral-800">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-neutral-300">
              <div className="w-12 h-12 bg-neutral-100 border border-black flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">No Analysis Yet</h3>
              <p className="text-xs font-sans text-neutral-500 max-w-xs leading-relaxed">
                Paste your product specs or meeting notes on the left and click <span className="font-mono font-semibold text-black">Analyze Specification</span> to generate structured engineering output.
              </p>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Swiss Minimalist Design System</span>
            <span>High Contrast / Monospace</span>
          </div>
        </section>
      </main>
    </div>
  );
}
