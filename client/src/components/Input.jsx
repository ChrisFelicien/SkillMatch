const Input = ({ placeholder, name, type }) => {
  return (
    <input
      placeholder={placeholder}
      name={name}
      type={type}
      className='py-1 px-3 border border-slate-300 rounded-sm outline-none text-sm md:text-base'
    />
  );
};

export default Input;
