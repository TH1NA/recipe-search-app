import { useEffect, useState } from "react";
import {
  getMealsByCategory,
  searchMeals,
} from "../api/mealDb.js";

export default function useRecipes(query, category) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const term = query.trim();

    if (!term && !category) {
      setRecipes([]);
      setLoading(false);
      setError("");
      return () => controller.abort();
    }

    async function loadRecipes() {
      setLoading(true);
      setError("");

      try {
        const results = term
          ? await searchMeals(term, controller.signal)
          : await getMealsByCategory(category, controller.signal);
        const matchingRecipes =
          term && category
            ? results.filter((recipe) => recipe.strCategory === category)
            : results;
        setRecipes(matchingRecipes);
      } catch (requestError) {
        if (requestError.name !== "CanceledError") {
          setError("We couldn't load recipes right now. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadRecipes();
    return () => controller.abort();
  }, [query, category]);

  return { recipes, loading, error };
}
