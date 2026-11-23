import { useEffect, useMemo, useState } from "react";
import BookCard from "./BookCard.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function BookGrid({ genreId, search, sortBy }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const sortedBooks = useMemo(
    () => [...books].sort((first, second) =>
      first[sortBy].localeCompare(second[sortBy], undefined, { sensitivity: "base" })),
    [books, sortBy],
  );

  useEffect(() => {
    const controller = new AbortController();
    const url = new URL(`${API_URL}/books`);
    if (genreId) url.searchParams.set("genreId", genreId);
    if (search.trim()) url.searchParams.set("search", search.trim());

    async function loadBooks() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Could not load books (${response.status}).`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("The books response was not a list.");
        }
        setBooks(data);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Could not load books.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBooks();
    return () => controller.abort();
  }, [genreId, search]);

  if (loading) {
    return (
      <div className="book-grid skeleton-grid" role="status" aria-label="Loading books">
        {Array.from({ length: 8 }, (_, index) => (
          <div className="book-skeleton" key={index} aria-hidden="true">
            <div className="skeleton-cover" />
            <div className="skeleton-title" />
            <div className="skeleton-author" />
          </div>
        ))}
      </div>
    );
  }
  if (error) {
    return <p className="message-panel error-message" role="alert">{error}</p>;
  }
  if (books.length === 0) {
    return (
      <div className="message-panel">
        <h3>No books found</h3>
        <p>Try another search or choose a different genre.</p>
      </div>
    );
  }

  return (
    <div className="book-grid">
      {sortedBooks.map((book) => <BookCard key={book.id} book={book} />)}
    </div>
  );
}
