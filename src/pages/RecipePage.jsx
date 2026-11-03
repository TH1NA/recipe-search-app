import { Link, useParams } from "react-router-dom";
import StatusMessage from "../components/StatusMessage.jsx";
import useRecipe from "../hooks/useRecipe.js";

function getIngredients(recipe) {
  return Array.from({ length: 20 }, (_, index) => {
    const number = index + 1;
    const ingredient = recipe[`strIngredient${number}`]?.trim();
    const measure = recipe[`strMeasure${number}`]?.trim();
    return ingredient ? `${measure ? `${measure} ` : ""}${ingredient}` : null;
  }).filter(Boolean);
}

export default function RecipePage({
  favorites,
  onToggleFavorite,
}) {
  const { id } = useParams();
  const { recipe, loading, error } = useRecipe(id);
  const isFavorite = favorites.includes(id);

  if (loading) {
    return <main className="page-shell"><StatusMessage>Gathering the recipe…</StatusMessage></main>;
  }
  if (error) {
    return (
      <main className="page-shell">
        <StatusMessage>{error}</StatusMessage>
        <Link className="back-link" to="/">← Back to discover</Link>
      </main>
    );
  }
  if (!recipe) {
    return (
      <main className="page-shell">
        <StatusMessage>We couldn't find that recipe.</StatusMessage>
        <Link className="back-link" to="/">← Back to discover</Link>
      </main>
    );
  }

  const ingredients = getIngredients(recipe);

  return (
    <main className="recipe-detail page-shell">
      <Link className="back-link" to="/">← Back to discover</Link>
      <section className="detail-hero">
        <div className="detail-image-wrap">
          <img src={recipe.strMealThumb} alt={recipe.strMeal} />
          <span className="detail-image-label">{recipe.strArea || "From the kitchen"}</span>
        </div>
        <div className="detail-intro">
          <p className="eyebrow">{recipe.strCategory || "A GOOD THING"}{recipe.strArea ? ` · ${recipe.strArea.toUpperCase()}` : ""}</p>
          <h1>{recipe.strMeal}</h1>
          <p className="detail-description">
            Pull up a chair. Here's everything you need to bring this one to your table.
          </p>
          <button
            className={`button favorite-action${isFavorite ? " is-saved" : ""}`}
            type="button"
            onClick={() => onToggleFavorite(id)}
            aria-pressed={isFavorite}
          >
            {isFavorite ? "♥ Saved to your recipes" : "♡ Save this recipe"}
          </button>
          {recipe.strYoutube && (
            <a className="video-link" href={recipe.strYoutube} target="_blank" rel="noreferrer">
              Watch the recipe video ↗
            </a>
          )}
        </div>
      </section>
      <section className="detail-content">
        <div className="ingredients-panel">
          <p className="eyebrow">FIRST, THE GOOD STUFF</p>
          <h2>What you'll need</h2>
          <ul className="ingredient-list">
            {ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}
          </ul>
        </div>
        <div className="instructions-panel">
          <p className="eyebrow">THEN, THE MAGIC</p>
          <h2>Let's make it</h2>
          <div className="instructions-copy">
            {(recipe.strInstructions || "Instructions are not available for this recipe.")
              .split(/\r?\n/)
              .map((step) => step.trim())
              .filter(Boolean)
              .map((step, index) => (
                <p key={`${index}-${step.slice(0, 20)}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>{step}
                </p>
              ))}
          </div>
          {recipe.strSource && (
            <a className="source-link" href={recipe.strSource} target="_blank" rel="noreferrer">
              See original recipe ↗
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
