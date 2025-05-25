<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header-container"><Header></Header></el-header>
      <el-main class="main-container"><RouterView /></el-main>
      <el-footer><Footer></Footer></el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue'
import Footer from './Footer.vue'
</script>

<style scoped lang="scss">
.el-header {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1.5px solid var(--user-theme-color);
}

.el-main,
.el-footer {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.header-container {
  height: 70px;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
}

.main-container {
  padding-top: 90px;
}
</style>
