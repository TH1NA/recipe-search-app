# Gather & Graze

A responsive recipe search app built with React, React Router, custom hooks, and
Axios. Search meals by name, filter by category, open full recipe details, and
save favorites in your browser.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

Recipe data is provided by the public [TheMealDB API](https://www.themealdb.com/).
An internet connection is required to search and load recipes.

## Routes

- `/` — discover recipes by search or category
- `/recipe/:id` — ingredients and cooking instructions
- `/favorites` — recipes saved in local storage
