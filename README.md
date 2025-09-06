# FOWOS Talent OS

*Future of Work Operating System - Web3 Talent Marketplace*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/fow-oss-projects/v0-fowos-talent-os)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/NRBC9SyUC1x)

## Overview

FOWOS (Future of Work Operating System) is a comprehensive Web3-enabled talent marketplace that connects verified professionals with employers through blockchain-based credentials. Users can prove their knowledge (POK) through quizzes and skills (POS) through projects, earning NFT/SBT credentials that are stored on-chain.

## 🚀 Features

- **POK (Proof of Knowledge)**: Quiz-based knowledge verification with NFT credentials
- **POS (Proof of Skill)**: Project-based skill verification with NFT credentials  
- **Web3 Integration**: Smart contract wallets, ENS domains, gasless transactions
- **Talent Marketplace**: Dynamic filtering and discovery of verified talent
- **Employer Dashboard**: Hire talent with verified blockchain credentials
- **AI-Generated Quizzes**: Dynamic quiz generation using Gemini API
- **Comprehensive Profiles**: Detailed talent profiles with POK/POS history
- **Immutable POK Records**: Store POK records on Story Protocol for immutability
- **Blockchain Quiz Verification**: Verify quiz attempts on the blockchain
- **Decentralized Credentials**: Use decentralized proof of knowledge credentials
- **Cross-Chain Compatibility**: Ensure credential verification across different chains
- **Quiz Tamper-Proofing**: Protect quizzes from tampering with tab switching detection
- **Right-Click Protection**: Prevent right-click and copy during quizzes
- **Secure Quiz Submission**: Ensure secure quiz submission with blockchain verification
- **Anti-Cheating Measures**: Implement anti-cheating measures and session monitoring
- **QuizStorage.sol Contract**: Use QuizStorage.sol contract for on-chain quiz data
- **Automated NFT Minting**: Automatically mint NFTs upon quiz completion
- **Pinata IPFS Integration**: Integrate Pinata IPFS for metadata storage
- **Web3Auth with Sepolia Support**: Use Web3Auth with Sepolia testnet support
- **Authentication Fixes**: Resolve authentication hanging and timeout issues
- **Error Handling**: Add proper error handling with detailed debugging
- **Session Management**: Improve session management and resolve redirect loops
- **Middleware Improvements**: Enhance middleware with timeout protection
- **Navigation Fixes**: Fix dropdown menu visibility issues
- **Z-Index Styling**: Proper z-index and styling for submenus
- **For Talents Dropdown**: Enhance "For Talents" dropdown functionality
- **Mobile Navigation**: Improve mobile navigation responsiveness
- **Gemini API Fallback**: Add fallback dummy questions for reliability
- **Confetti Celebrations**: Enhance quiz submission with confetti celebrations
- **Quiz Interface**: Improve quiz interface with better error handling
- **Duplicate Navigation Bars**: Eliminate duplicate navigation bars on quiz pages
- **Button Text Change**: Change "AI Generate" button text to "Generate"
- **Loading States**: Add loading states and success feedback
- **Error Messages**: Improve error messages for better debugging
- **Hire Talent Workflow**: Complete hire talent workflow implementation
- **Skill Selection**: Offer skill selection and engagement type options
- **Rate Negotiation**: Include rate negotiation and messaging system
- **Job Request Management**: Manage job requests in the dashboard
- **Interactive Onboarding**: Implement accordion-style onboarding wizard after signup
- **ENS Welcome Message**: Display ENS welcome message and setup
- **Guided Minting**: Guide POK and POS minting process
- **Company Profile Completion**: Complete company profile for employers
- **About Page**: Provide comprehensive guides for talents and companies
- **Platform Explanation**: Explain platform features and functionality
- **Getting Started Instructions**: Offer getting started instructions and best practices

## 📋 Changelog

### v1.0.0 - Initial Release
**Core Platform**
- ✅ Complete database schema with 13 SQL migrations
- ✅ Supabase authentication integration with RLS policies
- ✅ Talent and employer onboarding flows
- ✅ Home page with navigation system

**POK System**
- ✅ Quiz browsing and taking interface
- ✅ Timer-based quiz completion
- ✅ Scoring system with POK point rewards
- ✅ Sample quizzes across multiple categories

