<template>
  <form id="admin-login" class="theme-admin">
    <UPCILogo></UPCILogo>
    <h1>Wall of Honor</h1>
    <h2>Administration</h2>
    <input
      type="text"
      placeholder="username"
      name="username"
      :model="username"
      required
    />
    <input
      type="password"
      placeholder="password"
      name="password"
      :model="password"
      required
    />
    <button class="action" @click.prevent="login">
      Login
    </button>
  </form>
</template>
<script lang="ts" src="./AdminLogin.ts"></script>
<style lang="scss" src="./AdminLogin.scss"></style>
