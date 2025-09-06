"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface QuizQuestionProps {
  question: {
    question: string
    options: string[]
    correct_answer: string
    explanation?: string
  }
  questionIndex: number
  selectedAnswer?: string
  onAnswerChange: (questionIndex: number, answer: string) => void
}

export function QuizQuestion({ question, questionIndex, selectedAnswer, onAnswerChange }: QuizQuestionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 leading-relaxed">{question.question}</h2>
      </div>

      <RadioGroup
        value={selectedAnswer || ""}
        onValueChange={(value) => onAnswerChange(questionIndex, value)}
        className="space-y-3"
      >
        {question.options.map((option, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedAnswer === option ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-900 leading-relaxed">
                  {option}
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
    </div>
  )
}
