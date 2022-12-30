import Image from 'next/image';
import React from 'react';

const SearchBar = () => {
  return (
    <div className="flex items-center bg-[#343646] rounded-[12px] px-[10px] py-2 space-x-2">
      <Image src="/Icons/search.svg" width={24} height={24} alt="" />
      <input
        type="text"
        className="w-full bg-transparent border-none outline-none focus:outline-none focus:border-none"
      />
    </div>
  );
};

export default SearchBar;
