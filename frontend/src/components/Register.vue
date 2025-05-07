<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')

const router = useRouter()

function handleRegister() {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    alert('Please fill in all fields.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  
  alert(`Registering: ${name.value} (${email.value})`)

  
  router.push('/login')
}
</script>

<template>
    <div class="register-container">
      <div class="left-panel">
        <img src="@/assets/2.jpg" alt="Shopping cart" />
        <h2>Meal Planner for Busy Lives.</h2>
        <p>Plan meals, create shopping lists effortlessly.</p>
      </div>
    <div class="right-panel">
        <div class="register-box">
          <div class="title-box">
            <h1>Meal</h1>
            <small>Recipes Galore</small>
          </div>
          <h2>Register</h2>
          <form @submit.prevent="handleRegister">
            <label for="name">Name</label>
            <input id="name" type="text" v-model="name" placeholder="Enter your name" />
  
            <label for="email">Email</label>
            <input id="email" type="email" v-model="email" placeholder="Enter your email" />
  
            <label for="password">Password</label>
            <input id="password" type="password" v-model="password" placeholder="Enter your password" />
  
            <label for="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" v-model="confirmPassword" placeholder="Confirm your password" />
  
            <button type="submit">Sign up</button>
            <router-link to="/login">Already have an account?</router-link>
          </form>
          </div>
        </div>
      </div> 
</template>
  

  
  <style scoped>
  .register-container {
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
  
  .register-box {
    width: 100%;
    max-width: 320px;
  }

  .register-box .title-box{
  text-align: right;
}
  
  .register-box h1 {
    font-weight: bold;
    margin-bottom: 0;
  }
  
  .register-box small {
    display: block;
    margin-bottom: 2rem;
  }
  
  .register-box h2 {
    margin-bottom: 1rem;
  }
  
  input {
    width: 100%;
    padding: 0.6rem;
    margin: 0.5rem 0 1rem;
    border-radius: 10px;
    border: 1px solid #ccc;
  }
  
  button {
    width: 100%;
    padding: 0.7rem;
    background: #a020f0;
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
  }
  
  a, router-link {
    display: block;
    margin-top: 1rem;
    color: #999;
    text-align: center;
    font-size: 0.9rem;
    text-decoration: none;
  }
  </style>
  