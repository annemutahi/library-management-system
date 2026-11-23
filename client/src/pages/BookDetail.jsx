import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setBook(null);
    setLoading(true);
    setError("");

    async function loadBook() {
      try {
        const response = await fetch(`${API_URL}/books/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(response.status === 404
            ? "We couldn’t find that book."
            : `Could not load this book (${response.status}).`);
        }
        setBook(await response.json());
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Could not load this book.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBook();
    return () => controller.abort();
  }, [id]);

  if (loading) return <p className="message-panel" role="status">Loading book…</p>;
  if (error) {
    return (
      <section className="message-panel error-message" role="alert">
        <p>{error}</p>
        <Link to="/">Back to all books</Link>
      </section>
    );
  }

  return (
    <div className="detail-shell">
      <Link className="back-link" to="/">← Back to the collection</Link>
      <article className="detail-card">
        <div className="detail-art" aria-hidden="true">
          <span className="detail-art-label">A GOOD BOOK<br />IS A GOOD<br />COMPANION.</span>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{book.genre?.name || "FROM THE COLLECTION"}</p>
          <h1>{book.title}</h1>
          <p className="detail-author">by {book.author}</p>
          <div className="detail-rule" />
          <dl className="book-facts">
            <div><dt>Published</dt><dd>{book.publicationYear}</dd></div>
            <div><dt>ISBN</dt><dd>{book.isbn}</dd></div>
            <div><dt>Copies</dt><dd>{book.totalCopies}</dd></div>
          </dl>
          <p className="detail-note">Take your time. The best stories stay with us.</p>
        </div>
      </article>
    </div>
  );
}
