-- Insert sample projects for testing
INSERT INTO public.projects (title, description, category, difficulty, requirements, deliverables, estimated_hours, pos_points, is_active) VALUES
(
  'E-commerce Product Page',
  'Build a responsive product page for an e-commerce website with shopping cart functionality, product images, reviews, and checkout process.',
  'Frontend',
  'intermediate',
  '{
    "technical": [
      "Use React or Vue.js for the frontend framework",
      "Implement responsive design that works on mobile and desktop",
      "Add shopping cart functionality with local storage",
      "Include product image gallery with zoom feature",
      "Implement user reviews and ratings system",
      "Add form validation for checkout process"
    ],
    "design": [
      "Clean, modern UI design",
      "Consistent color scheme and typography",
      "Intuitive user experience",
      "Loading states and error handling"
    ]
  }'::jsonb,
  ARRAY[
    'Fully functional product page with all features',
    'Responsive design working on all screen sizes',
    'Shopping cart with add/remove/update functionality',
    'Product image gallery with zoom and thumbnails',
    'User review system with star ratings',
    'Checkout form with validation',
    'GitHub repository with clean code and README',
    'Live demo deployed on Vercel/Netlify'
  ],
  25,
  200,
  true
),
(
  'Task Management API',
  'Create a RESTful API for a task management application with user authentication, CRUD operations, and real-time updates.',
  'Backend',
  'intermediate',
  '{
    "technical": [
      "Use Node.js with Express or Python with FastAPI",
      "Implement JWT authentication and authorization",
      "Create CRUD endpoints for tasks and users",
      "Add database integration (PostgreSQL or MongoDB)",
      "Implement real-time updates using WebSockets",
      "Add input validation and error handling",
      "Include API documentation with Swagger/OpenAPI"
    ],
    "architecture": [
      "Follow RESTful API design principles",
      "Implement proper error handling and status codes",
      "Use environment variables for configuration",
      "Add logging and monitoring",
      "Include unit and integration tests"
    ]
  }'::jsonb,
  ARRAY[
    'Complete REST API with all endpoints',
    'User authentication and authorization system',
    'Database schema and migrations',
    'Real-time updates via WebSockets',
    'API documentation (Swagger/Postman)',
    'Unit and integration tests',
    'Docker configuration for deployment',
    'GitHub repository with setup instructions'
  ],
  30,
  250,
  true
),
(
  'Cryptocurrency Portfolio Tracker',
  'Build a full-stack application that tracks cryptocurrency portfolios with real-time price updates and portfolio analytics.',
  'Fullstack',
  'advanced',
  '{
    "technical": [
      "Frontend: React/Next.js or Vue/Nuxt.js",
      "Backend: Node.js/Express or Python/Django",
      "Database: PostgreSQL or MongoDB",
      "Integrate with cryptocurrency APIs (CoinGecko, CoinMarketCap)",
      "Implement real-time price updates",
      "Add user authentication and portfolio management",
      "Create interactive charts and analytics",
      "Implement responsive design"
    ],
    "features": [
      "User registration and authentication",
      "Add/remove cryptocurrencies to portfolio",
      "Real-time price tracking and updates",
      "Portfolio value calculation and history",
      "Interactive charts and graphs",
      "Price alerts and notifications",
      "Export portfolio data"
    ]
  }'::jsonb,
  ARRAY[
    'Complete full-stack application',
    'User authentication system',
    'Portfolio management functionality',
    'Real-time price updates',
    'Interactive charts and analytics',
    'Responsive web design',
    'API integration with crypto data providers',
    'Database design and implementation',
    'Deployment on cloud platform',
    'Comprehensive documentation'
  ],
  40,
  350,
  true
),
(
  'Smart Contract Voting System',
  'Develop a decentralized voting system using Solidity smart contracts with a web interface for creating and participating in votes.',
  'Blockchain',
  'advanced',
  '{
    "technical": [
      "Write smart contracts in Solidity",
      "Deploy contracts to Ethereum testnet",
      "Create web interface using React and Web3.js/Ethers.js",
      "Implement MetaMask integration",
      "Add voting creation and participation features",
      "Include vote counting and result display",
      "Implement access control and security measures"
    ],
    "blockchain": [
      "Smart contract security best practices",
      "Gas optimization techniques",
      "Event logging for transparency",
      "Role-based access control",
      "Prevent double voting",
      "Secure vote tallying"
    ]
  }'::jsonb,
  ARRAY[
    'Solidity smart contracts for voting system',
    'Smart contract deployment scripts',
    'Web interface for creating votes',
    'Voting participation interface',
    'MetaMask wallet integration',
    'Vote results and analytics display',
    'Smart contract security audit report',
    'Testnet deployment with verified contracts',
    'User guide and technical documentation'
  ],
  35,
  400,
  true
),
(
  'Mobile Weather App',
  'Create a cross-platform mobile application that provides weather forecasts with location-based services and offline functionality.',
  'Mobile',
  'beginner',
  '{
    "technical": [
      "Use React Native or Flutter",
      "Integrate with weather API (OpenWeatherMap)",
      "Implement location-based services",
      "Add offline data caching",
      "Create intuitive user interface",
      "Include weather alerts and notifications",
      "Support both iOS and Android platforms"
    ],
    "features": [
      "Current weather display",
      "5-day weather forecast",
      "Location-based weather data",
      "Search for different cities",
      "Favorite locations management",
      "Weather alerts and notifications",
      "Offline mode with cached data"
    ]
  }'::jsonb,
  ARRAY[
    'Cross-platform mobile application',
    'Weather data integration',
    'Location services implementation',
    'Offline functionality',
    'Push notifications system',
    'User-friendly interface design',
    'App store ready build',
    'Source code with documentation'
  ],
  20,
  180,
  true
);

-- Create function to increment POS score
CREATE OR REPLACE FUNCTION increment_pos_score(talent_id UUID, points INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.talents 
  SET total_pos_score = COALESCE(total_pos_score, 0) + points
  WHERE id = talent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
