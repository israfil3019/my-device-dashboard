# Device Dashboard

## Overview

**Device Dashboard** is a web-based application built using **Next.js**, **React**, and **Tailwind CSS**. It offers dynamic data visualization and tabular data management for device metrics like temperature, humidity, and more. The application provides seamless navigation, secure login functionality, and a responsive user interface for monitoring device data.

---

## Features

- **Authentication**:
  - Token-based login with validation for email and password.
  - Redirects unauthenticated users to the login page.
- **Dashboard**:
  - Device-specific data visualization using interactive charts (ECharts).
  - Tabular data display using AG Grid.
  - Interval filters for daily, weekly, and monthly data.
- **Device Tabs**:
  - Switch between different devices to view specific metrics.
  - Compare multiple devices in chart mode.
- **User Feedback**:
  - Loading indicators for data fetching states.
  - Error messages for failed API requests.

---

## Installation

### Prerequisites

- **Node.js** (>=16.x)
- **npm** or **yarn**

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd device-dashboard
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the app in your browser:
   ```
   http://localhost:3000
   ```

---

## Project Structure

```plaintext
src/
├── app/
│   ├── api/                   # API route handlers (if any)
│   ├── dashboard/             # Dashboard pages and components
│   │   ├── components/        # Subcomponents like Tabs, Navbar, etc.
│   │   │   ├── page.test.tsx  # Unit tests for dashboard components
│   │   │   └── page.tsx       # Main page for dashboard components
│   │   └── page.tsx           # Main dashboard page
│   │   └── page.test.tsx      # Unit tests for the dashboard page
│   ├── loading/               # Loading indicator components
│   ├── login/                 # Login page and related tests
│   ├── page.test.tsx          # Unit tests for the home page
│   ├── page.tsx               # Home page (direct user to login page)
│   ├── layout.tsx             # Layout page
│   ├── layout.test.tsx        # Unit tests for the layout page
│   └── leaf.svg               # Favicon for the application
├── context/
│   └── TabsContext.tsx        # Context for managing active tabs and intervals
├── lib/
│   ├── constants/             # Custom hooks (e.g., useLogin, useChartData)
│   ├── hooks/                 # Enums (e.g., url)
│   ├── providers/             # Providers for global state (e.g., react-query)
│   ├── types/                 # Types for pages (e.g., dashboard/chart)
│   └── utils/                 # Utility functions (e.g., date formatters)
├── public/                    # Public assets (e.g., images, icons)
│
├── styles/
│   └── globals.css            # Global CSS styles
```

---

## Usage

### Local Environment Setup

1. **Environment Variables**:
   Create a `.env.local` file in the root directory with the following content:

   ```env
   NEXT_PUBLIC_API_BASE_URL=https://api.example.com
   ```

2. **Run the App**:
   - Login with the following test credentials:
   - **Email**: `challenge2025@arbolitics.com`
   - **Password**: `challenge2025`
   - Explore the dashboard, interact with device tabs, and visualize device data.

---

## Tools and Libraries

- **Next.js**: Framework for React with server-side rendering and API handling.
- **React**: Component-based library for building user interfaces.
- **TypeScript**: Typed JavaScript for better maintainability.
- **Tailwind CSS**: Utility-first CSS framework for fast UI development.
- **ECharts**: Interactive charting library for data visualization.
- **AG Grid**: Powerful grid library for tabular data management.
- **react-hook-form**: Library for building forms with validation.
- **@tanstack/react-query**: Data-fetching and caching library for efficient state management.

---

## Development Commands

- **Start Development Server**:
  ```bash
  npm run dev
  ```
- **Build for Production**:
  ```bash
  npm run build
  ```
- **Run Tests**:
  ```bash
  npm test
  ```
- **Lint the Code**:
  ```bash
  npm run lint
  ```

---

## Testing

### Testing Frameworks

- **Jest**: Testing framework for JavaScript and TypeScript.
- **React Testing Library**: For testing React components.

### Test Scenarios

- **LoginForm**:
  - Validates form inputs and handles submission errors.
  - Redirects to the dashboard on successful login.
- **Dashboard**:
  - Verifies protected routes redirect unauthenticated users.
  - Checks charts and tables render correctly.
- **Layout**:
  - Checks pages and metadata render correctly.
- **HomePage**:
  - Checks direct user to login page.
- **Reusable Components**:
  - Tests for components like `Tabs`, `Filters`, and `Navbar`.

### Running Tests

Run all tests with:

```bash
npm test
```

---

## Future Improvements

- Implement a registration flow for new users.
- Add dark mode to improve user experience.
- Fetch real-time data from a live API backend.
- Add more advanced filters and sorting capabilities.

---
