function SignUp() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6 animate-fade-in'>
        <h2 className='text-3xl font-bold text-center text-gray-800'>
          Create Account
        </h2>
        <p className='text-sm text-center text-gray-500'>
          Join us and start your journey
        </p>

        <form className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              type='text'
              placeholder='John Doe'
              className='w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

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
              <button
                type='button'
                className='absolute inset-y-0 right-3 text-sm text-blue-600 hover:underline'
              >
                Show
              </button>
            </div>
          </div>

          <button
            type='submit'
            className='w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300'
          >
            Sign Up
          </button>
        </form>

        <div className='text-sm text-center text-gray-500'>
          Already have an account?{" "}
          <a
            href='/login'
            className='text-blue-600 hover:underline font-medium'
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