**POS System**  
- ✅ Project browsing and submission interface
- ✅ Multi-skill project submissions
- ✅ Project verification workflow
- ✅ Sample projects across technical domains

**Marketplace & Profiles**
- ✅ Talent discovery with filtering
- ✅ Individual talent profile pages
- ✅ Leaderboard with POK/POS rankings
- ✅ Review and rating system

### v1.1.0 - Enhanced User Experience
**Navigation & Access**
- ✅ Global navigation header on all pages
- ✅ Public access to marketplace, quizzes, and projects
- ✅ Authentication required only for actions (submit, hire, etc.)

**Enhanced Projects**
- ✅ Project submission with title, description, URL, role
- ✅ Multi-select skill tagging (60+ categories)
- ✅ Verification system with proof uploads
- ✅ WYSIWYG text editor for project descriptions

**Categories & Filtering**
- ✅ 60+ categories across technical, business, marketing, design
- ✅ Dynamic search and filtering functionality
- ✅ Category-based leaderboards

**Leaderboard Enhancements**
- ✅ Dynamic filtering by POK/POS, category, country, date range
- ✅ User icons, names, ENS addresses, timestamps
- ✅ Direct links to talent profiles

**Dashboard Improvements**
- ✅ Action buttons for "Prove Your Knowledge" and "Prove Your Skill"
- ✅ Quick access to quiz and project submission flows

### v1.2.0 - Bug Fixes & Public Access
**Authentication Fixes**
- ✅ Fixed repeating authentication request issue
- ✅ Improved middleware for public page access
- ✅ Conditional authentication for protected actions

**Quiz System Fixes**
- ✅ Fixed quiz completion and scoring issues
- ✅ Proper state management for quiz progress
- ✅ Accurate POK point calculation and storage

**Marketplace Enhancements**
- ✅ All users visible on marketplace (talents and employers)
- ✅ Enhanced sorting by POK/POS scores
- ✅ Improved user profile display with comprehensive info

### v1.3.0 - AI Integration & Web3 Foundation
**Gemini API Integration**
- ✅ Dynamic quiz question generation based on topic/skill
- ✅ Configurable difficulty and experience levels
- ✅ Auto-storage of generated quizzes in Supabase
- ✅ 10 multiple choice questions per generated quiz

**Dashboard Enhancements**
- ✅ "My Attempts" section showing attempted quizzes and projects
- ✅ Retake functionality for failed attempts
- ✅ Progress tracking and history

**Web3 Infrastructure**
- ✅ Smart contract wallet creation with Account Abstraction (ERC-4337)
- ✅ ENS subdomain registration (username.fowos.eth)
- ✅ POK/POS Soulbound Token contracts (ERC-721 non-transferable)
- ✅ Gasless transactions with sponsor relayer
- ✅ Web3Auth integration for social/email login

### v1.4.0 - Blockchain Integration & Security
**Story Protocol Integration**
- ✅ Immutable POK record storage on Story Protocol
- ✅ Blockchain-based quiz attempt verification
- ✅ Decentralized proof of knowledge credentials
- ✅ Cross-chain compatibility for credential verification

**Enhanced Security**
- ✅ Quiz tamper-proofing with tab switching detection
- ✅ Right-click and copy protection during quizzes
- ✅ Secure quiz submission with blockchain verification
- ✅ Anti-cheating measures and session monitoring

**Smart Contract Integration**
- ✅ QuizStorage.sol contract for on-chain quiz data
- ✅ Automated NFT minting upon quiz completion
- ✅ Pinata IPFS integration for metadata storage
- ✅ Web3Auth with Sepolia testnet support

### v1.5.0 - Critical Fixes & UX Improvements
**Authentication Fixes**
- ✅ Fixed authentication hanging and timeout issues
- ✅ Added proper error handling with detailed debugging
- ✅ Resolved redirect loops and session management
- ✅ Improved middleware with timeout protection

**Navigation Enhancements**
- ✅ Fixed dropdown menu visibility issues
- ✅ Proper z-index and styling for submenus
- ✅ Enhanced "For Talents" dropdown functionality
- ✅ Improved mobile navigation responsiveness

