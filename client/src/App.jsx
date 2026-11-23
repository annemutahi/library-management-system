import { Link, Route, Routes } from "react-router-dom";
import BookDetail from "./pages/BookDetail.jsx";
import HomePage from "./pages/HomePage.jsx";

export default function App() {
  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Library home">
          <span className="brand-mark" aria-hidden="true">L</span>
          <span>Open Shelf</span>
        </Link>
        <span className="header-note">A little space for big ideas</span>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

function NotFound() {
  return (
    <section className="message-panel">
      <h1>Page not found</h1>
      <p>That page isn’t in our collection.</p>
      <Link to="/">Return to the book collection</Link>
    </section>
  );
}
