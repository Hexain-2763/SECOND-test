# SocialConnect

A social media web app with AI-powered recommendations, built with Next.js, MongoDB, and TypeScript.

## Features

- **User Accounts** — sign up, log in, edit your profile
- **Posts** — create, edit, and delete posts with tags
- **Interactions** — like and comment on posts
- **Follow System** — follow and unfollow other users
- **AI Recommendations** — smart post and profile suggestions based on your activity
- **Dark Mode** — toggle between light and dark themes

## Tech Stack

| Layer          | Technology            |
| -------------- | --------------------- |
| Frontend       | Next.js (App Router)  |
| Language       | TypeScript            |
| Database       | MongoDB + Mongoose    |
| Auth           | NextAuth.js           |
| Styling        | Tailwind CSS          |
| Recommendations | Tag-based matching   |

## Prerequisites

- **Node.js** 20.9 or higher
- **MongoDB** — a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local install)

## Getting Started

1. **Install dependencies**

```bash
cd idk/socialconnect
npm install
```

2. **Set up MongoDB Atlas**

   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up (free)
   - Create a free **M0 cluster**
   - Click **Connect** → **Connect your application**
   - Copy the connection string

3. **Configure environment variables**

   Edit `idk/socialconnect/.env.local` and paste your Atlas connection string:

   ```
   MONGODB_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/socialconnect?retryWrites=true&w=majority
   NEXTAUTH_SECRET=already-generated-for-you
   NEXTAUTH_URL=http://localhost:3000
   OPENAI_API_KEY=your-openai-api-key (optional, for AI features)
   ```

4. **Run the dev server**

```bash
npm run dev
```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
socialconnect/
├── src/
│   ├── app/                  # Pages and API routes
│   │   ├── api/              # Backend API
│   │   │   ├── auth/         # Login, signup, session
│   │   │   ├── posts/        # CRUD + comments + likes
│   │   │   ├── users/        # Profiles + follow
│   │   │   └── recommendations/
│   │   ├── auth/             # Login and signup pages
│   │   ├── feed/             # Main feed page
│   │   └── profile/          # User profile page
│   ├── components/           # Reusable UI components
│   ├── context/              # Auth and theme providers
│   ├── lib/                  # DB connection, auth config
│   ├── models/               # Mongoose schemas
│   └── types/                # TypeScript types
└── .env.local                # Environment variables (git-ignored)
```

## Available Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `npm run dev`      | Start development server     |
| `npm run build`    | Build for production         |
| `npm start`        | Start production server      |
| `npm run lint`     | Run ESLint                   |

## How Recommendations Work

1. When you like or comment on posts, the app tracks which **tags** you engage with
2. The recommendation engine finds posts with similar tags you haven't seen yet
3. It also suggests profiles of active users you don't follow yet

The more you interact, the better the suggestions get.
