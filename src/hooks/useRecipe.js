import { useEffect, useState } from "react";
import { getMealById } from "../api/mealDb.js";

export default function useRecipe(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadRecipe() {
      setLoading(true);
      setError("");

      try {
        const result = await getMealById(id, controller.signal);
        setRecipe(result);
      } catch (requestError) {
        if (requestError.name !== "CanceledError") {
          setError("We couldn't load this recipe. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadRecipe();
    return () => controller.abort();
  }, [id]);

  return { recipe, loading, error };
}
