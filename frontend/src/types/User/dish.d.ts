export interface Ingredient {
  id: number
  name: string
  slug: string
  image_url: string
}

export interface DishIngredient {
  id: number
  dish_id: number
  ingredient_id: number
  price: number
  quantity: number
  unit: number
  ingredient?: Ingredient
}

export interface Dish {
  id: number
  name: string
  slug: string
  image_url: string
  description: string
  instructions: string
  dish_ingredients?: DishIngredient[]
}

export interface PaginationData {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
}

export interface DishResponse {
  success: boolean
  message: string
  data: Dish[]
  pagination?: PaginationData
}

export interface DishDetailResponse {
  success: boolean
  message: string
  data: Dish
}
