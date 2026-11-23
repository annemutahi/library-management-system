import { Link } from "react-router-dom";

const coverColors = ["cover-olive", "cover-rust", "cover-blue", "cover-plum"];

export default function BookCard({ book }) {
  const coverColor = coverColors[(Number(book.id) - 1 + coverColors.length) % coverColors.length];

  return (
    <article className="book-card">
      <Link className="book-card-link" to={`/books/${book.id}`}>
        <div className={`book-cover ${coverColor}`} aria-hidden="true">
          <span className="cover-spine" />
          <span className="cover-title">{book.title}</span>
          <span className="cover-author">{book.author}</span>
        </div>
        <div className="book-card-info">
          <div className="book-card-heading">
            <h3>{book.title}</h3>
            {book.genre?.name && <span className="genre-tag">{book.genre.name}</span>}
          </div>
          <p className="book-author">{book.author}</p>
          <p className="book-year">{book.publicationYear}</p>
        </div>
      </Link>
    </article>
  );
}
