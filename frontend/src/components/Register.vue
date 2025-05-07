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
      <!-- <img src="@/assets/2.jpg" alt="Shopping cart" /> -->
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
      <div class="register-box">

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

.register-box {
  width: 100%;
  max-width: 320px;
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
  border: 1px solid var(--color-gray);
}

button {
  width: 100%;
  padding: 0.7rem;
  background: var(--color-purple);
  color: var(--color-white);
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

a,
router-link {
  display: block;
  margin-top: 1rem;
  color: var(--color-gray-2);
  text-align: center;
  font-size: 0.9rem;
  text-decoration: none;
}
</style>