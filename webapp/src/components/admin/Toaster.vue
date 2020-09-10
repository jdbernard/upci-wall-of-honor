<template>
  <transition-group name="toast-messages" id="toast-container" tag="ul">
    <li v-for="msg in messages" :key="msg.id" :class="msg.type">
      <div class="icon" @click="dismissMessage(msg.id)">
        <fa-icon :icon="iconForMsg(msg)"></fa-icon>
      </div>
      <div class="message">{{ msg.message }}</div>
    </li>
  </transition-group>
</template>
<script lang="ts" src="./Toaster.ts"></script>
<style lang="scss" src="./Toaster.scss"></style>
