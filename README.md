# Crowdfunding Frontend Routes Overview

## 🚀 Installation

Follow these steps to set up the project locally:

```bash
# 1. Clone the repository
git clone https://github.com/jbeil99/Crowdfunding-react

# 2. Navigate into the project directory
cd Crowdfunding-react

# 3. Install the dependencies
npm install

# 4. Start the development server
npm run dev
```

## Application Routes Structure

| Route Path              | Component            | Access Control               |
| ----------------------- | -------------------- | ---------------------------- |
| `/`                     | `HomePage`           | Public                       |
| `/discover`             | `DiscoverPage`       | Public                       |
| `/campaign/:id`         | `CampaignDetailPage` | Public                       |
| `/start-campaign`       | `CreateCampaignPage` | Authenticated Users Only     |
| `/how-it-works`         | `HowItWorksPage`     | Authenticated Users Only     |
| `/activate/:uid/:token` | `ActivateAccount`    | Public (Token-based)         |
| `/dashboard`            | `AdminDashboard`     | Admin Users Only             |
| `/profile`              | `ProfilePage`        | Authenticated Users Only     |
| `/edit-profile`         | `EditProfileForm`    | Authenticated Users Only     |
| `/login`                | `LoginPage`          | Non-Authenticated Users Only |
| `/register`             | `RegisterPage`       | Non-Authenticated Users Only |
| `/projects/edit/:id`    | `UpdateProjectForm`  | Authenticated Users Only     |
| `*` (wildcard)          | `NotFoundPage`       | Public                       |

## Key Technologies

### State Management

- **Redux** for global state management
  - Manages authentication state
  - Handles project data
  - Controls user information
  - Manages form states

### UI Components

- **shadcn/ui** for component library
  - Provides consistent design system
  - Includes pre-styled form components
  - Features accessible UI elements
  - Supports responsive layouts

### Routing

- **React Router v6** for navigation
  - Route protection with custom guard components:
    - `RedirectIfAuthenticated`
    - `RedirectIfNotAuthenticated`
    - `AdminGuard`
  - Nested routes within layout component

### Notifications

- **React Hot Toast** (`<Toaster />`) for user notifications
  - Success/error messages
  - Action confirmations
  - System notifications

> 🖥️ The backend API for this project is available here:  
> [https://github.com/jbeil99/Crowdfunding-django](https://github.com/jbeil99/Crowdfunding-django)
