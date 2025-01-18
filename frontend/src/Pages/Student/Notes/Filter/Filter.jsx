import { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineClear } from "react-icons/md";
import "./Filter.css";

export default function Filter({
  Icon,
  title,
  children,
  className,
  dropdownClassName,
  onClear,
  isFilterApplied,
  isClearButtonDisabled,
}) {
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef(null);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="paste-buttonFilter" ref={dropdownRef}>
      <button
        className={`${className} ${isActive ? "active" : ""}`}
        onClick={handleClick}
      >
        <Icon />
        <div>{title}</div>
        <IoIosArrowDown />
      </button>
      {onClear && (
        <button
          className={`clearButton ${
            isFilterApplied ? "clearButton-active" : ""
          }`}
          onClick={onClear}
          disabled={isClearButtonDisabled}
        >
          <MdOutlineClear />
        </button>
      )}
      {isActive && (
        <div className={`dropdown-contentFilter ${dropdownClassName}`}>
          {typeof children === "function" ? children() : children}
        </div>
      )}
    </div>
  );
}
