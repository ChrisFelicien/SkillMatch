import IJob, {
  JobEmploymentType,
  JobExperienceLevel,
  JobLocationType,
  JobStatus,
} from '@/interfaces/IJob';
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job must have a title'],
      minLength: [5, 'Job title cannot be less than 5 characters'],
      maxLength: [100, 'Job title cannot exceed 100 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job must have a description'],
      minLength: [50, 'Job description cannot be less than 50 characters'],
      maxLength: [5000, 'Job description cannot exceed 5000 characters'],
      trim: true,
    },

    location: {
      type: String,
      required: [true, 'Provide job location'],
      minLength: [3, 'Job location cannot be less than 3 characters'],
      trim: true,
    },
    employmentType: {
      type: String,
      enum: Object.values(JobEmploymentType),
      default: JobEmploymentType.FULL_TIME,
    },
    jobLocationType: {
      type: String,
      enum: Object.values(JobLocationType),
      required: [true, 'Location type is required'],
    },
    salary: {
      min: {
        type: Number,
        required: [true, 'Please provide minimum salary for this position'],
        min: 0,
      },
      max: {
        type: Number,
        required: [true, 'Please provide maximum salary for this position'],
      },
      currency: {
        type: String,
        required: [true, 'Please provide the currency'],
        minLength: [3, 'Currency cannot be less than 3 characters'],
      },
    },
    skills: {
      type: [String],
      required: [true, 'Please provided need skills for this position'],
      validate: {
        validator: (values) => values.length >= 1 && values.length <= 20,
        message: 'Job must contain between 1 and 20 skills',
      },
    },
    experienceLevel: {
      type: String,
      required: [true, 'Please provide required level for this position'],
      enum: Object.values(JobExperienceLevel),
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.OPEN,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client id is required'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [2, 'Company name cannot be less than 2 characters'],
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    applicationDeadline: {
      type: Date,
      validate: {
        validator: (value) => !value || value > new Date(),
        message: 'Deadline should be in the future',
      },
    },
  },
  { timestamps: true },
);

JobSchema.index({ status: 1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ location: 1 });
JobSchema.index({ client: 1 });
JobSchema.index({
  experienceLevel: 1,
  employmentType: 1,
});
JobSchema.index({
  location: 1,
  experienceLevel: 1,
});

const Job = mongoose.model<IJob>('Job', JobSchema);

export default Job;
