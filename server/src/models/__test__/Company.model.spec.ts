import companyFactory from '@/test/factory/CompanyFactory';
import { connect, clearDatabase, closeDatabase } from '@/test/dbHandler';
import User from '@/models/User.model';
import userFactory from '@/test/factory/UserFactory';
import Company from '@/models/Company.model';
import { CompanyStatus } from '@/interfaces/ICompany';
import mongoose from 'mongoose';

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Test company model', () => {
  it('it should create valid company', async () => {
    const userData = userFactory();
    const user = await User.create(userData);
    const companyData = companyFactory({ owner: user._id });

    const company = await Company.create(companyData);

    expect(company.owner).toEqual(user._id);
    expect(company.name).toBe(companyData.name);
  });
  it('Should fails when owner is missing', async () => {
    const companyData = companyFactory();

    await expect(Company.create(companyData)).rejects.toThrow(
      'Please provide a owner id',
    );
  });

  it('Should fail when company name is missing', async () => {
    const userData = userFactory();
    const user = await User.create(userData);
    const companyData = companyFactory({ owner: user._id, name: '' });

    await expect(Company.create(companyData)).rejects.toThrow(
      'Please provide the company name',
    );
  });

  it('Should fail when company name is less than 3 characters', async () => {
    const userData = userFactory();
    const user = await User.create(userData);
    const companyData = companyFactory({ owner: user._id, name: 'he' });

    await expect(Company.create(companyData)).rejects.toThrow(
      'Company name cannot be less than 3 characters',
    );
  });

  it('Should fail when company name is more than 50 characters', async () => {
    const userData = userFactory();
    const user = await User.create(userData);
    const companyData = companyFactory({
      owner: user._id,
      name: 'Valentinez Alkalinella Xifax Sicidabohertz Gombigobilla Blue Stradivari Talentrent Pierre Andri Charton-Haymoss Ivanovici Baldeus George',
    });

    await expect(Company.create(companyData)).rejects.toThrow(
      'Company name cannot exceed 50 characters',
    );
  });

  it('should fail when description exceeds 500 characters', async () => {
    const userData = userFactory();
    const user = await User.create(userData);
    const companyData = companyFactory({
      owner: user._id,
      description:
        'Valentinez Alkalinella Xifax Sicidabohertz Gombigobilla Blue Stradivari Talentrent Pierre Andri Charton-Haymoss Ivanovici Baldeus George Valentinez Alkalinella Xifax Sicidabohertz Gombigobilla Blue Stradivari Talentrent Pierre Andri Charton-Haymoss Ivanovici Baldeus George Valentinez Alkalinella Xifax Sicidabohertz Gombigobilla Blue Stradivari Talentrent Pierre Andri Charton-Haymoss Ivanovici Baldeus George Valentinez Alkalinella Xifax Sicidabohertz Gombigobilla Blue Stradivari Talentrent Pierre Andri Charton-Haymoss Ivanovici Baldeus George',
    });

    await expect(Company.create(companyData)).rejects.toThrow(
      'Company description cannot exceed 500 characters',
    );
  });
  it('should set pending as default status', async () => {
    const userData = userFactory();
    const user = await User.create(userData);
    const companyData = companyFactory({ owner: user._id });

    const company = await Company.create(companyData);

    expect(company.status).toBe(CompanyStatus.PENDING);
  });

  it('should fail when status is invalid', async () => {
    const userData = userFactory();
    const user = await User.create(userData);
    const companyData = companyFactory({
      owner: user._id,
      status: 'invalid-status' as CompanyStatus,
    });

    await expect(Company.create(companyData)).rejects.toThrow(
      'invalid-status is not valid status',
    );
  });

  it('should create timestamps', async () => {
    const userData = userFactory();
    const user = await User.create(userData);
    const companyData = companyFactory({ owner: user._id });

    const company = await Company.create(companyData);

    expect(company.createdAt).toBeDefined();
    expect(company.updatedAt).toBeDefined();
  });

  it('should create company with empty members array', async () => {
    const userData = userFactory();
    const user = await User.create(userData);
    const companyData = companyFactory({ owner: user._id });

    const company = await Company.create(companyData);

    expect(company.members).toHaveLength(0);
  });

  it('should create company with members', async () => {
    const member = new mongoose.Types.ObjectId();
    const userData = userFactory();
    const user = await User.create(userData);
    const companyData = companyFactory({ owner: user._id });

    const company = await Company.create({ ...companyData, members: [member] });

    expect(company.members).toBeDefined();
    expect(company.members).toHaveLength(1);
  });
});
