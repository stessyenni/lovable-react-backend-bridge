# Software Requirements Specification (SRS) - HemApp
**Version 3.0 - October 2025 Update**

## Document Information
- **Document Version:** 3.0
- **Last Updated:** October 2025
- **Status:** Current Implementation State
- **Budget:** 350,000 CFA Francs

---

## Executive Summary

This document provides the updated Software Requirements Specification for HemApp version 3.0, reflecting the current implementation state as of October 2025. The application has successfully implemented core features including AI-powered health consultation, comprehensive diet monitoring, social connections, emergency services, and accessibility features.

---

## 1. Current Implementation Status

### 1.1 Completed Features ✅

#### Core Health Management
- ✅ **User Authentication & Profile Management**
  - Email/password authentication via Supabase
  - User profile creation and editing
  - Profile image upload
  - Account settings management

- ✅ **AI Health Consultation (HemBot)**
  - Symptom input and analysis
  - AI-powered health recommendations
  - Severity level assessment
  - Consultation history tracking
  - Edge function integration for AI processing

- ✅ **Comprehensive Diet Monitoring**
  - Meal entry with nutritional information
  - Photo upload for meals
  - Meal categories management (create, edit, view)
  - Nutrition goals tracking
  - Daily and weekly statistics
  - Trends visualization
  - Calorie, protein, carbs, and fats tracking

- ✅ **Health Dashboard**
  - Real-time health metrics display
  - Steps, heart rate, calories, sleep tracking (UI)
  - Quick action buttons
  - Recent activity feed
  - Progress visualization

#### Social Features
- ✅ **Messaging System**
  - Real-time messaging between users
  - HemBot integration in messages
  - Unread message notifications
  - Message history
  - User search and discovery

- ✅ **Connections Management**
  - Connection requests
  - Connections list
  - User search
  - Connection status indicators

#### Emergency & Healthcare
- ✅ **Emergency Services**
  - Emergency contact information
  - Quick access to emergency numbers
  - Emergency services UI

- ✅ **Healthcare Facilities Finder**
  - Facility directory
  - Location-based search UI
  - Facility information display

#### Accessibility
- ✅ **Voice Features**
  - Voice commands sidebar
  - Text-to-speech (Read Page functionality)
  - African voice selection (male/female)
  - Voice settings management
  - Speech synthesis for page content

- ✅ **Braille Mode**
  - High contrast mode
  - Enhanced readability
  - Toggle on/off functionality

#### Technical Features
- ✅ **Offline Functionality**
  - Offline mode detection
  - Data caching
  - Sync queue management
  - Online/offline status indicator

- ✅ **Responsive Design**
  - Mobile-first design
  - Tablet optimization
  - Desktop layouts
  - Touch-optimized interactions

### 1.2 Features in Progress 🔄

- 🔄 **Native Mobile App**
  - Android build configuration complete
  - iOS build configuration complete
  - Testing on physical devices pending
  - App store submission pending

- 🔄 **Real Smartwatch Integration**
  - UI completed
  - Bluetooth integration pending
  - Health data sync pending

### 1.3 Planned Features 📋

- 📋 **Group Messaging**
- 📋 **End-to-end Message Encryption**
- 📋 **Push Notifications**
- 📋 **Real-time Smartwatch Data Sync**
- 📋 **Multi-language Support**
- 📋 **Telemedicine Integration**
- 📋 **Health Insurance Integration**

---

## 2. Technical Architecture

### 2.1 Technology Stack

#### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Radix UI, shadcn/ui
- **State Management:** React Hooks, TanStack Query
- **Routing:** React Router DOM v6
- **Mobile:** Capacitor v7 (Android & iOS)

#### Backend
- **Platform:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Database:** PostgreSQL with Row Level Security (RLS)
- **Storage:** Supabase Storage
- **Edge Functions:** Supabase/Deno for AI processing
- **Real-time:** Supabase Realtime subscriptions

#### AI Services
- **AI Gateway:** Lovable AI Gateway / OpenAI
- **Models:** GPT-based models for health consultation
- **Voice:** Web Speech API with African voices

### 2.2 Database Schema

#### Core Tables Implemented

**profiles**
```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- full_name (text)
- avatar_url (text)
- bio (text)
- date_of_birth (date)
- created_at (timestamp)
- updated_at (timestamp)
```

