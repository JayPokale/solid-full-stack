export const InputNonReq = ({ type, label, name }: { type: string; label: string; name: string }) => {
  
  return (
    <div class="relative w-full">
      <input
        type={type}
        name={label}
        class="block pt-[10px] pb-[4px] px-4 w-full bg-transparent border-b-2 outline-none focus:outline-transparent peer"
        placeholder=" "
      />
      <label class="absolute mx-[2px] px-4 duration-300 transform top-3 origin-top-left z-10 font-bold scale-[60%] -translate-y-4 peer-placeholder-shown:-z-10 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:z-10 peer-focus:font-bold peer-focus:scale-[60%] peer-focus:-translate-y-4">
        {label}
      </label>
    </div>
  );
};
