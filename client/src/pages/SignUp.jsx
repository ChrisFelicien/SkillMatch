import { Form, Link } from "react-router-dom";
import { Input, Label, Button } from "../components";

const SignUp = () => {
  return (
    <div className='min-h-screen grid place-content-center'>
      <Form
        method='POST'
        className='bg-slate-100 py-8 px-8 rounded-md z-10 shadow-2xl'
      >
        <div className='mb-4'>
          <h3 className='font-bold text-4xl capitalize md:text-lg md:font-extrabold text-center mb-1 text-slate-900'>
            Sign up
          </h3>
          <p className='text-xs text-center sm:text-sm text-slate-500'>
            Let's get started by creating your account
          </p>
        </div>
        <div className='flex flex-col gap-1 mb-4'>
          <Label labelName={"name"} />
          <Input placeholder={"John Doe"} name={"name"} type='text' />
        </div>
        <div className='flex flex-col gap-1 mb-4'>
          <Label labelName={"email"} />
          <Input
            placeholder={"example@email.com"}
            name={"email"}
            type='email'
          />
        </div>
        <div className='flex flex-col gap-1 mb-4'>
          <div className='flex justify-between align-center'>
            <Label labelName={"password"} />
            <Link className='text-sm text-blue-700 cursor-pointer'>
              forget password
            </Link>
          </div>
          <Input placeholder={"*********"} name={"password"} type='password' />
        </div>
        <p className='text-sm text-center font-semibold mb-6'>
          Do you have account?{" "}
          <Link to='/login' className='ml-1 text-blue-700'>
            Login
          </Link>
        </p>
        <div>
          <Button text={`Sign up`} />
        </div>
      </Form>
    </div>
  );
};

export default SignUp;
