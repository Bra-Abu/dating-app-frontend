# Marriage Connect - Frontend

React-based frontend web application for a marriage-focused dating platform connecting Nigerian singles.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite 7** - Build tool & dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS v3** - Utility-first styling
- **Firebase Auth** - Phone authentication with OTP
- **Axios** - HTTP client with interceptors
- **TanStack Query (React Query)** - Server state management with polling
- **React Hot Toast** - Toast notifications
- **Framer Motion** - Swipe gesture animations
- **Headless UI** - Accessible component primitives
- **Heroicons** - Icon library

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running (default: http://localhost:5000)
- Firebase project with phone authentication enabled

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Required environment variables:
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- And other Firebase config values

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

### 4. Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/        # Buttons, inputs, modals, etc.
│   │   ├── forms/         # Form components
│   │   ├── matching/      # Swipe cards, match modal
│   │   ├── messages/      # Message bubbles, chat components
│   │   └── profile/       # Profile cards, galleries
│   │
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── layouts/           # Layout wrappers
│   │   ├── UserLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── AuthLayout.jsx
│   │
│   ├── pages/             # Route pages
│   │   ├── auth/          # Login, register, pending approval
│   │   ├── profile/       # Profile create/edit/view
│   │   ├── matching/      # Browse, matches, history
│   │   ├── messages/      # Conversations, chat threads
│   │   ├── verification/  # Selfie/ID upload, status
│   │   ├── settings/      # Account, invites, blocked users
│   │   ├── notifications/ # Notification list
│   │   ├── reports/       # Report user
│   │   └── admin/         # Admin dashboard pages
│   │
│   ├── config/            # Configuration files
│   │   ├── api.js         # Axios instance
│   │   └── firebase.js    # Firebase config
│   │
│   ├── utils/             # Utility functions
│   │   ├── validators.js  # Form validation
│   │   ├── formatters.js  # Date/text formatting
│   │   ├── imageUtils.js  # Image compression
│   │   └── constants.js   # Enums and constants
│   │
│   └── App.jsx            # Root component with routing
│
├── public/                # Static assets
├── .env                   # Environment variables (create from .env.example)
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

## ✨ Features Implemented

### ✅ Phase 1: Foundation & Authentication
- Project setup with Vite + React + Tailwind
- Firebase phone authentication (OTP)
- Login & registration flows
- Invite code system
- Protected routes & auth state management

### ✅ Phase 2: Profile Creation & Management
- Multi-step profile form (5 steps, 45+ fields)
- Photo upload with drag & drop
- Guardian information (for Muslim women)
- Edit profile functionality
- View own profile

### ✅ Phase 3: Matching Interface
- Swipe-style matching with gesture support
- Compatibility score calculation
- Match celebration modal
- Mutual matches list
- Match history (liked/passed)
- Profile viewing with blur/clear photos

### ✅ Phase 4: Messaging System
- Conversations list
- Real-time chat with polling (5s interval)
- Message read receipts
- Guardian alerts for Muslim women
- Block/report from chat
- Auto-scroll to latest message

### ✅ Phase 5: Verification & Safety
- Verification status dashboard
- Selfie upload flow
- Government ID upload flow
- Report user functionality
- Block/unblock users
- Blocked users list

### ✅ Phase 6: Notifications & Settings
- Notification system with polling (30s interval)
- Notification badge with unread count
- Account settings
- Invite code management
- My reports page

### ✅ Phase 7: Admin Dashboard
- Admin layout with sidebar navigation
- Dashboard with key statistics
- Pending users approval queue
- Pending profiles moderation
- Verification review (photo/ID)
- Reports management
- Detailed statistics page

### ✅ Phase 8: Polish & Optimization
- 404 page
- Offline detection
- Loading skeletons
- Code splitting & chunk optimization
- Vite build optimization
- Mobile responsiveness
- Error boundaries

## 🎨 Key Features

### User Features
- **Phone Authentication**: OTP-based login with Firebase
- **Comprehensive Profiles**: 45+ profile fields including religious preferences
- **Smart Matching**: Swipe interface with compatibility scoring
- **Real-time Messaging**: Polling-based chat with read receipts
- **Photo Privacy**: Blurred photos until mutual match
- **Verification System**: Photo and ID verification
- **Guardian System**: Special features for Muslim women
- **Safety Tools**: Block, report, and review features
- **Invite System**: Generate and share invite codes

### Admin Features
- **User Management**: Approve/reject registrations
- **Profile Moderation**: Review and approve profiles
- **Verification Review**: Approve/reject photo and ID submissions
- **Reports Handling**: Manage user reports with actions
- **Statistics Dashboard**: Platform metrics and analytics
- **Activity Monitoring**: Track platform health

## 🔄 Real-time Updates

The app uses polling for real-time updates:
- **Messages**: Poll every 5 seconds
- **Conversations**: Poll every 10 seconds
- **Notifications**: Poll every 30 seconds

## 📱 Mobile Responsiveness

The entire application is mobile-first and fully responsive:
- Touch-optimized swipe gestures
- Mobile-friendly navigation
- Responsive layouts for all screen sizes
- Bottom navigation on mobile (admin panel)

## 🔐 Security Features

- Token-based authentication with auto-refresh
- Protected routes with role-based access
- HTTPS enforcement in production
- Input validation and sanitization
- XSS protection
- Secure file uploads with validation

## 🚀 Performance Optimizations

- Code splitting for admin pages
- Lazy loading for images
- Optimized bundle with vendor chunks
- Image compression before upload
- Query caching with React Query
- Debounced search inputs

## 🧪 Build Information

Current build size (production):
- Total: ~1MB (~301KB gzipped)
- Main chunk: User-facing features
- Admin chunk: Admin dashboard (lazy loaded)
- Vendor chunks: React, Firebase, UI libraries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For issues or questions, please contact the development team.
