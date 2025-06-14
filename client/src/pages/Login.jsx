function SignIn() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6 animate-fade-in'>
        <h2 className='text-3xl font-bold text-center text-gray-800'>
          Welcome Back
        </h2>
        <p className='text-sm text-center text-gray-500'>
          Sign in to your account
        </p>

        <form className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              placeholder='you@example.com'
              className='w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <div className='relative'>
              <input
                type='password'
                placeholder='••••••••'
                className='w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
              <a
                href='/forgot-password'
                className='absolute inset-y-0 right-3 flex items-center text-sm text-blue-600 hover:underline'
              >
                Forgot?
              </a>
            </div>
          </div>

          <button
            type='submit'
            className='w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300'
          >
            Sign In
          </button>
        </form>

        <div className='text-sm text-center text-gray-500'>
          Don’t have an account?{" "}
          <a
            href='/signup'
            className='text-blue-600 hover:underline font-medium'
          >
            Create one
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
