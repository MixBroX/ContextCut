'use client'

import { useState } from 'react'
import { Check, ChevronDown, Clipboard, Moon, Sparkles, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

const tabs = [
  { id: 'requirements', label: 'Core Requirements' },
  { id: 'architecture', label: 'Suggested API Architecture' },
  { id: 'risks', label: 'Edge Cases & Risks' },
] as const

type TabId = (typeof tabs)[number]['id']

const examples: Record<TabId, { heading: string; items: string[] }> = {
  requirements: {
    heading: 'Product behavior',
    items: [
      'Accept unstructured notes as a single input source.',
      'Extract functional requirements and group them by domain.',
      'Return concise, implementation-ready specifications.',
    ],
  },
  architecture: {
    heading: 'Recommended surface',
    items: [
      'POST /api/specifications accepts notes and model configuration.',
      'Return a typed specification object with requirement groups.',
      'Keep extraction deterministic with a versioned prompt contract.',
    ],
  },
  risks: {
    heading: 'Things to resolve',
    items: [
      'Ambiguous ownership and missing acceptance criteria.',
      'Conflicting requirements across separate note sections.',
      'Long inputs may need chunking and a merge strategy.',
    ],
  },
}

export function ContextCutWorkspace() {
  const [notes, setNotes] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('requirements')
  const [isDark, setIsDark] = useState(false)
  const [hasOutput, setHasOutput] = useState(false)
  const [copied, setCopied] = useState(false)

  function extractSpecification() {
    if (!notes.trim()) return
    setHasOutput(true)
  }

  async function copyMarkdown() {
    const current = examples[activeTab]
    await navigator.clipboard?.writeText(`## ${current.heading}\n\n${current.items.map((item) => `- ${item}`).join('\n')}`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className={isDark ? 'dark min-h-screen' : 'min-h-screen'}>
      <main className="min-h-screen bg-background text-foreground transition-colors">
        <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between border-b border-border px-5 py-5 md:px-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-semibold tracking-[-0.04em]">ContextCut</span>
            <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">v1.0</span>
          </div>
          <Button aria-label="Toggle color mode" variant="outline" size="icon-sm" onClick={() => setIsDark((value) => !value)}>
            {isDark ? <Sun data-icon="inline-start" /> : <Moon data-icon="inline-start" />}
          </Button>
        </header>

        <div className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-10 md:px-10 md:pt-14">
          <section className="mb-10 max-w-2xl">
            <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="inline-block size-1.5 bg-foreground" /> Specification extractor
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.06em] md:text-6xl">From scattered notes to a clear build plan.</h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground md:text-lg">Paste the context. ContextCut separates signal from noise and turns rough thinking into an implementation-ready specification.</p>
          </section>

          <section className="grid gap-px border border-border bg-border lg:grid-cols-2" aria-label="Specification workspace">
            <div className="flex min-h-[560px] flex-col bg-background p-5 md:p-7">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">01 / Input</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Project context</h2>
                </div>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">{notes.length.toLocaleString()} chars</span>
              </div>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Paste messy requirements, meeting notes, or project context here..." aria-label="Project notes" className="min-h-72 flex-1 resize-none border-0 bg-transparent p-0 text-base leading-7 outline-none placeholder:text-muted-foreground/60 focus:ring-0" />
              <div className="mt-7 flex flex-col gap-5 border-t border-border pt-5 sm:flex-row sm:items-end sm:justify-between">
                <label className="flex flex-col gap-2 text-xs text-muted-foreground">Model
                  <span className="relative flex items-center">
                    <select className="h-9 w-full appearance-none border border-border bg-background px-3 pr-9 font-mono text-xs text-foreground outline-none focus:border-foreground sm:w-52" defaultValue="gemma"><option value="gemma">Gemma 4 31b it</option><option value="fast">Gemma 4 12b it</option></select>
                    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 size-3.5" />
                  </span>
                </label>
                <Button onClick={extractSpecification} disabled={!notes.trim()} className="h-10 w-full rounded-none bg-primary px-5 text-primary-foreground hover:bg-primary/90 sm:w-auto">Extract Specification <Sparkles data-icon="inline-end" /></Button>
              </div>
            </div>

            <div className="flex min-h-[560px] flex-col bg-muted/30 p-5 md:p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">02 / Output</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Specification</h2>
                </div>
                {hasOutput && <Button variant="outline" size="sm" onClick={copyMarkdown}>{copied ? <Check data-icon="inline-start" /> : <Clipboard data-icon="inline-start" />}{copied ? 'Copied' : 'Copy Markdown'}</Button>}
              </div>
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex overflow-x-auto border-b border-border" role="tablist" aria-label="Specification sections">
                  {tabs.map((tab, index) => <button key={tab.id} role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={`shrink-0 border-b-2 px-3 py-3 text-left font-mono text-[11px] transition-colors first:pl-0 ${activeTab === tab.id ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{index + 1}. {tab.label}</button>)}
                </div>
                {hasOutput ? <div className="pt-8" role="tabpanel"><p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{examples[activeTab].heading}</p><ul className="flex flex-col gap-4 text-sm leading-6">{examples[activeTab].items.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 size-1 shrink-0 bg-foreground" />{item}</li>)}</ul></div> : <div className="relative mt-6 flex flex-1 items-center justify-center overflow-hidden border border-dashed border-border/90 bg-background/30 p-8 text-center"><div className="pointer-events-none absolute inset-8 border border-border/60" /><div className="pointer-events-none absolute inset-x-1/2 top-8 bottom-8 border-l border-border/50" /><div className="pointer-events-none absolute inset-y-1/2 left-8 right-8 border-t border-border/50" /><div className="relative max-w-xs"><p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">Awaiting input</p><p className="mt-3 text-sm leading-6 text-muted-foreground">Your extracted specification will appear here.</p></div></div>}
              </div>
            </div>
          </section>
          <footer className="mt-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><span>Local workspace</span><span>Ready when you are</span></footer>
        </div>
      </main>
    </div>
  )
}

