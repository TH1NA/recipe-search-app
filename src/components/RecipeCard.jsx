import { Link } from "react-router-dom";

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  return (
    <article className="recipe-card">
      <Link
        className="recipe-image-link"
        to={`/recipe/${recipe.idMeal}`}
        aria-label={`View ${recipe.strMeal} recipe`}
      >
        <img
          className="recipe-image"
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          loading="lazy"
        />
      </Link>
      <button
        className={`favorite-button${isFavorite ? " is-favorite" : ""}`}
        type="button"
        onClick={() => onToggleFavorite(recipe.idMeal)}
        aria-label={`${isFavorite ? "Remove" : "Save"} ${recipe.strMeal} ${
          isFavorite ? "from" : "to"
        } favorites`}
        aria-pressed={isFavorite}
      >
        {isFavorite ? "♥" : "♡"}
      </button>
      <div className="recipe-card-content">
        <p className="recipe-card-category">{recipe.strCategory || "Recipe"}</p>
        <Link className="recipe-card-title" to={`/recipe/${recipe.idMeal}`}>
          {recipe.strMeal}
        </Link>
        <Link className="card-link" to={`/recipe/${recipe.idMeal}`}>
          View recipe <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
