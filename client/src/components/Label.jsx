const Label = ({ labelName }) => {
  return (
    <label className='capitalize font-medium text-sm md:text-base text-slate-800'>
      {labelName}
    </label>
  );
};

export default Label;
