'use client'
import { BsSun, BsMoonStarsFill } from "react-icons/bs";
import { setDarkMode } from "../redux/uiSlice";
import React, {useState} from 'react'
import { useAppDispatch, useAppSelector } from "../redux/hook";
const Toggle = () => {
  const { darkMode } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const [theme, setTheme] = useState<boolean>(false);
  function toggleTheme() {
    setTheme((prevTheme) => !prevTheme);
    dispatch(setDarkMode());
  }
  return (
    <div>
      <div
        className={`group mr-9 flex cursor-pointer items-center justify-center gap-12 rounded-lg py-3 text-[2rem] transition-all duration-300 mb-10 ${
          darkMode ? "bg-[#20212c] text-white" : "bg-[#F4F7FD] text-[#20212c]"
        }`}
      >
        <BsSun />
        <div
          className={`relative h-[2rem] w-[4rem] rounded-full bg-[#635fc7] before:absolute before:top-[11%] before:h-[1.5rem] before:w-[1.5rem] before:rounded-full before:bg-white before:transition-all before:duration-300 group-hover:bg-[#9694d6] ${
            darkMode
              ? "before:translate-x-[2rem]"
              : "before:translate-x-[0.4rem]"
          }`}
          onClick={toggleTheme}
        ></div>
        <BsMoonStarsFill />
      </div>
      
    </div>
  );
}

export default Toggle