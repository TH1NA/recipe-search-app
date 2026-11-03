import RecipeCard from "./RecipeCard.jsx";

export default function RecipeGrid({ recipes, favorites, onToggleFavorite }) {
  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.idMeal}
          recipe={recipe}
          isFavorite={favorites.includes(recipe.idMeal)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
