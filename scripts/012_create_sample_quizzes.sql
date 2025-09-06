-- Insert sample quizzes for testing
INSERT INTO public.quizzes (title, description, category, difficulty, questions, passing_score, time_limit_minutes, pok_points, is_active) VALUES
(
  'JavaScript Fundamentals',
  'Test your knowledge of core JavaScript concepts including variables, functions, and control structures.',
  'JavaScript',
  'beginner',
  '[
    {
      "question": "What is the correct way to declare a variable in JavaScript?",
      "options": ["var myVar = 5;", "variable myVar = 5;", "v myVar = 5;", "declare myVar = 5;"],
      "correct_answer": "var myVar = 5;",
      "explanation": "Variables in JavaScript are declared using var, let, or const keywords."
    },
    {
      "question": "Which method is used to add an element to the end of an array?",
      "options": ["push()", "add()", "append()", "insert()"],
      "correct_answer": "push()",
      "explanation": "The push() method adds one or more elements to the end of an array."
    },
    {
      "question": "What does === operator do in JavaScript?",
      "options": ["Assignment", "Equality without type conversion", "Equality with type conversion", "Not equal"],
      "correct_answer": "Equality without type conversion",
      "explanation": "The === operator checks for strict equality, comparing both value and type."
    },
    {
      "question": "How do you create a function in JavaScript?",
      "options": ["function myFunction() {}", "create myFunction() {}", "def myFunction() {}", "func myFunction() {}"],
      "correct_answer": "function myFunction() {}",
      "explanation": "Functions in JavaScript are declared using the function keyword."
    },
    {
      "question": "What is the result of typeof null in JavaScript?",
      "options": ["null", "undefined", "object", "boolean"],
      "correct_answer": "object",
      "explanation": "This is a known quirk in JavaScript where typeof null returns object."
    }
  ]'::jsonb,
  70,
  15,
  100,
  true
),
(
  'React Hooks Mastery',
  'Advanced quiz covering React Hooks including useState, useEffect, and custom hooks.',
  'React',
  'intermediate',
  '[
    {
      "question": "What is the purpose of the useEffect hook?",
      "options": ["Managing state", "Handling side effects", "Creating components", "Routing"],
      "correct_answer": "Handling side effects",
      "explanation": "useEffect is used to perform side effects in functional components."
    },
    {
      "question": "How do you prevent useEffect from running on every render?",
      "options": ["Use useState", "Provide a dependency array", "Use useCallback", "Use useMemo"],
      "correct_answer": "Provide a dependency array",
      "explanation": "The dependency array controls when useEffect runs."
    },
    {
      "question": "What does useState return?",
      "options": ["A single value", "An array with state and setter", "An object", "A function"],
      "correct_answer": "An array with state and setter",
      "explanation": "useState returns an array containing the current state value and a function to update it."
    },
    {
      "question": "When should you use useCallback?",
      "options": ["Always", "To memoize functions", "To manage state", "To handle events"],
      "correct_answer": "To memoize functions",
      "explanation": "useCallback is used to memoize functions to prevent unnecessary re-renders."
    }
  ]'::jsonb,
  75,
  20,
  150,
  true
),
(
  'Blockchain Fundamentals',
  'Test your understanding of blockchain technology, consensus mechanisms, and cryptocurrency basics.',
  'Blockchain',
  'beginner',
  '[
    {
      "question": "What is a blockchain?",
      "options": ["A type of database", "A distributed ledger", "A programming language", "A web framework"],
      "correct_answer": "A distributed ledger",
      "explanation": "A blockchain is a distributed ledger that maintains a continuously growing list of records."
    },
    {
      "question": "What is the purpose of mining in blockchain?",
      "options": ["Creating new coins", "Validating transactions", "Both creating coins and validating transactions", "Storing data"],
      "correct_answer": "Both creating coins and validating transactions",
      "explanation": "Mining serves dual purposes: validating transactions and creating new cryptocurrency."
    },
    {
      "question": "What makes blockchain secure?",
      "options": ["Passwords", "Cryptographic hashing", "Firewalls", "Antivirus software"],
      "correct_answer": "Cryptographic hashing",
      "explanation": "Blockchain security relies on cryptographic hashing and consensus mechanisms."
    }
  ]'::jsonb,
  70,
  10,
  120,
  true
);

-- Create function to increment POK score
CREATE OR REPLACE FUNCTION increment_pok_score(talent_id UUID, points INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.talents 
  SET total_pok_score = COALESCE(total_pok_score, 0) + points
  WHERE id = talent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
