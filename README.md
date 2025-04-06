# Intervue

**Intervue** is an AI-powered interview preparation platform that simulates realistic interviews with real-time audio, AI feedback, and analytics — helping job seekers improve their performance.

---

## 🚀 Overview

- AI-driven mock interviews with real-time interaction  
- Instant transcription & feedback  
- Built with modern web technologies

---

## 🧱 Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)  
- **UI**: React 19.1.0 + TypeScript  
- **Styling**: TailwindCSS v4 + shadcn/ui  
- **Animation**: Framer Motion  
- **State**: React hooks & context

### Backend
- **DB**: MongoDB + Mongoose  
- **Auth**: NextAuth.js with custom JWT  
- **API**: Next.js API routes & server actions  
- **Audio**: Web Audio API for processing

### Real-time
- **WebSocket**: Custom Socket.io integration  
- **Core Class**: `GeminiWebSocket` (handles streaming, transcription, feedback)

---

## 🔄 Features

- Live audio with AI interviewer  
- Real-time transcription  
- Instant AI feedback  
- *(Coming Soon)* Multi-user interviews

---

## 🛠️ Getting Started

```bash
git clone https://github.com/your-org/LettuceWin.git
cd LettuceWin
npm install
```

Create `.env.local` with:

```
MONGODB_URI=your_mongo_uri
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

Run the app:

```bash
npm run dev
```

---

## 👨‍💻 Built With

Next.js • React • MongoDB • Web Audio API • Socket.io • TailwindCSS

---
