<script setup lang="ts">
import { ref } from 'vue'

const email = ref<string>('')
const password = ref<string>('')


function handleLogin() {
  alert(`Logging in with ${email.value}`)
  
}
</script>

<template >
  <div class="login-container">
    <div class="left-panel">
      <img src="@/assets/2.jpg" alt="Shopping cart" />
      <h2>Meal Planner for Busy Lives.</h2>
      <p>Plan meals, create shopping lists effortlessly.</p>
    </div>
    <div class="right-panel">
      <div class="login-box">
        <div class="title-box">
          <h1>Meal</h1>
          <small>Recipes Galore</small>
        </div>
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
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
}

.left-panel {
  width: 50%;
  flex: 1;
  background: #a020f0;
  color: white;
  padding: 3rem;
  text-align: center;
  align-content: center;
}

.left-panel img {
  width: 70%;
  max-width: 300px;
}

.right-panel {
  width: 50%;
  flex: 1;
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 100%;
  max-width: 320px;
}

.login-box .title-box{
  text-align: right;
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
  border: 1px solid #ccc;
}

.button {
  width: 100%;
  padding: 0.7rem;
  background: #a020f0;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: ease 0.5s;
  border: 1px solid #a020f0;
}

.button:hover{
  background: white;
  color: #a020f0;
  border: 1px solid #999;
}

.button-2{
  background: white;
  color: #a020f0;
  border: 1px solid #999;
}

.button-2:hover{
  background: #a020f0;
  color: white;
}

.forgot, a {
  display: block;
  position: relative;
  margin-top: 1rem;
  color: #999;
  text-align: center;
  font-size: 0.9rem;
}

.forgot::after{
  content: '';
  position: absolute;
  left: 15%;
  bottom: -0.5rem;
  width: 70%;      
  height: 1px;
  background-color: #a020f0; 
  border-radius: 2px;
}
</style>
