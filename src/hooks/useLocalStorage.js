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
      // يدعم القيمة العادية أو function
      setStoredValue((prevValue) => {
        const valueToStore =
          value instanceof Function ? value(prevValue) : value;

        localStorage.setItem(key, JSON.stringify(valueToStore));

        return valueToStore;
      });
    } catch (error) {
      console.error("LocalStorage Error:", error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
