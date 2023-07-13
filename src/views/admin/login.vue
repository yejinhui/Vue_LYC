<template>
  <div :class="{ container: true, 'sign-up-model': vari }">
    <div class="inner-left-container">
      <div class="login-content">
        <h1 style="color: white;">六叶草<span class="ver">( Ver 1.0 )</span></h1>
        <ElButton type="primary" @click="onClick" size="large">去注册</ElButton>
      </div>
      <img src="@/icons/svg/login-bg.svg" class="image"/>
    </div>
    <div class="inner-right-container">
      <div class="register-content">
        <h1 style="color: white;">六叶草<span class="ver">( Ver 1.0 )</span></h1>
        <ElButton type="primary" @click="onClick" size="large">去登录</ElButton>
      </div>
      <img src="@/icons/svg/register-bg.svg" class="image"/>
    </div>
    <div class="inner-sign-up-container">
      <login :class="{ 'sign-up-model': vari }"></login>
      <register :class="{ 'sign-up-model': vari }"></register>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import login from '@/views/admin/login/loginForm.vue'
import register from '@/views/admin/login/registerForm.vue'
const onClick = () => {
  vari.value = !vari.value
}
let vari = ref<boolean>(false)
</script>

<style lang="less" scoped="scoped">
@import url('less/login.less');
</style>
