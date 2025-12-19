import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import { US } from "country-flag-icons/react/3x2";
import { AR } from "country-flag-icons/react/3x2";

import useOutsideClick from "@/hooks/useOutsideClick";

type Option = {
  value: string;
  flagComponent: React.ComponentType<any>;
};

const DropdownBanderas = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { i18n } = useTranslation();
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => {
    setIsOpen(false);
  });

  const options: Option[] = [
    { value: "ar", flagComponent: AR },
    { value: "en", flagComponent: US },
  ];

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    document.cookie = `selectedLanguage=${value}; path=/; max-age=31536000`;
    localStorage.setItem("selectedLanguage", value);
    setIsOpen(false);
  };

  const currentLanguage =
    options.find((opt) => opt.value === i18n.language) || options[0];

  return (
    <div ref={dropdownRef} className="relative z-1000 cursor-pointer">
      <button
        className="flex items-center justify-between w-full py-[2px] px-[4px] bg-[#BBB5] border border-[#AAA] rounded-lg z-1000 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {React.createElement(currentLanguage.flagComponent, {
          className: "inline-block",
          style: { width: "20px", height: "15px" },
        })}
        <FaChevronDown
          className={`ml-[2px] transition-transform ${isOpen ? "rotate-180" : ""} inline-block w-[8px] h-[8px]`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-[0px] mt-[2px] w-[40px] rounded-lg bg-[#DDD] ring-[1px] ring-black ring-opacity-[5px] transition-colors ease-in-out hover:bg-lightGrey z-[1000] cursor-pointer">
          <div
            aria-labelledby="options-menu"
            aria-orientation="vertical"
            className="py-[1px] z-[1000] cursor-pointer"
            role="menu"
          >
            {options
              .filter((option) => option.value !== currentLanguage.value)
              .map((option) => (
                <button
                  key={option.value}
                  className="block w-[100%] text-left px-[4px] py-[2px] text-sm text-gray-700 z-[999] cursor-pointer"
                  role="menuitem"
                  onClick={() => handleLanguageChange(option.value)}
                >
                  {React.createElement(option.flagComponent, {
                    className: "inline-block",
                    style: { width: "20px", height: "15px" },
                  })}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownBanderas;
