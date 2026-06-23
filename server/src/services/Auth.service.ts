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

const generateUserSession = async (user: IUser) => {
  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    userId: user._id,
    role: user.role,
  });

  await RefreshToken.create({
    userId: user._id,
    tokenHash: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { user, accessToken, refreshToken };
};

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

    const { user, accessToken, refreshToken } =
      await generateUserSession(newUser);
    const { password, ...userData } = user.toObject();

    return { user: userData, refreshToken, accessToken };
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

    const { user, accessToken, refreshToken } =
      await generateUserSession(currentUser);

    const { password, ...userData } = user.toObject();

    return { user: userData, accessToken, refreshToken };
  }
}

export default new AuthService();
