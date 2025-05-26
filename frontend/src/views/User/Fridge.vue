<template>
    <div class="fridge">
        <div class="fridge__header">
            <h2 class="fridge__title">Tủ lạnh</h2>
        </div>
        <div class="fridge--food">
            <div class="fridge--food__title">
                <h3>Món ăn</h3>
            </div>
            <div class="fridge--food__list">
                <div v-for="food in foods" :key="food.id" class="food-card">
                    <img :src="food.avatar" alt="avatar" class="food-card__avatar">
                    <div class="food-card__name">{{ food.name }}</div>
                    <div class="food-card__quantity">Số lượng: {{ food.quantity }}</div>
                    <div class="food-card__expiry">Ngày hết hạn: {{ food.expiry_date }}</div>
                    <div class="food-card__action">
                        <button class="user-btn btn-action">Chỉnh sửa</button>
                        <img src="../../assets/img/User/trashcan.png" class="img-delete">
                    </div>
                </div>
            </div>
        </div>
        <div class="fridge--ingredient">
            <div class="fridge--ingredient__title">
                <h3>Nguyên liệu</h3>
            </div>
            <div class="fridge--ingredient__list">
                <div v-for="ingredient in ingredients" :key="ingredient.id" class="ingredient-card">
                    <img :src="ingredient.avatar" alt="avatar" class="ingredient-card__avatar">
                    <div class="ingredient-card__name">{{ ingredient.name }}</div>
                    <div class="ingredient-card__quantity">Số lượng: {{ ingredient.quantity }}</div>
                    <div class="ingredient-card__expiry">Ngày hết hạn: {{ ingredient.expiry_date }}</div>
                    <div class="ingredient-card__action">
                        <button class="user-btn btn-action">Chỉnh sửa</button>
                        <img src="../../assets/img/User/trashcan.png" class="img-delete">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const foods = [
    {
        id: 1,
        name: "Gà nướng phô mai",
        quantity: 1,
        weight: 500,
        expiry_date: "26/05/2025",
        avatar: "https://avatars.githubusercontent.com/u/22339805"
    },
    {
        id: 2,
        name: "Gà nướng phô mai",
        quantity: 1,
        weight: 500,
        expiry_date: "26/05/2025",
        avatar: "https://avatars.githubusercontent.com/u/22339805"
    },
    {
        id: 3,
        name: "Gà nướng phô mai",
        quantity: 1,
        weight: 500,
        expiry_date: "26/05/2025",
        avatar: "https://avatars.githubusercontent.com/u/22339805"
    } 
]

const ingredients = [
    {
        id: 1,
        name: "Cà chua",
        quantity: 3,
        expiry_date: "26/05/2025",
        avatar: "https://avatars.githubusercontent.com/u/22339805"
    },
    {
        id: 2,
        name: "Rau muống",
        quantity: 1,
        expiry_date: "26/05/2025",
        avatar: "https://avatars.githubusercontent.com/u/22339805"
    },
    {
        id: 3,
        name: "Phô mai",
        quantity: 3,
        expiry_date: "26/05/2025",
        avatar: "https://avatars.githubusercontent.com/u/22339805"
    } 
]
</script>

<style scoped lang="scss">
.fridge {
  font-family: 'Segoe UI', sans-serif;
}

.fridge__header {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.fridge__title{
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

.img-delete{
    width: 25px;
    height: 25px;
    margin-left: auto;
}

.btn-action {
  border-radius: 20px;
  border: 1px solid var(--user-theme-color);
  font-weight: 500;
}

.btn-action:hover {
  background-color: #fff;
  color: var(--user-theme-color);
}
//fridge food
.fridge--food__title{
  font-size: 25px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.fridge--food__list{
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.food-card{
  flex: 1 1 250px;
  max-width: 250px;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.food-card__avatar{
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
}

.food-card__name{
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 15px;
}

.food-card__quantity, .food-card__expiry{
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.food-card__action{
    display: flex;
    align-items: center;
}
//ingredient
.fridge--ingredient__title{
  font-size: 25px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.fridge--ingredient__list{
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.ingredient-card{
  flex: 1 1 250px;
  max-width: 250px;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.ingredient-card__avatar{
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
}

.ingredient-card__name{
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 15px;
}

.ingredient-card__quantity, .ingredient-card__expiry{
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.ingredient-card__action{
    display: flex;
    align-items: center;
}
</style>