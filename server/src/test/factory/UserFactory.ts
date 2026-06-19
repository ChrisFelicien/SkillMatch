import IUser from "@/interfaces/IUser";

const userFactory = (override?: Partial<IUser>): IUser =>
  ({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@email.com",
    password: "HelloPassword@12",
    ...override
  }) as IUser;

export default userFactory;
