import axios from "axios";

const mealDb = axios.create({
  baseURL: "https://www.themealdb.com/api/json/v1/1",
  timeout: 10000,
});

export async function searchMeals(query, signal) {
  const { data } = await mealDb.get("/search.php", {
    params: { s: query },
    signal,
  });
  return data.meals ?? [];
}

export async function getMealsByCategory(category, signal) {
  const { data } = await mealDb.get("/filter.php", {
    params: { c: category },
    signal,
  });
  return data.meals ?? [];
}

export async function getCategories(signal) {
  const { data } = await mealDb.get("/list.php", {
    params: { c: "list" },
    signal,
  });
  return data.meals ?? [];
}

export async function getMealById(id, signal) {
  const { data } = await mealDb.get("/lookup.php", {
    params: { i: id },
    signal,
  });
  return data.meals?.[0] ?? null;
}

export async function getRandomMeal(signal) {
  const { data } = await mealDb.get("/random.php", { signal });
  return data.meals?.[0] ?? null;
}
