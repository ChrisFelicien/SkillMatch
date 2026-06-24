import IRefreshToken from '@/interfaces/IRefreshToken';
import mongoose from 'mongoose';
import crypto from 'crypto';

const RefreshTokenSchema = new mongoose.Schema<IRefreshToken>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user id'],
    },
    tokenHash: {
      type: String,
      required: [true, 'Please provide a refresh token'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Please provide the expired token date'],
    },
  },
  { timestamps: true },
);

RefreshTokenSchema.pre('save', function () {
  if (!this.isModified('tokenHash')) return;
  this.tokenHash = crypto
    .createHash('sha256')
    .update(this.tokenHash)
    .digest('hex');

  return;
});

RefreshTokenSchema.index({ userId: 1, tokenHash: 1 }, { unique: true });

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model<IRefreshToken>(
  'RefreshToken',
  RefreshTokenSchema,
);

export default RefreshToken;
