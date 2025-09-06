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

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Web3**: Account Abstraction (ERC-4337), ENS, Polygon/Base
- **AI**: Google Gemini API for quiz generation
- **Wallet**: Web3Auth MPC, Biconomy/Stackup bundler
- **UI**: shadcn/ui components, Radix UI primitives

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
NEXT_PUBLIC_BUNDLER_URL=your_aa_bundler_endpoint
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
ENS_REGISTRAR_ADDRESS=deployed_ens_registrar_contract_address
POK_CONTRACT_ADDRESS=deployed_pok_contract_address
POS_CONTRACT_ADDRESS=deployed_pos_contract_address
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

## 🔐 Security Features

- Row Level Security (RLS) on all Supabase tables
- Smart contract wallet security with Account Abstraction
- Soulbound tokens (non-transferable NFTs)
- Gasless transactions to prevent wallet draining
- ENS-based identity verification

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
