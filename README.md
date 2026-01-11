# DRIP AGENT 💧👔

> *"Tell me your Twitter handle and I'll tell you what to wear"* — Ancient Proverb (2024)

**Your tweets have a vibe. Let's dress it.**

Drip Agent is an AI-powered fashion stylist that stalks your Twitter (in a totally legal way), psychoanalyzes your personality through your unhinged 3 AM tweets, and tells you what clothes would make you look like the main character you think you are.

---

## 🤔 What Even Is This?

You know how your friend who studied psychology for one semester thinks they can read people? This is that, but it actually works, and instead of telling you about your attachment style, it tells you to buy a $400 jacket.

**The pipeline:**
```
Your Twitter Handle
        ↓
   🕵️ Scrape your tweets (ethically, we promise)
        ↓
   🧠 AI figures out your whole personality
        ↓
   👗 Match you to a fashion archetype
        ↓
   🛍️ Recommend products you'll actually like
        ↓
   ✨ Generate a beautiful lookbook
        ↓
   💸 Your wallet cries
```

---

## 🎭 The Fashion Archetypes

Based on years of research (scrolling fashion TikTok), we've identified 7 core aesthetics:

| Archetype | Vibe | You Probably Tweet About |
|-----------|------|--------------------------|
| **Techwear** | Dystopian ninja meets Blade Runner | Crypto, drones, or the simulation |
| **Quiet Luxury** | "I summer in the Hamptons" | Wine, art, subtly expensive things |
| **Streetwear** | Supreme drops and sneaker releases | Hype, drops, and calling things "fire" |
| **Minimalist** | Marie Kondo's favorite child | Productivity, design, and empty rooms |
| **Avant-Garde** | Fashion is my art medium | Abstract thoughts, poetry, chaos |
| **Classic Prep** | Rowing team energy | Finance, golf, or ivy league nostalgia |
| **Athleisure** | Gym selfie protagonist | Workouts, protein, and "grind culture" |

---

## 🏗️ Architecture (For the Nerds)

We're running a multi-agent system because one AI wasn't enough to judge your fashion sense.

```
┌─────────────────────────────────────────────────────────────┐
│                      ORCHESTRATOR                            │
│                   (The Project Manager)                      │
│         "Keeps everyone on task, takes all the credit"       │
└─────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ SCRAPER  │  │  VIBE    │  │  STYLE   │  │ SHOPPING │
   │  AGENT   │  │  AGENT   │  │  AGENT   │  │  AGENT   │
   │          │  │          │  │          │  │          │
   │ "Stalks  │  │"Therapist│  │ "Fashion │  │"Personal │
   │  Twitter"│  │ energy"  │  │  police" │  │ shopper" │
   └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

---

## 🛠️ Tech Stack

- **Next.js 16** — Because we're trendy like that
- **MongoDB Atlas** — Where your vibe analysis lives forever
- **Fireworks AI (Llama 3.3 70B)** — The brain that judges you
- **Voyage AI** — For when we need embeddings (fancy word for "understanding text")
- **Apify** — Does the Twitter stalking so we don't have to
- **Tailwind CSS** — Making things pretty, one utility class at a time

---

## 🚀 Getting Started

### Prerequisites

You'll need API keys. So many API keys. It's like collecting Infinity Stones but for developers.

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd drip-agent
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```env
# The database where we store your fashion destiny
MONGODB_URI=mongodb+srv://...

# The AI that psychoanalyzes your tweets
FIREWORKS_API_KEY=fw_...

# For embeddings (it's complicated)
VOYAGE_API_KEY=voy_...

# The legal stalking service
APIFY_API_TOKEN=apify_...

# Where you're hosting this thing
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Seed the Database

Hit this endpoint to populate the style archetypes and products:

```bash
curl -X POST http://localhost:3000/api/seed
```

### 4. Run It

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and prepare to question all your clothing choices.

---

## 📡 API Endpoints

| Endpoint | Method | What It Does |
|----------|--------|--------------|
| `/api/analyze` | POST | "Here's my Twitter handle, roast me" |
| `/api/status` | GET | "Are we there yet? Are we there yet?" |
| `/api/lookbook` | GET | "Show me my fashion destiny" |
| `/api/seed` | POST | "Fill the database with drip" |

---

## 🧪 Testing MongoDB Connection

We included a test script because debugging connection strings at 2 AM is a rite of passage:

```bash
node test-mongo.js
```

If you see ✅, you're good. If you see ❌, check your connection string and cry.

---

## 🎯 How It Actually Works

1. **You enter a Twitter handle** → We're not judging (we are)
2. **Scraper Agent** → Grabs tweets via Apify (or uses demo data if Twitter is being difficult)
3. **Vibe Agent** → LLM reads your tweets like tea leaves and extracts:
   - Personality traits
   - Interests
   - Communication style
   - ~Aesthetic keywords~ vibes
4. **Style Agent** → Matches your vibe to fashion archetypes, picks a color palette
5. **Shopping Agent** → Finds products that match, writes personalized reasons why you need them
6. **Lookbook** → Everything compiled into a shareable, beautiful result

---

## 💰 Business Model

- **3 free product recommendations** — A taste of the drip
- **Premium tier** — When you inevitably want more

---

## 🤷 FAQ

**Q: Is this creepy?**
A: It's publicly available data being used to recommend nice clothes. We prefer "innovative."

**Q: What if I don't use Twitter?**
A: There's a manual mode where you can describe your vibe. Also, are you okay?

**Q: Will this actually improve my style?**
A: Statistically speaking, it can't get worse.

**Q: Why is it called Drip Agent?**
A: Because "AI-Powered Personalized Fashion Recommendation System Based on Social Media Behavioral Analysis" didn't fit.

---

## 🙏 Credits

Built with caffeine and existential dread for the MongoDB Hackathon.

**Stack thanks:**
- MongoDB for storing the vibes
- Fireworks AI for the galaxy brain LLM
- Apify for the ethical stalking
- Voyage AI for understanding words
- Next.js for being Next.js

---

## 📄 License

MIT — Do whatever you want, just don't blame us when you spend too much on clothes.

---

*"Fashion fades, but style is eternal"* — Yves Saint Laurent

*"Your Twitter feed says you need more black turtlenecks"* — Drip Agent
