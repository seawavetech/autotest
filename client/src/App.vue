<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Header from './components/header.vue'
import Footer from './components/footer.vue'
import Aside    from './components/aside.vue'
</script>

<template>
    <el-container style="flex:auto;flex-direction: column">
        <el-header style="display:flex;padding: 0;">
            <Header></Header>
        </el-header>
        <el-container style="flex-grow:1;">
            <el-aside width="auto" style="display:flex; padding: 0;">
                <Aside></Aside>
            </el-aside>
            <el-container>
                <el-main style="background-color: #fff;">
                    <RouterView />
                </el-main>
                <el-footer style="display:flex; padding: 0;">
                    <Footer></Footer>
                </el-footer>
            </el-container>
        </el-container>
    </el-container>

<!--    <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

-->
</template>

<style lang="less" scoped>

</style>

<style lang="less" >
#app {
    display: flex;
    width: 100vw;
    height: 100vh;
}
</style>
