import mongoose, { Document, Schema } from 'mongoose'

export type SubmissionStatus = 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error'
export type Language = 'python' | 'cpp' | 'java' | 'javascript'

export interface ISubmission extends Document {
  userId:    mongoose.Types.ObjectId
  problemId: mongoose.Types.ObjectId
  code:      string
  language:  Language
  status:    SubmissionStatus
  runtime:   number
  stderr:    string
  createdAt: Date
}

const submissionSchema = new Schema<ISubmission>(
  {
    userId: {
      type:     Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    problemId: {
      type:     Schema.Types.ObjectId,
      ref:      'Problem',
      required: true,
    },
    code: {
      type:     String,
      required: true,
    },
    language: {
      type:     String,
      enum:     ['python', 'cpp', 'java', 'javascript'],
      required: true,
    },
    status: {
      type:     String,
      enum:     ['accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compilation_error'],
      required: true,
    },
    runtime: {
      type:    Number,
      default: 0,
    },
    stderr: {
      type:    String,
      default: '',
    },
  },
  { timestamps: true }
)

submissionSchema.index({ userId: 1, problemId: 1 })
submissionSchema.index({ problemId: 1, status: 1 })

export const Submission = mongoose.model<ISubmission>('Submission', submissionSchema)