**diet_entries**
```sql
- id (uuid, primary key)
- user_id (uuid)
- meal_name (text)
- meal_type (text)
- calories (integer)
- protein (numeric)
- carbs (numeric)
- fats (numeric)
- meal_time (timestamp)
- image_url (text)
- notes (text)
- created_at (timestamp)
```

**meal_categories**
```sql
- id (uuid, primary key)
- user_id (uuid)
- name (text)
- description (text)
- color (text)
- items (jsonb)
- created_at (timestamp)
```

**ai_consultations**
```sql
- id (uuid, primary key)
- user_id (uuid)
- symptoms (text[])
- ai_recommendation (text)
- severity_level (text)
- recommended_action (text)
- created_at (timestamp)
```

**messages**
```sql
- id (uuid, primary key)
- sender_id (uuid)
- recipient_id (uuid)
- content (text)
- is_read (boolean)
- created_at (timestamp)
```

**connections**
```sql
- id (uuid, primary key)
- user_id (uuid)
- connected_user_id (uuid)
- status (text)
- created_at (timestamp)
```

**health_goals**
```sql
- id (uuid, primary key)
- user_id (uuid)
- goal_type (text)
- target_value (numeric)
- current_value (numeric)
- deadline (date)
- status (text)
- created_at (timestamp)
```

### 2.3 Security Implementation

#### Row Level Security (RLS)
- ✅ Enabled on all user-specific tables
- ✅ Policies enforce user data isolation
- ✅ Public read for profiles (privacy-respecting)
- ✅ Owner-only write for sensitive data

#### Authentication
- ✅ Email/password authentication
- ✅ JWT-based session management
- ✅ Secure token storage
- ✅ Session timeout handling

#### Data Protection
- ✅ HTTPS-only communication
- ✅ Environment variables for secrets
- ✅ Supabase security best practices
- 📋 End-to-end encryption (planned)

---

## 3. Non-Functional Requirements

### 3.1 Performance

#### Current Metrics
- **Page Load Time:** < 3 seconds (target)
- **Time to Interactive:** < 5 seconds (target)
- **Database Query Response:** < 500ms average
- **Real-time Message Delivery:** < 1 second

#### Optimization Strategies
- Lazy loading for routes
- Image optimization (WebP format)
- Code splitting
- Service worker caching
- Database query optimization with indexes

### 3.2 Scalability

#### Current Capacity
- **Users:** Designed for 10,000+ concurrent users
- **Database:** Supabase managed PostgreSQL
- **Storage:** Unlimited (Supabase)
- **Edge Functions:** Auto-scaling

#### Growth Strategy
- Horizontal scaling via Supabase infrastructure
- CDN for static assets
- Caching strategies for frequently accessed data

### 3.3 Reliability

#### Availability
- **Target Uptime:** 99.9%
- **Backup Frequency:** Daily (Supabase managed)
- **Recovery Time Objective (RTO):** < 1 hour
- **Recovery Point Objective (RPO):** < 24 hours

#### Error Handling
- Graceful degradation
- User-friendly error messages
- Automatic retry mechanisms
- Offline mode for data persistence

### 3.4 Usability

#### Accessibility (WCAG 2.1 Level AA)
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ High contrast mode (Braille mode)
- ✅ Voice commands
- ✅ Text-to-speech
- ✅ Touch-optimized for mobile
- 📋 Color blind modes (planned)

#### User Experience
- Intuitive navigation
- Consistent design system
- Responsive across devices
- Fast interactions
- Clear feedback and confirmations

### 3.5 Compliance

#### Data Privacy
- ✅ GDPR-ready architecture
- ✅ User data ownership
- ✅ Data export capability
- ✅ Account deletion
- 📋 HIPAA compliance (for US expansion)

#### Medical Disclaimers
- ✅ AI consultation disclaimers
- ✅ "Not medical advice" notices
- ✅ Recommendation to consult professionals

---

## 4. User Interface Requirements

### 4.1 Design System

