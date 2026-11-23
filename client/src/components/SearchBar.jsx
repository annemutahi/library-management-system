import { useEffect, useState } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(timeoutId);
  }, [value, onSearch]);

  return (
    <label className="search-control">
      <span className="visually-hidden">Search books by title or author</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.2 4.2" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search title or author"
      />
    </label>
  );
}
