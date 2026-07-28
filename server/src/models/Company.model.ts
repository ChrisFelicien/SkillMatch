import { CompanyStatus, ICompany } from '@/interfaces/ICompany';
import mongoose from 'mongoose';
import validator from 'validator';

const CompanySchema = new mongoose.Schema<ICompany>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a owner id'],
    },
    name: {
      type: String,
      required: [true, 'Please provide the company name'],
      trim: true,
      minlength: [3, 'Company name cannot be less than 3 characters'],
      maxLength: [50, 'Company name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, 'Company description cannot exceed 500 characters'],
    },
    website: {
      type: String,
      trim: true,
      validate: [validator.isURL, 'Please provide valid url'],
    },
    logo: {
      type: String,
    },
    industry: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(CompanyStatus),
        message: '{VALUE} is not valid status',
      },
      default: CompanyStatus.PENDING,
    },
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

const Company = mongoose.model<ICompany>('Company', CompanySchema);

export default Company;
