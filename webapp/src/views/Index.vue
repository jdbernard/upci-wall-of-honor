<template>
  <ul>
    <router-link to="/executive-leadership">Executive Leadership</router-link>
    <router-link to="/deceased-ministers">Deceased Ministers</router-link>
    <router-link :to="{ name: 'OrderOfTheFaith' }"
      >Order of the Faith</router-link
    >
  </ul>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
