<template>
  <div id="administration" :class="{ navCollapsed: navCollapsed }">
    <AdminNavBarComponent
      :collapsed="navCollapsed"
      @collapse="handleNavCollapse"
    ></AdminNavBarComponent>
    <router-view></router-view>
  </div>
</template>
<script lang="ts" src="./Administration.ts"></script>
<style lang="scss" src="./Administration.scss"></style>
