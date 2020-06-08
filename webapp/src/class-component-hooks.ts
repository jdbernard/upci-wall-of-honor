// see https://class-component.vuejs.org/guide/additional-hooks.html
import Component from 'vue-class-component';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate',
  'beforeRouteLeave'
]);
