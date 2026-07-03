export type RecipeItem = {
  id: number;
  name: string;
  image: string;
  cuisine: string;
  cookTimeMinutes: number;
  rating: number;
  tags: string[];
  ingredients: string[];
  instructions: string[];
  difficulty?: string;
  servings?: number;
};

export type RecipesResponse = {
  recipes: RecipeItem[];
  total: number;
};
