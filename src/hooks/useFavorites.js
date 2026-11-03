import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "gather-and-graze-favorites";

function readStoredFavorites() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { favorites: [], error: "" };

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === "string")) {
      throw new Error("Saved favorites have an invalid format.");
    }
    return { favorites: parsed, error: "" };
  } catch (error) {
    console.error("Unable to read saved recipes:", error);
    return {
      favorites: [],
      error: "Your saved recipes couldn't be read. Saving a recipe will replace the damaged saved list.",
    };
  }
}

export default function useFavorites() {
  const [initialState] = useState(readStoredFavorites);
  const [favorites, setFavorites] = useState(initialState.favorites);
  const [storageError, setStorageError] = useState(initialState.error);
  const lastSavedValue = useRef(JSON.stringify(initialState.favorites));

  useEffect(() => {
    const serialized = JSON.stringify(favorites);
    if (serialized === lastSavedValue.current) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, serialized);
      lastSavedValue.current = serialized;
      setStorageError("");
    } catch (error) {
      console.error("Unable to save recipes:", error);
      setStorageError("Your saved recipes couldn't be stored in this browser.");
    }
  }, [favorites]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    );
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites],
  );

  return { favorites, toggleFavorite, isFavorite, storageError };
}