**Quiz System Improvements**
- ✅ Fixed Gemini API Internal Server Error
- ✅ Added fallback dummy questions for reliability
- ✅ Enhanced quiz submission with confetti celebrations
- ✅ Improved quiz interface with better error handling

**UI/UX Polish**
- ✅ Eliminated duplicate navigation bars on quiz pages
- ✅ Changed "AI Generate" button text to "Generate"
- ✅ Added loading states and success feedback
- ✅ Improved error messages for better debugging

**Hire Talent Flow**
- ✅ Complete hire talent workflow implementation
- ✅ Skill selection and engagement type options
- ✅ Rate negotiation and messaging system
- ✅ Job request management in dashboard

**Interactive Onboarding**
- ✅ Accordion-style onboarding wizard after signup
- ✅ ENS welcome message and setup
- ✅ Guided POK and POS minting process
- ✅ Company profile completion for employers

**About Page**
- ✅ Comprehensive guides for talents and companies
- ✅ Platform explanation and feature overview
- ✅ Getting started instructions and best practices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Web3**: Account Abstraction (ERC-4337), ENS, Polygon/Base, Sepolia
- **AI**: Google Gemini API for quiz generation
- **Wallet**: Web3Auth MPC, Biconomy/Stackup bundler
- **UI**: shadcn/ui components, Radix UI primitives
- **Blockchain**: Story Protocol, QuizStorage.sol contract

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Web3 Configuration
NEXT_PUBLIC_RPC_URL=your_polygon_or_base_rpc_url
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
NEXT_PUBLIC_QUIZ_CONTRACT_ADDRESS=deployed_quiz_contract_address
PINATA_JWT=your_pinata_jwt_token
NEXT_PUBLIC_PINATA_GATEWAY=your_pinata_gateway_url
PRIVATE_KEY=backend_relayer_private_key_for_sponsored_gas
\`\`\`

## 🚀 Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-org/fowos-talent-os.git
   cd fowos-talent-os
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in all required environment variables

4. **Set up Supabase**
   - Create a new Supabase project
   - Run all SQL migrations in order (001-013)
   - Configure RLS policies

5. **Deploy Smart Contracts**
   - Deploy ENS subdomain registrar under `fowos.eth`
   - Deploy POK and POS soulbound token contracts
   - Deploy QuizStorage.sol contract
   - Configure gasless relayer (Biconomy or Stackup)

6. **Configure Web3Auth**
   - Register app with Web3Auth for MPC wallet creation
   - Fund sponsor account for gasless transactions

7. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

## 📚 API Routes

- `/api/quiz/generate` - Generate AI-powered quiz questions
- `/api/mintPOK` - Mint POK soulbound tokens
- `/api/mintPOS` - Mint POS soulbound tokens  
- `/api/updateENS` - Sync ENS text records with profile data
- `/api/wallet/create` - Create smart contract wallet for new users
- `/api/storeQuiz` - Store generated quizzes on Story Protocol
- `/api/verifyQuiz` - Verify quiz attempts on the blockchain

## 🏗️ Database Schema

The platform uses 13 main tables:
- `profiles` - User profiles extending Supabase auth
- `talents` - Talent-specific information and credentials
- `employers` - Employer company information
- `quizzes` - Quiz content and metadata
- `quiz_attempts` - User quiz attempts and scores
- `projects` - Project requirements and details
- `project_submissions` - User project submissions
- `nft_tokens` - POK/POS NFT credential tracking
- `reviews` - Talent reviews and ratings
- `jobs` - Job postings and hiring requests
- `quiz_storage` - On-chain quiz data storage

## 🔐 Security Features

- Row Level Security (RLS) on all Supabase tables
- Smart contract wallet security with Account Abstraction
- Soulbound tokens (non-transferable NFTs)
- Gasless transactions to prevent wallet draining
- ENS-based identity verification
- Quiz tamper-proofing with tab switching detection
- Right-click and copy protection during quizzes
- Secure quiz submission with blockchain verification
- Anti-cheating measures and session monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://vercel.com/fow-oss-projects/v0-fowos-talent-os](https://vercel.com/fow-oss-projects/v0-fowos-talent-os)
- **v0 Project**: [https://v0.app/chat/projects/NRBC9SyUC1x](https://v0.app/chat/projects/NRBC9SyUC1x)
- **Documentation**: Coming soon
- **Discord**: Coming soon
