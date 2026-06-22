import mongoose, { Document, Schema } from 'mongoose'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface ITestCase {
  input:          string
  expectedOutput: string
}

export interface IProblem extends Document {
  title:       string
  slug:        string
  description: string
  difficulty:  Difficulty
  tags:        string[]
  testCases:   ITestCase[]
  examples:    ITestCase[]
  constraints: string
  createdAt:   Date
}

const testCaseSchema = new Schema<ITestCase>(
  {
    input:          { type: String, required: true },
    expectedOutput: { type: String, required: true },
  },
  { _id: false }
)

const problemSchema = new Schema<IProblem>(
  {
    title: {
      type:     String,
      required: true,
      trim:     true,
    },
    slug: {
      type:     String,
      required: true,
      unique:   true,
      lowercase: true,
      trim:     true,
    },
    description: {
      type:     String,
      required: true,
    },
    difficulty: {
      type:     String,
      enum:     ['easy', 'medium', 'hard'],
      required: true,
    },
    tags: {
      type:    [String],
      default: [],
    },
    testCases: {
      type:     [testCaseSchema],
      required: true,
    },
    examples: {
      type:     [testCaseSchema],
      required: true,
    },
    constraints: {
      type:    String,
      default: '',
    },
  },
  { timestamps: true }
)

export const Problem = mongoose.model<IProblem>('Problem', problemSchema)