import mongoose, { Document, Schema } from 'mongoose';

export const BUDGET_OPTIONS = [
  'Under $500',
  '$500-$1000',
  '$1000-$5000',
  'Above $5000',
] as const;

export const STATUS_OPTIONS = ['New', 'Contacted', 'Closed'] as const;

export type BudgetOption = (typeof BUDGET_OPTIONS)[number];
export type StatusOption = (typeof STATUS_OPTIONS)[number];

export interface ILead extends Document {
  name: string;
  email: string;
  budget: BudgetOption;
  message: string;
  status: StatusOption;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    budget: {
      type: String,
      required: [true, 'Budget is required'],
      enum: {
        values: BUDGET_OPTIONS,
        message: 'Invalid budget option',
      },
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: STATUS_OPTIONS,
        message: 'Invalid status',
      },
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1 });

export const Lead = mongoose.model<ILead>('Lead', leadSchema);
