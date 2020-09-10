<template>
  <div
    id="administration"
    :class="{ navCollapsed: navCollapsed }"
    class="theme-admin"
  >
    <AdminNavBarComponent
      :collapsed="navCollapsed"
      @collapse="handleNavCollapse"
    ></AdminNavBarComponent>
    <div id="measuring-stick"></div>
    <router-view></router-view>
    <ToasterComponent></ToasterComponent>
  </div>
</template>
<script lang="ts" src="./Administration.ts"></script>
<style lang="scss" src="./Administration.scss"></style>
