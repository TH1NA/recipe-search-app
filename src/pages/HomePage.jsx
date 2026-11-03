import { useEffect, useState } from "react";
import { getCategories, getRandomMeal } from "../api/mealDb.js";
import RecipeGrid from "../components/RecipeGrid.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useRecipes from "../hooks/useRecipes.js";
import { Link } from "react-router-dom";

export default function HomePage({
  favorites,
  onToggleFavorite,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [featureError, setFeatureError] = useState("");
  const { recipes, loading, error } = useRecipes(searchTerm, category);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      getCategories(controller.signal),
      getRandomMeal(controller.signal),
    ])
      .then(([categoryList, meal]) => {
        setCategories(categoryList);
        setFeaturedRecipe(meal);
      })
      .catch((requestError) => {
        if (requestError.name !== "CanceledError") {
          setCategoriesError("Some discovery features are unavailable.");
          setFeatureError("Today's pick is unavailable right now.");
        }
      });

    return () => controller.abort();
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
  }

  function clearSearch() {
    setSearchInput("");
    setSearchTerm("");
    setCategory("");
  }

  const hasSelection = Boolean(searchTerm || category);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> GOOD FOOD, GOOD MOOD</p>
          <h1>Find your next<br />favorite <em>thing.</em></h1>
          <p className="hero-description">
            A little inspiration for whatever is in your fridge, on your mind,
            or around your table.
          </p>
          <form className="search-form" onSubmit={handleSearch}>
            <label className="search-box">
              <span className="search-icon" aria-hidden="true">⌕</span>
              <span className="visually-hidden">Search recipes</span>
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Try “salmon”, “pasta”, “quick dinner”…"
              />
            </label>
            <button className="button button-dark" type="submit">Search</button>
          </form>
          <p className="search-hint">A few ideas to get you started:
            {["Chicken", "Pasta", "Vegetarian"].map((term) => (
              <button
                className="suggestion"
                key={term}
                type="button"
                onClick={() => {
                  setSearchInput(term);
                  setSearchTerm(term);
                  setCategory("");
                }}
              >
                {term}
              </button>
            ))}
          </p>
        </div>
        <div className="hero-art" aria-label="A table of fresh ingredients">
          <div className="hero-art-circle">
            <div className="hero-plate">
              <span className="plate-leaf leaf-one" />
              <span className="plate-leaf leaf-two" />
              <span className="plate-tomato tomato-one" />
              <span className="plate-tomato tomato-two" />
              <span className="plate-pasta">〰</span>
            </div>
            <span className="art-sparkle sparkle-one">✳</span>
            <span className="art-sparkle sparkle-two">✦</span>
            <span className="art-caption">made with<br />a little love</span>
          </div>
          <span className="hero-note">YOUR TABLE, YOUR RULES</span>
        </div>
      </section>

      <section className="discovery-section" id="recipes">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{hasSelection ? "THE GOOD STUFF" : "A LITTLE INSPIRATION"}</p>
            <h2>{hasSelection ? "Recipes for you" : "What sounds good?"}</h2>
          </div>
          <label className="category-select-label">
            <span className="visually-hidden">Filter by category</span>
            <select value={category} onChange={handleCategoryChange}>
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.strCategory} value={item.strCategory}>
                  {item.strCategory}
                </option>
              ))}
            </select>
          </label>
        </div>

        {categoriesError && <p className="inline-notice">{categoriesError}</p>}
        {error && <StatusMessage>{error}</StatusMessage>}
        {loading && (
          <div className="loading-grid" aria-label="Loading recipes">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="skeleton-card" key={index} />
            ))}
          </div>
        )}
        {!loading && !error && hasSelection && recipes.length > 0 && (
          <RecipeGrid
            recipes={recipes}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        )}
        {!loading && !error && hasSelection && recipes.length === 0 && (
          <StatusMessage action={
            <button className="text-button" type="button" onClick={clearSearch}>
              Clear filters
            </button>
          }>
            No recipes found. Try another search or category.
          </StatusMessage>
        )}
        {!hasSelection && !loading && (
          <div className="category-shelf">
            {[
              { label: "Weeknight wins", detail: "Fast, fuss-free favorites", icon: "◷", category: "Chicken" },
              { label: "Plant-powered", detail: "Veggies in the spotlight", icon: "✿", category: "Vegetarian" },
              { label: "Something sweet", detail: "A treat for later", icon: "♡", category: "Dessert" },
            ].map((item, index) => (
              <button
                className={`category-tile tile-${index + 1}`}
                key={item.label}
                type="button"
                onClick={() => setCategory(item.category)}
              >
                <span className="tile-icon" aria-hidden="true">{item.icon}</span>
                <span className="tile-label">{item.label}</span>
                <span className="tile-detail">{item.detail}</span>
                <span className="tile-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="feature-banner">
        <div className="feature-copy">
          <p className="eyebrow">A LITTLE SOMETHING SPECIAL</p>
          <h2>Out of ideas?<br /><em>Let us pick.</em></h2>
          <p>Every good meal starts somewhere. Here's a surprise to get you going.</p>
          {featuredRecipe ? (
            <Link className="button button-dark" to={`/recipe/${featuredRecipe.idMeal}`}>
              Meet today's pick <span aria-hidden="true">↗</span>
            </Link>
          ) : (
            <span className="feature-unavailable">{featureError || "Finding today's pick…"}</span>
          )}
        </div>
        <div className="feature-image-wrap">
          {featuredRecipe && (
            <img src={featuredRecipe.strMealThumb} alt={featuredRecipe.strMeal} />
          )}
          <span className="feature-sticker">chef's<br />choice</span>
        </div>
      </section>

      <footer className="site-footer">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">g.</span>
          <span>gather<span className="brand-amp">&amp;</span>graze</span>
        </Link>
        <p>Made for good food and even better company.</p>
        <a href="https://www.themealdb.com/" target="_blank" rel="noreferrer">
          Recipes by TheMealDB ↗
        </a>
      </footer>
    </main>
  );
}
