# TrailMedic.Org - Emergency Medical Guidance with GPS Tracking

![TrailMedic](https://images.pexels.com/photos/6502313/pexels-photo-6502313.jpeg)

[![Built with Bolt](https://img.shields.io/badge/Built%20with-Bolt-blue)](https://bolt.new)

TrailMedic.Org is an AI-powered emergency medical guidance application with real-time GPS tracking designed for wilderness survival situations where professional medical help is unavailable. This progressive web application (PWA) provides critical first-aid guidance, assessment tools, and location tracking for emergency situations.

## ⚠️ IMPORTANT DISCLAIMER

This application is:
- For emergency use in wilderness survival situations ONLY
- NOT a substitute for professional medical care
- To be used ONLY when professional medical help is unavailable
- A guidance tool, not a definitive medical authority

**ALWAYS seek professional medical help when available.**

## 🚀 Features

- **🆘 Emergency Guest Mode**: Immediate access without authentication barriers
- **🤖 AI-Powered Assessment**: Google Gemini AI for medical guidance and triage
- **📍 Real-time GPS Tracking**: Continuous location monitoring with Google Maps integration
- **🗺️ Emergency Coordinates**: Precise lat/lng display for rescue teams
- **📤 Location Sharing**: One-click coordinate sharing and copying
- **📱 Offline-ready GPS**: Cached last known location when signal is lost
- **💬 Follow-up Chat Interface**: Ongoing guidance for changing conditions
- **📸 Photo Documentation**: Capture and document injuries
- **📚 Medical Field Guides**: Comprehensive emergency response guides including natural medicine
- **📞 Emergency Contacts**: Store and manage emergency contact information
- **📋 Assessment History**: Track and review previous assessments
- **📱 PWA Support**: Install as a native app on mobile devices
- **☁️ Cloud Sync**: Optional Supabase authentication for data backup

## 💻 Demo

A live demo of TrailMedic.Org is available at: [https://trailmedic.org](https://trailmedic.org)

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with email/password and guest mode fallback
- **AI**: Google Gemini AI for medical guidance
- **Maps**: Google Maps JavaScript API with real-time GPS tracking
- **Styling**: TailwindCSS for responsive design
- **PWA**: Service Worker for offline capabilities
- **Icons**: Lucide React for consistent iconography

## 🔐 Authentication & Data Storage

### 🆘 **Emergency-First Design**
- **Guest Mode**: Immediate access to all features without signup
- **Local Storage**: Data stored on device for privacy and offline access
- **Optional Cloud Sync**: Sign up to backup data across devices

### ☁️ **Authentication Options**
- **Email/Password**: Traditional authentication method
- **Guest Mode**: No authentication required for emergency use

### 🔒 **Cloud Features (Optional)**
- **Supabase Authentication**: Secure authentication with email/password
- **Database Sync**: Automatic backup of assessments and contacts
- **Multi-device Access**: Access your data from any device
- **Row Level Security**: Your data is protected and isolated

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HeyBattle1/trailmedic.org
   cd trailmedic
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your database (optional for cloud sync):
   - Create a [Supabase project](https://supabase.com)
   - Run the migration script in `supabase/migrations/`

4. Create a `.env` file in the root directory with your configuration:
   ```env
   # Supabase Configuration (optional for cloud sync)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # Google Services (required)
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   
   # Stripe (for payments)
   VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🗺️ GPS Features

- **Automatic Location Tracking**: Starts tracking immediately on emergency assessment
- **High Accuracy GPS**: Uses device's best available positioning
- **Emergency Coordinates Display**: Shows precise lat/lng in rescue-friendly format
- **Google Maps Integration**: Visual map with emergency location pin
- **Location Sharing**: Copy coordinates or share via native sharing
- **Offline Caching**: Stores last known location when connectivity is lost
- **Continuous Updates**: Refreshes location every 30 seconds during assessment
- **Database Storage**: GPS coordinates saved with each assessment (if authenticated)

## 🔐 Security & Privacy

- **Privacy First**: Guest mode keeps all data local on device
- **Row Level Security (RLS)**: Users can only access their own data in cloud
- **Secure Authentication**: Email/password authentication via Supabase
- **Data Encryption**: All cloud data encrypted in transit and at rest
- **GDPR Compliant**: Proper data isolation and user control
- **Local Fallback**: Offline functionality with localStorage backup
- **No Tracking**: No analytics or tracking in guest mode

## 🏗️ Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── EmergencyLocationTracker.tsx  # GPS tracking component
│   ├── AuthForm.tsx  # Authentication form
│   ├── ChatInterface.tsx  # AI chat for follow-up questions
│   └── ...
├── config/           # Service configurations
│   └── supabase.ts   # Supabase client configuration
├── context/          # React context providers
│   ├── AuthContext.tsx  # Authentication management
│   └── AppContext.tsx   # App state management
├── pages/            # Application pages
├── services/         # API and backend services
│   ├── database.ts   # Database operations
│   ├── googleAI.ts   # Google Gemini AI integration
│   └── medicalApi.ts # Medical assessment API
├── types/            # TypeScript type definitions
│   ├── database.ts   # Database schema types
│   └── index.ts      # Core application types
├── utils/            # Utility functions
├── App.tsx           # Main application component
└── main.tsx          # Application entry point

supabase/
└── migrations/       # Database migration scripts
    └── 20250609093439_soft_darkness.sql
```

## 🚀 Deployment

1. Build the production version:
   ```bash
   npm run build
   ```

2. Deploy to Netlify:
   ```bash
   netlify deploy --prod --dir=dist
   ```

3. Set environment variables in your deployment platform

## 📱 PWA Installation

TrailMedic.Org can be installed as a Progressive Web App on both desktop and mobile devices:

1. Visit the application in a supported browser
2. Look for the "Add to Home Screen" prompt
3. Follow the installation instructions

## 🧪 Testing

To run tests:
```bash
npm test
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **HeyBatlle1** - *Initial work* - [GitHub Profile](https://github.com/HeyBatlle1)

## 🙏 Acknowledgments

- Emergency medical professionals who provided guidance
- Google Maps Platform for location services
- Google Gemini AI for medical assessment capabilities
- Supabase for authentication and database services
- The open-source community
- All contributors and testers

## 📞 Support

For support, please open an issue in the GitHub repository.

## 🔒 Privacy & Security

- **Guest Mode**: GPS data and assessments stored locally on device only
- **Cloud Mode**: Data stored securely in Supabase with encryption
- **Location Sharing**: User-initiated only, never automatic
- **All medical assessments**: Processed securely with AI
- **All personal data**: Protected by Row Level Security
- **Users have full control**: Over their data and privacy settings
- **GDPR compliant**: Data handling with automatic cleanup policies

## 🆘 Emergency Use Guidelines

### **For Immediate Emergencies:**
1. **Click "Continue as Guest"** for instant access
2. **Take photo** of injury (optional)
3. **Describe situation** briefly
4. **Get AI assessment** with immediate actions
5. **Share GPS coordinates** with rescue teams

### **For Data Backup:**
1. **Sign up with email** for account creation
2. **Data syncs** automatically to cloud
3. **Access history** from any device
4. **Manage contacts** across devices

## 🌟 Why TrailMedic.Org?

TrailMedic.Org is designed with **emergency-first principles**:

- ⚡ **Zero barriers** to life-saving information
- 🔒 **Privacy-focused** with local-first data storage
- 🆘 **Works offline** when you need it most
- 📍 **Precise GPS** for rescue coordination
- 🤖 **AI-powered** medical guidance
- 📱 **Mobile-optimized** for field use
- 🌐 **Progressive Web App** - no app store required
- 🔐 **Simple authentication** with email/password

Perfect for hikers, campers, wilderness guides, and anyone venturing into remote areas where professional medical help may not be immediately available.