#### Color Palette
- Primary: Royal Blue (#2B3674)
- Secondary: HemApp Green (#10B981)
- Accent: Dark Purple (#4B0082)
- Semantic tokens for all colors (HSL)

#### Typography
- Primary Font: System font stack
- Responsive font sizes (mobile-first)
- Accessible contrast ratios

#### Components
- Consistent UI component library (shadcn/ui)
- Custom themed variants
- Mobile-optimized touch targets (min 44x44px)

### 4.2 Key Screens

#### Welcome/Onboarding
- ✅ Feature introduction
- ✅ Voice and accessibility options
- ✅ Get started CTA

#### Dashboard
- ✅ Health metrics overview
- ✅ Quick action buttons
- ✅ Recent activity feed
- ✅ Navigation to all features

#### Diet Monitoring
- ✅ Meal logging form
- ✅ Meal list with stats
- ✅ Category management
- ✅ Nutrition goals
- ✅ Trends visualization

#### AI Consultation
- ✅ Symptom input textarea
- ✅ AI analysis button
- ✅ Consultation history
- ✅ Severity badges
- ✅ Recommendations display

#### Messages
- ✅ Conversation list
- ✅ Chat interface
- ✅ HemBot integration
- ✅ Unread badges
- ✅ Real-time updates

#### Healthcare Facilities
- ✅ Facility directory
- ✅ Search and filter
- ✅ Facility details
- ✅ Contact information

#### User Account
- ✅ Profile editing
- ✅ Settings management
- ✅ Privacy controls
- ✅ Sign out

### 4.3 Mobile Responsiveness

#### Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

#### Mobile-Specific Features
- ✅ Touch-optimized interactions
- ✅ Swipe gestures
- ✅ Bottom navigation
- ✅ Collapsible sidebar
- ✅ Mobile-friendly forms

---

## 5. Integration Requirements

### 5.1 Current Integrations

#### Supabase
- ✅ Authentication
- ✅ PostgreSQL Database
- ✅ Storage for images
- ✅ Real-time subscriptions
- ✅ Edge functions

#### AI Services
- ✅ Lovable AI Gateway
- ✅ OpenAI-compatible API
- ✅ Edge function for AI processing

#### Web APIs
- ✅ Web Speech API (voice)
- ✅ Geolocation API
- ✅ Camera API (via Capacitor)

### 5.2 Planned Integrations

#### Healthcare Services
- 📋 Telemedicine platforms
- 📋 Health insurance providers
- 📋 Pharmacy networks
- 📋 Lab results integration

#### Device Integration
- 📋 Apple HealthKit
- 📋 Google Fit
- 📋 Bluetooth smartwatches
- 📋 Fitness trackers

#### Payment Services
- 📋 Mobile Money (Orange Money, MTN MoMo)
- 📋 Credit/debit cards
- 📋 PayPal

#### Maps & Location
- 📋 Google Maps API (real facility data)
- 📋 OpenStreetMap
- 📋 Geolocation services

---

## 6. Testing Requirements

### 6.1 Testing Strategy

#### Unit Testing
- Component testing with Jest
- Hook testing with React Testing Library
- Edge function testing

#### Integration Testing
- API endpoint testing
- Database operation testing
- Real-time subscription testing

#### End-to-End Testing
- User flow testing with Cypress
- Cross-browser testing
- Mobile device testing

### 6.2 Test Coverage Goals
- **Code Coverage:** > 80%
- **Critical Paths:** 100%
- **Edge Functions:** 100%

### 6.3 Device Testing Matrix
- **Android:** 10, 11, 12, 13, 14
- **iOS:** 14, 15, 16, 17
- **Browsers:** Chrome, Safari, Firefox, Edge
- **Screen Sizes:** 320px to 2560px

---

## 7. Deployment Requirements

### 7.1 Environment Setup

#### Development
- Local Supabase instance
- Hot reload enabled
- Debug logging

#### Staging
- Supabase staging project
- Production-like data
- Testing access only

#### Production
- Supabase production project
- SSL/HTTPS enforced
- Monitoring enabled
- Backup configured

### 7.2 CI/CD Pipeline

#### Build Process
- Automated testing on commit
- Build optimization
- Bundle size checks
- Linting and type checking

#### Deployment Process
- Automatic deployment to staging
- Manual approval for production
- Rollback capability
- Health checks post-deployment

### 7.3 Monitoring & Analytics

#### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- Health metrics tracking

#### Infrastructure Monitoring
- Database performance
- API response times
- Storage usage
- Edge function execution

---

## 8. Maintenance Requirements

### 8.1 Regular Maintenance

#### Weekly
- Dependency updates review
- Security patches
- Bug fixes
- Performance monitoring

#### Monthly
- Database optimization
- Backup verification
- User feedback review
- Feature usage analysis

#### Quarterly
- Major feature releases
- Security audits
- Compliance reviews
- Documentation updates

### 8.2 Support Requirements

#### User Support
- In-app help center (FAQ)
- Email support
- Community forum (planned)
- Live chat (planned)

#### Technical Support
- On-call rotation
- Incident response plan
- Escalation procedures
- Post-mortem analysis

---

## 9. Success Metrics

### 9.1 User Metrics (Year 1 Targets)

| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|-----|-----|-----|-----|
| Active Users | 500 | 2,000 | 5,000 | 10,000 |
| Daily Active Users | 250 | 1,000 | 3,000 | 6,000 |
| 30-day Retention | 40% | 50% | 55% | 60% |
| Premium Conversion | 5% | 5% | 6% | 7% |

### 9.2 Engagement Metrics

- **Session Duration:** > 5 minutes average
- **Sessions per Week:** > 4 per active user
- **Feature Adoption:**
  - Diet tracking: 80% of users
  - AI consultation: 60% of users
  - Messaging: 40% of users
  - Health goals: 70% of users

### 9.3 Health Impact Metrics

- **Meals Logged:** 100,000+ by end of year 1
- **AI Consultations:** 50,000+ by end of year 1
- **Health Goals Achieved:** 5,000+ by end of year 1
- **Healthcare Connections:** 500+ by end of year 1

### 9.4 Business Metrics

- **Customer Acquisition Cost (CAC):** < 5,000 CFA
- **Lifetime Value (LTV):** > 50,000 CFA
- **LTV/CAC Ratio:** > 10:1
- **Monthly Recurring Revenue (MRR):** 1,750,000 CFA by Q4
- **Churn Rate:** < 5% monthly

### 9.5 Technical Metrics

- **App Store Rating:** > 4.5 stars
- **Crash-free Rate:** > 99.5%
- **API Response Time:** < 500ms p95
- **Page Load Time:** < 3 seconds p95
- **Uptime:** > 99.9%

---

## 10. Risk Management

### 10.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| AI service outage | Low | High | Fallback responses, caching |
| Database performance issues | Medium | High | Query optimization, caching, indexes |
| Mobile app store rejection | Low | Medium | Follow guidelines, early testing |
| Security breach | Low | Critical | Encryption, audits, monitoring |

### 10.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Low user adoption | Medium | Critical | Marketing, referral program, free tier |
| Competition | High | Medium | Unique features, community building |
| Regulatory changes | Low | High | Legal consultation, compliance monitoring |
| Funding shortage | Medium | High | Cost optimization, revenue diversification |

---

## 11. Future Roadmap

### Phase 1 (Months 1-6): Market Entry
- ✅ Core features complete
- ✅ MVP launched
- 📋 User acquisition campaigns
- 📋 Initial partnerships with healthcare facilities

### Phase 2 (Months 7-12): Growth
- 📋 Premium tier launch
- 📋 B2B corporate wellness
- 📋 Telemedicine integration
- 📋 Advanced analytics

### Phase 3 (Year 2): Scale
- 📋 Multi-country expansion
- 📋 Insurance integration
- 📋 Healthcare provider network
- 📋 Group features and communities

### Phase 4 (Year 3): Maturity
- 📋 AI predictive health models
- 📋 Wearable device ecosystem
- 📋 Research partnerships
- 📋 International markets

---

## 12. Appendices

### Appendix A: Glossary

- **HemBot:** AI-powered health assistant within HemApp
- **RLS:** Row Level Security for database access control
- **Edge Function:** Serverless function for backend processing
- **PWA:** Progressive Web App
- **CAC:** Customer Acquisition Cost
- **LTV:** Lifetime Value
- **MRR:** Monthly Recurring Revenue

### Appendix B: References

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [GDPR Compliance](https://gdpr.eu)

### Appendix C: Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Initial | Development Team | Initial SRS |
| 2.0 | Update | Development Team | Feature updates |
| 3.0 | October 2025 | AI Development | Current implementation state |

---

**End of Document**

**Approved by:** Development Team  
**Date:** October 2025  
**Next Review:** January 2026
