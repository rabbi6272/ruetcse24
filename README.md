<div align="center">

# 🌐 RUET CSE Archive — Web

**The official community platform for the CSE Department of RUET**

A Next.js web application — and the backend API layer — for RUET CSE Archive. Students and alumni connect, share academic resources, and stay informed, all in one place built exclusively for the CSE family of Rajshahi University of Engineering & Technology.

![Status](https://img.shields.io/badge/Status-Active%20Development-yellow)
![Framework](https://img.shields.io/badge/Framework-Next.js-black)
![Database](https://img.shields.io/badge/Database-Firebase-orange)

</div>

---

## What is RUET CSE Archive?

**RUET CSE Archive** is a dedicated social and academic platform built for the CSE department of RUET. It solves a real problem: valuable study materials get lost in WhatsApp threads, seniors and juniors rarely connect, and department announcements are scattered across multiple channels.

This project was built to keep the RUET CSE 24 batch connected in one shared digital space. The homepage introduces the batch with a visual showcase, while the profiles section works as a student directory where classmates can find each other by name, roll, email, hobby, or contact information.

The app is designed for:

- Showcasing the RUET CSE 24 batch.
- Browsing student profiles in a clean directory.
- Helping students keep their personal information updated.
- Sharing basic contact and social information among classmates.
- Sending batch-related email updates when needed.

## Main Features

- Animated RUET CSE 24 landing page.
- Public student profile directory.
- Searchable profiles.
- Student profile creation.
- Student profile update using email and pincode.
- Profile picture upload.
- Account deletion option.
- Forgot-pincode flow.
- Batch email utility.
- Responsive design for mobile and desktop.

## Student Profile Information

Each profile can include:

- Full name
- Nickname
- Roll number
- Section
- Email address
- Mobile number
- Blood group
- Hobby
- Short bio
- Facebook profile
- Profile picture

> 🚧 **This project is under active development.** Core features are being built and refined. Contributions are welcome.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Prerequisites & Requirements](#prerequisites--requirements)
- [Installation](#installation)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)
- [Styling with Tailwind CSS](#styling-with-tailwind-css)
- [Authentication](#authentication)
- [API Routes](#api-routes)
- [Firebase Setup](#firebase-setup)
- [Relationship to the Mobile App](#relationship-to-the-mobile-app)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Quick Start

If you have Node.js installed and Firebase credentials ready:

```bash
git clone https://github.com/your-org/ruet-cse-archive.git
cd ruet-cse-archive/web
npm install
cp .env.example .env.local   # then fill in your Firebase + app config
npm run dev
# Open http://localhost:3000
```

---

## Tech Stack

| Layer        | Technology                                                           | Purpose                                          |
| ------------ | -------------------------------------------------------------------- | ------------------------------------------------ |
| Framework    | [Next.js](https://nextjs.org) (App Router)                           | Full-stack React framework — UI + API routes     |
| Language     | TypeScript                                                           | Type-safe development                            |
| Styling      | [Tailwind CSS](https://tailwindcss.com)                              | Utility-first CSS for the browser                |
| Database     | [Firebase Firestore](https://firebase.google.com/products/firestore) | Realtime NoSQL database for all app data         |
| Auth         | Firebase Auth + email/password                                       | Manual user registration and session management  |
| File Storage | [Firebase Storage](https://firebase.google.com/products/storage)     | Uploaded notes, PDFs, and images                 |
| API          | Next.js API Routes (`/app/api/`)                                     | Backend logic consumed by web and mobile clients |

---

## Prerequisites & Requirements

| Requirement      | Version | Notes                                                              |
| ---------------- | ------- | ------------------------------------------------------------------ |
| Node.js          | ≥ 18.x  | [nodejs.org](https://nodejs.org)                                   |
| npm              | ≥ 9.x   | Comes with Node.js                                                 |
| Firebase account | —       | [console.firebase.google.com](https://console.firebase.google.com) |
| Firebase project | —       | With Firestore, Auth, and Storage enabled                          |

Verify your environment:

```bash
node -v    # should be v18+
npm -v     # should be v9+
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-org/ruet-cse-archive.git
cd ruet-cse-archive/web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Firebase project credentials and app config (see [Environment Variables](#environment-variables) for the full list).

### 4. Set up Firebase

- Go to [Firebase Console](https://console.firebase.google.com) and open your project
- Enable **Authentication** → Sign-in method → **Email/Password**
- Enable **Firestore Database** → Start in production mode → choose a region
- Enable **Storage** → Start in production mode
- Copy your project's config values into `.env.local`

### 5. Start the development server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Usage Examples

### Register a new account

Navigate to `/auth/register`, enter your full name, email address, and a password. After successful registration you are redirected to the main feed.

### Browse the community feed

```
/ → Feed page
```

Scroll through announcements and updates posted by students and alumni. Each post shows the author, timestamp, and engagement count.

### Upload a study resource

```
/resources → Upload button
```

Select a file (PDF, image, document), add a title, subject code, and semester. The file is uploaded to Firebase Storage and the metadata is saved to Firestore.

### Call an API route from the mobile app

The Next.js backend exposes REST endpoints consumed by the React Native mobile app:

```ts
// Fetch all resources — called from the mobile app
const res = await fetch("http://localhost:3000/api/resources", {
  headers: { Authorization: `Bearer ${userToken}` },
});
const data = await res.json();
// data.resources → array of resource objects from Firestore
```

### Search for classmates

```
/people → Search bar
```

Enter a name, batch year, or graduation year to find students and alumni. Tap any profile to view their uploaded resources and contact details.

---

## Project Structure

```
web/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (Navbar, providers, global styles)
│   ├── page.tsx                # Home / community feed
│   ├── auth/
│   │   ├── login/page.tsx      # Login page
│   │   └── register/page.tsx   # Registration page
│   ├── resources/
│   │   └── page.tsx            # Notes & study material browser
│   ├── people/
│   │   └── page.tsx            # Classmates & alumni directory
│   ├── api/                    # Next.js API Routes (backend)
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   └── login/route.ts
│   │   ├── resources/route.ts  # GET (list) + POST (upload)
│   │   ├── posts/route.ts      # GET (feed) + POST (create)
│   │   └── users/route.ts      # GET (search / directory)
│   └── globals.css             # Global styles (Tailwind directives)
├── components/                 # Reusable UI components
│   ├── cards/                  # PostCard, ResourceCard, UserCard
│   ├── layout/                 # Navbar, Footer, Sidebar
│   └── ui/                     # Button, Input, Badge, Modal, Avatar
├── hooks/                      # Custom React hooks (useAuth, useResources)
├── lib/
│   ├── firebase.ts             # Firebase app initialisation & exports
│   ├── firestore.ts            # Firestore query helpers
│   └── utils.ts                # General utility functions
├── constants/                  # App-wide config, routes, string constants
├── public/                     # Static assets (logos, OG images)
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS config (required by Tailwind)
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
└── package.json
```

---

## Styling with Tailwind CSS

This project uses **Tailwind CSS** — a utility-first CSS framework that runs natively in the browser. Unlike the mobile companion app (which uses NativeWind as a bridge), the web app has full access to every Tailwind feature: CSS Grid, hover and focus states, responsive breakpoints, transitions, and more.

### Example component

```tsx
export default function ResourceCard({
  title,
  subject,
  author,
  semester,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          {subject}
        </span>
        <span className="text-xs text-gray-400">Semester {semester}</span>
      </div>
      <h3 className="text-base font-semibold text-gray-900 mt-3">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">Shared by {author}</p>
      <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-xl transition-colors">
        Download
      </button>
    </div>
  );
}
```

### Configuration

`tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ruet: {
          blue: "#003087",
          gold: "#FFD700",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

`app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Authentication

Users register and log in with **email and password**. Authentication is handled by Firebase Auth, coordinated through Next.js API routes:

| Route                | Method | Description                                    |
| -------------------- | ------ | ---------------------------------------------- |
| `/api/auth/register` | `POST` | Creates Firebase Auth user + Firestore profile |
| `/api/auth/login`    | `POST` | Verifies credentials, returns session token    |

**Flow:**

1. User submits name, email, and password on `/auth/register`
2. The `/api/auth/register` route creates a Firebase Auth user and writes a profile document to Firestore
3. A Firebase ID token is returned and stored in the client (HTTP-only cookie or `localStorage`)
4. Protected routes and API endpoints verify the token via Firebase Admin SDK

---

## API Routes

The Next.js backend exposes the following REST endpoints, consumed by both the web frontend and the React Native mobile app:

| Route                | Method | Description                          | Auth Required |
| -------------------- | ------ | ------------------------------------ | ------------- |
| `/api/auth/register` | POST   | Register a new user                  | ❌            |
| `/api/auth/login`    | POST   | Log in and get session token         | ❌            |
| `/api/posts`         | GET    | Fetch paginated community feed       | ✅            |
| `/api/posts`         | POST   | Create a new announcement            | ✅            |
| `/api/resources`     | GET    | List study resources (filterable)    | ✅            |
| `/api/resources`     | POST   | Upload a new resource                | ✅            |
| `/api/users`         | GET    | Search classmates & alumni directory | ✅            |

---

## Firebase Setup

### 1. Create a Firebase project

Go to [Firebase Console](https://console.firebase.google.com) → Add project → follow the setup wizard.

### 2. Enable required services

- **Authentication** → Sign-in method → Email/Password → Enable
- **Firestore Database** → Create database → Production mode → choose nearest region
- **Storage** → Get started → Production mode

### 3. Get your config keys

Project Settings → Your apps → Web app → Copy the `firebaseConfig` object values into `.env.local`.

### 4. Firestore data structure

```
/users/{userId}
  name, email, batch, graduationYear, createdAt

/posts/{postId}
  authorId, content, createdAt, likes

/resources/{resourceId}
  authorId, title, subject, semester, fileUrl, createdAt
```

---

## Relationship to the Mobile App

This Next.js project serves a dual role:

1. **Web frontend** — a full browser-based UI for RUET CSE Archive
2. **Backend API** — Next.js API routes consumed by the React Native mobile app (`/native`)

| Concern                | Web                          | Mobile (React Native)                            |
| ---------------------- | ---------------------------- | ------------------------------------------------ |
| Styling syntax         | Full Tailwind CSS            | NativeWind (same class names, different runtime) |
| CSS Grid               | ✅ Supported                 | ❌ Not supported in RN                           |
| Hover / focus states   | ✅ Supported                 | ❌ Not applicable                                |
| Responsive breakpoints | ✅ `sm:` `md:` `lg:`         | ❌ Use RN Dimensions API                         |
| Auth                   | Firebase Auth via API routes | Firebase Auth via same API routes                |
| Database               | Firebase Firestore           | Firebase Firestore (same collections)            |
| API                    | Self (Next.js routes)        | Calls this app's `/api/*` endpoints              |

For mobile development, **this server must be running locally** so the mobile app can reach the API:

```bash
# In /web
npm run dev   # starts on http://localhost:3000

# In /native (separate terminal)
npx expo start
```

---

## Available Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start development server with hot reload |
| `npm run build`     | Compile a production-optimised build     |
| `npm run start`     | Serve the production build locally       |
| `npm run lint`      | Run ESLint across the project            |
| `npm run typecheck` | Run TypeScript compiler check (no emit)  |
| `npm run format`    | Format all files with Prettier           |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable                                   | Description                                        | Required |
| ------------------------------------------ | -------------------------------------------------- | -------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase project API key                           | ✅       |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain                               | ✅       |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase project ID                                | ✅       |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket                            | ✅       |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID                       | ✅       |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase app ID                                    | ✅       |
| `FIREBASE_ADMIN_PRIVATE_KEY`               | Firebase Admin SDK private key (server-side only)  | ✅       |
| `FIREBASE_ADMIN_CLIENT_EMAIL`              | Firebase Admin SDK client email (server-side only) | ✅       |
| `NEXT_PUBLIC_APP_ENV`                      | `development` or `production`                      | ✅       |

> `NEXT_PUBLIC_` variables are exposed to the browser. Keep `FIREBASE_ADMIN_*` keys unprefixed so they remain server-side only and are never bundled into the client.

---

## Troubleshooting

**Tailwind classes not applying**

- Verify the `content` array in `tailwind.config.ts` covers all files using classes
- Ensure `globals.css` includes the three `@tailwind` directives
- Restart the dev server after any Tailwind config change

**Firebase: `auth/invalid-api-key` error**

- Double-check all `NEXT_PUBLIC_FIREBASE_*` values in `.env.local`
- Ensure the `.env.local` file is in the `/web` root (same level as `package.json`)
- Restart the dev server after editing `.env.local`

**Firebase: Firestore permission denied**

- Check your Firestore Security Rules in the Firebase Console
- For development, you can temporarily allow all reads/writes:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
  ```

**Port already in use**

```bash
npm run dev -- --port 3001
```

**TypeScript errors after adding a package**

```bash
npm install -D @types/package-name
npm run typecheck
```

---

## Contributing

RUET CSE students and alumni are warmly welcome to contribute.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit with a clear message: `git commit -m 'feat: describe your change'`
4. Push the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request with a description of what changed, why, and screenshots for any UI changes

---

## License

[MIT](../LICENSE) © RUET CSE Archive Contributors
