# Live odds

Live version: https://live-odds-board.vercel.app/

## 🚀 Getting Started

These instructions will help you set up and run the project on your local machine.

### 📦 Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (Recommended: LTS version)
- [Yarn](https://yarnpkg.com/) package manager

### 🔧 Installation

Clone the repository and install dependencies:

```bash
git clone git@github.com:VanoAkofashvili/live-odds-board.git
cd live-odds-board
yarn
```

Start the dev server:

```bash
yarn dev
```

Go to:
[http://localhost:3000/](http://localhost:3000/)

## ⚙️ Configuration

You can configure the project settings by opening `src/AppConfig.ts`

## 😁 Future improvements

Below are some planned enhancements and technical improvements for the project:

- **Use Immutable.js**  
  Integrate [Immutable.js](https://immutable-js.github.io/immutable-js/) to efficiently manage and manipulate large lists, ensuring performance and consistency in state updates.

- **Replace Mock Data with Real Backend**  
  Remove current mock data implementations and connect the application to a real backend API for dynamic and production-ready data flow.

- **Implement Pagination**  
  Add pagination to improve user experience and application performance when dealing with large datasets.

- **Add Support for Different Sport Tabs**  
  Introduce navigation tabs for different sports to enhance content categorization and allow users to easily switch between sport-specific views.
