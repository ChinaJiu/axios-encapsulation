<script setup>
  import axios from 'axios';
  import {getListApi} from './api/good.js';
  import {login} from './api/user.js';

  function getList() {
    getListApi().then(res => {
      console.log(res)
    })
    // setTimeout(() => {
    //   getListApi().then(res => {
    //     // console.log(res)
    //   })
    // }, 500)
    // setTimeout(() => {
    //   getListApi().then(res => {
    //     // console.log(res)
    //   })
    // }, 1000)
  }

</script>

<template>
  <button @click="getList">点击</button>
  <button @click="cancleAxios">取消</button>
  <div class="loading" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 500px;
}
html, body{
  width: 100%;
  background-color: red;
}
.loading{
  width: 100px;
  height: 100px;
}
</style>
