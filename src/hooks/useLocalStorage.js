import { useState } from "react";

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("LocalStorage Error:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);

      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("LocalStorage Error:", error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
