import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMealById } from "../api/mealDb.js";
import RecipeGrid from "../components/RecipeGrid.jsx";
import StatusMessage from "../components/StatusMessage.jsx";

export default function FavoritesPage({ favorites, onToggleFavorite }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadFavorites() {
      if (favorites.length === 0) {
        setRecipes([]);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const results = await Promise.all(
          favorites.map((id) => getMealById(id, controller.signal)),
        );
        setRecipes(results.filter(Boolean));
      } catch (requestError) {
        if (requestError.name !== "CanceledError") {
          setError("We couldn't load your saved recipes. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadFavorites();
    return () => controller.abort();
  }, [favorites]);

  return (
    <main className="page-shell favorites-page">
      <p className="eyebrow">YOUR LITTLE COLLECTION</p>
      <h1>Saved recipes<span className="heading-period">.</span></h1>
      <p className="page-description">All the good things you've tucked away for later.</p>
      {loading && <StatusMessage>Bringing your recipes together…</StatusMessage>}
      {error && <StatusMessage>{error}</StatusMessage>}
      {!loading && !error && recipes.length > 0 && (
        <RecipeGrid
          recipes={recipes}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      )}
      {!loading && !error && recipes.length === 0 && (
        <div className="empty-favorites">
          <span className="empty-heart" aria-hidden="true">♡</span>
          <h2>A little room for something lovely.</h2>
          <p>Save recipes as you browse and they'll be waiting here.</p>
          <Link className="button button-dark" to="/">Find a recipe</Link>
        </div>
      )}
    </main>
  );
}
