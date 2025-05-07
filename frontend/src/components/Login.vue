<script setup lang="ts">
import { ref } from 'vue'

const email = ref<string>('')
const password = ref<string>('')


function handleLogin() {
  alert(`Logging in with ${email.value}`)

}
</script>

<template>
  <div class="login-container">
    <div class="left-panel">
      <div class="overlay">
        <h2>Meal Planner for Busy Lives.</h2>
        <p>Plan meals, create shopping lists effortlessly.</p>
      </div>

    </div>
    <div class="right-panel">
      <div class="title-box">
        <h1>Meal</h1>
        <small>Recipes Galore</small>
      </div>
      <div class="login-box">
        <h2>Log in</h2>
        <form @submit.prevent="handleLogin">
          <label for="email">Email</label>
          <input id="email" type="email" v-model="email" placeholder="Enter your email" />

          <label for="password">Password</label>
          <input id="password" type="password" v-model="password" placeholder="Enter your password" />

          <button class="button" type="submit">Log in</button>
          <a class="forgot" href="#">Forgot your password?</a>

          <router-link class="button button-2" to="/register">Create account</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  height: 96vh;
  font-family: 'Segoe UI', sans-serif;
  margin: 2vh;
  border: 1px solid var(--color-purple);
}

.left-panel {
  width: 50%;
  flex: 1;
  background: url('@/assets/mealplan.jpg') no-repeat center center;
  background-size: cover;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
}

.overlay {
  background: rgba(0, 0, 0, 0.4);
  color: var(--color-white);
  padding: 0.5rem;
  border-radius: 10px;
  max-width: 90%;
  backdrop-filter: blur(2px);
}

.right-panel {
  position: relative;
  width: 50%;
  flex: 1;
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-box {
  position: absolute;
  top: 0;
  right: 10px;
}

.login-box {
  width: 100%;
  max-width: 320px;
}



.login-box h1 {
  font-weight: bold;
  margin-bottom: 0;
}

.login-box small {
  display: block;
  margin-bottom: 2rem;
}

.login-box h2 {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.6rem;
  margin: 0.5rem 0 1rem;
  border-radius: 10px;
  border: 1px solid var(--color-gray);
}

.button {
  width: 100%;
  padding: 0.7rem;
  background: var(--color-purple);
  color: var(--color-white);
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: ease 0.5s;
  border: 1px solid var(--color-purple);
}

.button:hover {
  background: var(--color-white);
  color: var(--color-purple);
  border: 1px solid var(--color-gray);
}

.button-2 {
  background: var(--color-white);
  color: var(--color-purple);
  border: 1px solid var(--color-gray);
}

.button-2:hover {
  background: var(--color-purple);
  color: var(--color-white);
}

.forgot,
a {
  display: block;
  position: relative;
  margin-top: 1rem;
  color: var(--color-gray-2);
  text-align: center;
  font-size: 0.9rem;
}

.forgot::after {
  content: '';
  position: absolute;
  left: 15%;
  bottom: -0.5rem;
  width: 70%;
  height: 1px;
  background-color: var(--color-purple);
  border-radius: 2px;
}
</style>
