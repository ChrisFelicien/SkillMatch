import RefreshToken from '@/models/RefreshToken.model';
import User from '@/models/User.model';
import IUser from '@/interfaces/IUser';
import AppError from '@/utils/AppError';
import {
  generateAccessToken,
  generateRefreshToken,
} from '@/utils/generateTokens';

type IRegisterData = Partial<
  Pick<IUser, 'firstName' | 'lastName' | 'email' | 'password'>
>;

type ILoginData = Partial<Pick<IUser, 'email' | 'password'>>;

class AuthService {
  async register(inputData: IRegisterData) {
    const { firstName, lastName, email, password: userPassword } = inputData;

    if (!email || !firstName || !lastName || !userPassword) {
      throw new AppError('All fields are required', 400);
    }
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: userPassword,
    });

    const accessToken = generateAccessToken({
      userId: newUser._id,
      role: newUser.role,
    });
    const refreshToken = generateRefreshToken({
      userId: newUser._id,
      role: newUser.role,
    });

    await RefreshToken.create({
      userId: newUser._id,
      tokenHash: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const { password, ...user } = newUser.toObject();

    return { user, refreshToken, accessToken };
  }

  async login(inputData: ILoginData) {
    const { email, password: userPassword } = inputData;
    if (!email || !userPassword) {
      throw new AppError('Please provide your email and password', 400);
    }
    const currentUser = await User.findOne({ email }).select('+password');

    if (!currentUser || !(await currentUser.comparePassword(userPassword))) {
      throw new AppError('Invalid email or password', 400);
    }

    const accessToken = generateAccessToken({
      userId: currentUser._id,
      role: currentUser.role,
    });
    const refreshToken = generateRefreshToken({
      userId: currentUser._id,
      role: currentUser.role,
    });

    await RefreshToken.create({
      userId: currentUser._id,
      tokenHash: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const { password, ...user } = currentUser.toObject();

    return { user, accessToken, refreshToken };
  }
}

export default new AuthService();
