# Utah Precision Shooting Hub

The **Utah Precision Shooting Hub** is a centralized platform for discovering and tracking NRL22, NRL22X, and precision rimfire/centerfire matches across Utah. It provides a modern, "Tactical Precision" themed interface for shooters to find clubs, view upcoming matches, and analyze detailed match results.

![Project Screenshot](https://github.com/romes311/precision_hub/raw/main/public/project-preview.png)

## 🎯 Features

- **Club Directory**: Browse active precision shooting clubs in Utah with detailed profiles.
- **Match Calendar**: View upcoming and recent matches, filtered by date.
- **Match Results**: In-depth leaderboards for finished matches, including class/division breakdowns and rank highlights.
- **Tactical UI**: A custom dark-mode aesthetic featuring "Brand Red" accents and responsive design.
- **Data Synchronization**: Automated scripts to fetch and sync reliable data from external scoring APIs.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom variable-based theme (OKLCH).
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind).
- **Icons**: Lucide React.
- **Date Handling**: Moment.js.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed.
- npm or yarn.

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/romes311/precision_hub.git
    cd precision_hub
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Data Synchronization

Before running the app, you need to populate the local data (clubs, matches, results). A helper script is provided:

```bash
npm run sync
```

This will:

1.  Fetch active clubs in Utah.
2.  Fetch upcoming and past matches.
3.  Download full result sets for all matches.
4.  Save everything to `src/data/` JSON files.

### Running Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (ClubCard, MatchCard, Leaderboard, etc.).
- `src/lib`: Utility functions and API data accessors (`api.ts`).
- `src/types`: TypeScript interfaces for the data models.
- `scripts/sync-data.js`: Node.js script for fetching data from the Impact Scoring API.
- `data/`: Local JSON storage for app data (git-ignored components usually, but included here for prototype info).

## 🎨 Theme

The project uses a custom "Tactical" theme defined in `globals.css`:

- **Background**: Deep Dark (`#1a1a1a` / OKLCH variants).
- **Cards**: Gunmetal (`#1E1E1E`).
- **Primary Accent**: Brand Red (`#ea0a2a`).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
