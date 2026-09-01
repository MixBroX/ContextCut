<div align="center">

# ContextCut
### AI Specification & Architecture Parser

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-SDK-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMixBroX%2FContextCut)

</div>

---

## ⚡ The Problem & Solution

### The Problem
Engineering teams and product managers waste countless hours translating messy client emails, unstructured voice notes, and chaotic meeting transcripts into actionable specifications. Ambiguous requirements lead to misaligned user stories, missing edge cases, and costly architectural debt before a single line of code is written.

### The Solution
**ContextCut** is an AI-powered specification parser that bridges the gap between chaotic human communication and structured engineering requirements. By leveraging Google's advanced Gemini models with strict schema enforcement, ContextCut instantly ingests raw notes and outputs production-ready executive summaries, granular user stories, suggested tech stacks, and critical architectural edge cases.

---

## 🚀 Key Features

- **Deterministic JSON Output:** System prompt engineering guarantees strictly formatted JSON responses, eliminating parsing failures.
- **Secure Backend Proxy:** All Gemini API interactions happen server-side (`/api/analyze`), ensuring your `GEMINI_API_KEY` is never exposed to the client.
- **Swiss Minimalist Interface:** High-contrast, brutalist monochrome design system built for high-density information architecture.
- **Model Flexibility:** Seamlessly switch between Gemini models (`gemini-3.1-flash-lite`, `gemma-4-31b-it`, `gemini-1.5-pro`) depending on speed or reasoning requirements.
- **One-Click Markdown Export:** Instantly export formatted analysis reports to `.md` files for version control or issue trackers.
- **Dark Mode Default:** Optimized for developers with an instant Light/Dark mode toggle.

---

## 📐 Architecture & Data Flow

```text
┌──────────────┐         POST /api/analyze       ┌─────────────────────────┐
│ Client UI    │ ──────────────────────────────► │ Next.js API Route       │
│ (React/TS)   │                                 │ (Server-side Validation)│
└──────────────┘                                 └─────────────────────────┘
       │                                                      │
       │ Rendered Structured Cards                            │ Google GenAI SDK
       │                                                      ▼
┌──────────────◄───────────────────────────────── ┌─────────────────────────┐
│ Validated JSON                                  │ Gemini API              │
│ { summary, userStories, techStack, edgeCases }  │ (Strict Schema Prompt)  │
└──────────────────────────────────────────────── └─────────────────────────┘
```

---

## 📦 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14+ (App Router) | Server-rendered React framework with responsive layouts. |
| **Language** | TypeScript | End-to-end type safety across API boundaries. |
| **Styling** | Tailwind CSS / Vanilla | Swiss minimalist design system with brutalist borders. |
| **Icons** | Lucide React | High-performance crisp vector iconography. |
| **AI Integration** | `@google/genai` SDK | Official Google Generative AI client library. |
| **Deployment** | Vercel | Edge-optimized serverless deployment. |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.x or higher
- pnpm / npm / yarn
- A Gemini API Key ([Get one here](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MixBroX/ContextCut.git
   cd ContextCut
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`.

---

## 🔒 Prompt Engineering & Security

### Deterministic Schema Enforcement
ContextCut relies on robust system prompt constraints rather than fragile regex parsing. The API route (`app/api/analyze/route.ts`) instructs Gemini to return raw JSON matching a rigid TypeScript interface:

```json
{
  "summary": "Short 2-sentence executive summary",
  "userStories": ["Story 1", "Story 2"],
  "techStack": ["Tech 1", "Tech 2"],
  "edgeCases": ["Risk 1", "Risk 2"]
}
```

### API Key Protection
To prevent credential leaks, the browser never instantiates the `GoogleGenAI` client directly. All payloads are routed through a protected Next.js API route that validates input length, injects the server-side environment key, and handles model exceptions gracefully.

---

## 🗺️ Future Roadmap

- [ ] **Jira & Linear Integration:** Direct one-click export of generated user stories to active project boards.
- [ ] **Multi-File Ingestion:** Support for uploading PDF briefs, audio transcript files (`.mp3`, `.wav`), and codebase READMEs.
- [ ] **Custom JSON Schemas:** Allow teams to define their own output structures (e.g., API contracts, database schemas).
- [ ] **Collaborative Workspace:** Real-time multi-user editing and sharing of parsed specifications via encrypted links.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.
