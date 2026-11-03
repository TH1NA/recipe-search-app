import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="page-shell not-found-page">
      <p className="eyebrow">OOPS, WRONG TABLE</p>
      <h1>Nothing cooking here.</h1>
      <p className="page-description">That page may have wandered off. Let's find you something good.</p>
      <Link className="button button-dark" to="/">Back to discover</Link>
    </main>
  );
}
