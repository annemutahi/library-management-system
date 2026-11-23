import { useCallback, useEffect, useState } from "react";
import BookGrid from "../components/BookGrid.jsx";
import SearchBar from "../components/SearchBar.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [genreId, setGenreId] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [genres, setGenres] = useState([]);
  const [genreError, setGenreError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadGenres() {
      try {
        const response = await fetch(`${API_URL}/genres`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Could not load genres (${response.status}).`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("The genres response was not a list.");
        }
        setGenres(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setGenreError(error.message || "Could not load genres.");
        }
      }
    }

    loadGenres();
    return () => controller.abort();
  }, []);

  const handleSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  return (
    <div className="page-shell">
      <section className="hero">
        <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
        <h1>Find a book<br />to get lost in.</h1>
        <p className="hero-copy">
          Browse the shelves, follow a curiosity, and discover something new.
        </p>
      </section>

      <section className="collection" aria-labelledby="collection-title">
        <div className="collection-heading">
          <div>
            <p className="eyebrow">THE COLLECTION</p>
            <h2 id="collection-title">Books for every mood</h2>
          </div>
          <div className="filters">
            <SearchBar onSearch={handleSearch} />
            <label className="visually-hidden" htmlFor="genre-filter">Filter by genre</label>
            <select
              id="genre-filter"
              className="genre-filter"
              value={genreId}
              onChange={(event) => setGenreId(event.target.value)}
              aria-label="Filter by genre"
            >
              <option value="">All genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
            <label className="visually-hidden" htmlFor="sort-books">Sort books</label>
            <select
              id="sort-books"
              className="sort-filter"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort books"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
            </select>
          </div>
        </div>

        {genreError && <p className="filter-error" role="status">{genreError}</p>}
        <BookGrid genreId={genreId} search={search} sortBy={sortBy} />
      </section>
    </div>
  );
}
