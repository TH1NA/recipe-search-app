import { useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import useFavorites from "./hooks/useFavorites.js";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import RecipePage from "./pages/RecipePage.jsx";

export default function App() {
  const { favorites, toggleFavorite, storageError } = useFavorites();
  const handleToggleFavorite = useCallback(
    (id) => toggleFavorite(id),
    [toggleFavorite],
  );

  return (
    <>
      <Header favoriteCount={favorites.length} />
      {storageError && <p className="storage-notice" role="alert">{storageError}</p>}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <RecipePage
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
