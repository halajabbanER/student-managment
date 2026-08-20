import { useEffect, useState } from "react";

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
   
      setStoredValue((prevValue) => {
        const valueToStore =
          value instanceof Function ? value(prevValue) : value;

        localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(
          new CustomEvent("local-storage-change", {
            detail: { key, value: valueToStore },
          }),
        );

        return valueToStore;
      });
    } catch (error) {
      console.error("LocalStorage Error:", error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.detail?.key === key) {
        setStoredValue(event.detail.value);
      }
    };

    window.addEventListener("local-storage-change", handleStorageChange);

    return () => {
      window.removeEventListener("local-storage-change", handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
