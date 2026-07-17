import { connect, clearDatabase, closeDatabase } from '@/test/dbHandler';
import CompanyService from '@/services/Company.service';
import { Types } from 'mongoose';
import companyFactory from '@/test/factory/CompanyFactory';
import { CompanyStatus } from '@/interfaces/ICompany';
import User from '@/models/User.model';
import userFactory from '@/test/factory/UserFactory';
import Company from '@/models/Company.model';
import { UserRoles } from '@/interfaces/IUser';

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Test company service', () => {
  it('Should submit a valid client request', async () => {
    const id = new Types.ObjectId();

    const companyData = companyFactory();

    const result = await CompanyService.submitClientRequest(id, companyData);

    expect(result.message).toBe('Request sent.');
  });

  it('Should fail when owner is missing', async () => {
    const companyData = companyFactory();
    await expect(
      CompanyService.submitClientRequest(
        null as unknown as Types.ObjectId,
        companyData,
      ),
    ).rejects.toThrow(/Please provide owner id/);
  });

  it('Should fail when company name is missing', async () => {
    const owner = new Types.ObjectId();
    const companyData = companyFactory({ name: '' });
    await expect(
      CompanyService.submitClientRequest(owner, companyData),
    ).rejects.toThrow(/Please provide company name/);
  });

  it('Should fail when user already submitted a request', async () => {
    const id = new Types.ObjectId();

    const companyData = companyFactory();

    await CompanyService.submitClientRequest(id, companyData);

    await expect(
      CompanyService.submitClientRequest(id, companyData),
    ).rejects.toThrow(/You already submitted a request./);
  });

  it('Should return empty array when there are no pending requests', async () => {
    const result = await CompanyService.getAllRequests();

    expect(result.message).toBe('All waiting request');
    expect(result.total).toBe(0);
    expect(result.requests).toHaveLength(0);
  });
  it('Should return all pending requests', async () => {
    const owner1 = new Types.ObjectId();
    const owner2 = new Types.ObjectId();
    const companyData = companyFactory();

    await CompanyService.submitClientRequest(owner1, companyData);
    await CompanyService.submitClientRequest(owner2, companyData);

    const request = await CompanyService.getAllRequests();

    expect(request.total).toBe(2);
    expect(request.requests[0]?.status).toBe(CompanyStatus.PENDING);
    expect(request.requests[1]?.status).toBe(CompanyStatus.PENDING);
  });

  it('Should return empty array when there are no pending requests', async () => {
    const request = await CompanyService.getAllRequests();

    expect(request.requests).toHaveLength(0);
  });

  it('Should not return approved requests', async () => {
    const owner1 = new Types.ObjectId();
    const companyData = companyFactory();

    const user = await User.create(userFactory());

    const result = await CompanyService.submitClientRequest(
      user._id,
      companyData,
    );
    await CompanyService.submitClientRequest(owner1, companyData);

    await CompanyService.approveClientRequest(result.request._id.toString());

    const request = await CompanyService.getAllRequests();

    expect(request.requests).toHaveLength(1);
  });

  it('Should not return rejected requests', async () => {
    const owner1 = new Types.ObjectId();
    const companyData = companyFactory();

    const user = await User.create(userFactory());

    const result = await CompanyService.submitClientRequest(
      user._id,
      companyData,
    );
    await CompanyService.submitClientRequest(owner1, companyData);

    await CompanyService.rejectClientRequest(result.request._id.toString());

    const request = await CompanyService.getAllRequests();

    expect(request.requests).toHaveLength(1);
  });

  it('Should return the correct total of pending requests', async () => {
    const id1 = new Types.ObjectId();
    const id2 = new Types.ObjectId();
    const id3 = new Types.ObjectId();
    const companyData = companyFactory();

    await Company.insertMany([
      { owner: id1, ...companyData },
      { owner: id2, ...companyData },
      { owner: id3, ...companyData },
    ]);

    const result = await CompanyService.getAllRequests();

    expect(result.requests).toHaveLength(3);
  });

  it('Should return a single request', async () => {
    const id1 = new Types.ObjectId();
    const companyData = companyFactory();
    const request = await Company.create({ owner: id1, ...companyData });

    const result = await CompanyService.getSingleRequest(
      request._id.toString(),
    );

    expect(result.message).toBe('Single request');
    expect(result.request.owner).toEqual(id1);
  });

  it('Should fail when request does not exist', async () => {
    const id1 = new Types.ObjectId();

    await expect(
      CompanyService.getSingleRequest(id1.toString()),
    ).rejects.toThrow('No request found with this id');
  });

  it('Should approve a pending request', async () => {
    const user = await User.create(userFactory());

    const request = await Company.create({
      owner: user._id,
      ...companyFactory(),
    });

    const result = await CompanyService.approveClientRequest(
      request._id.toString(),
    );

    expect(result.message).toBe('The request is approved');
  });

  it('Should update company status to APPROVED', async () => {
    const user = await User.create(userFactory());

    const request = await Company.create({
      owner: user._id,
      ...companyFactory(),
    });

    const result = await CompanyService.approveClientRequest(
      request._id.toString(),
    );

    expect(result.request.status).toBe(CompanyStatus.APPROVED);
  });

  it('Should update user role to CLIENT', async () => {
    const user = await User.create(userFactory());

    const request = await Company.create({
      owner: user._id,
      ...companyFactory(),
    });
    await CompanyService.approveClientRequest(request._id.toString());

    const currentUser = await User.findById(user._id);

    expect(currentUser?.role).toBe(UserRoles.CLIENT);
  });

  it('Should fail when request does not exist', async () => {
    const id = new Types.ObjectId();

    await expect(
      CompanyService.approveClientRequest(id.toString()),
    ).rejects.toThrow(/No request found with this id/);
  });

  it('Should fail when request has already been approved', async () => {
    const user = await User.create(userFactory());

    const request = await Company.create({
      owner: user._id,
      ...companyFactory(),
    });

    await CompanyService.approveClientRequest(request._id.toString());

    await expect(
      CompanyService.approveClientRequest(request._id.toString()),
    ).rejects.toThrow(/This request has been processed/);
  });

  it('Should fail when request has already been rejected', async () => {
    const user = await User.create(userFactory());

    const request = await Company.create({
      owner: user._id,
      ...companyFactory(),
    });

    await CompanyService.rejectClientRequest(request._id.toString());

    await expect(
      CompanyService.approveClientRequest(request._id.toString()),
    ).rejects.toThrow(/This request has been processed/);
  });

  it('Should fail when request owner does not exist', async () => {
    const id = new Types.ObjectId();
    const request = await Company.create({ owner: id, ...companyFactory() });

    await expect(
      CompanyService.approveClientRequest(request._id.toString()),
    ).rejects.toThrow(/No user find./);
  });

  it('Should reject a pending request', async () => {
    const user = await User.create(userFactory());

    const request = await Company.create({
      owner: user._id,
      ...companyFactory(),
    });
    const result = await CompanyService.rejectClientRequest(
      request._id.toString(),
    );

    expect(result.message).toBe('The request is rejected');
  });

  it('Should update company status to REJECTED', async () => {
    const user = await User.create(userFactory());

    const request = await Company.create({
      owner: user._id,
      ...companyFactory(),
    });
    const result = await CompanyService.rejectClientRequest(
      request._id.toString(),
    );

    expect(result.request.status).toBe(CompanyStatus.REJECTED);
  });

  it('Should fail when request does not exist', async () => {
    const id = new Types.ObjectId().toString();

    await expect(CompanyService.rejectClientRequest(id)).rejects.toThrow(
      'No request found with this id',
    );
  });

  it('Should fail when request has already been approved', async () => {
    const user = await User.create(userFactory());

    const request = await Company.create({
      owner: user._id,
      ...companyFactory(),
    });

    await CompanyService.approveClientRequest(request._id.toString());

    await expect(
      CompanyService.rejectClientRequest(request._id.toString()),
    ).rejects.toThrow(/This request has been processed/);
  });

  it('Should fail when request has already been rejected', async () => {
    const user = await User.create(userFactory());

    const request = await Company.create({
      owner: user._id,
      ...companyFactory(),
    });

    await CompanyService.rejectClientRequest(request._id.toString());

    await expect(
      CompanyService.rejectClientRequest(request._id.toString()),
    ).rejects.toThrow(/This request has been processed/);
  });
});
