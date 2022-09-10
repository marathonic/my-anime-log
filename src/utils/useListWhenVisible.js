import { useState, useEffect, useRef } from "react";

export default function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}

// import { useRef, useState, useEffect } from "react";

// const useListWhenVisible = (firstVisible) => {
//   const [isListVisible, setIsListVisible] = useState(firstVisible);
//   const ref = useRef(null);

//   const handleOuterClick = (e) => {
//     if (ref.current?.ref.current.contains(e.target)) {
//       setIsListVisible(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("click", handleOuterClick, true);
//     return () => {
//       document.removeEventListener("click", handleOuterClick, true);
//     };
//   }, []);

//   return { ref, isListVisible, setIsListVisible };
// };

// export default useListWhenVisible;
