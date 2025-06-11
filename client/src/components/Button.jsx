const Button = ({ text }) => {
  return (
    <button className='bg-slate-800 text-white py-1.5 text-center w-full rounded-md hover:bg-slate-600 transition ease-in cursor-pointer'>
      {text}
    </button>
  );
};

export default Button;
