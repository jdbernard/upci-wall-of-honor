import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import DeceasedMinistersView from '@/views/DeceasedMinisters.vue';
import IndexView from '@/views/Index.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/deceased-ministers',
    name: 'DeceasedMinisters',
    component: DeceasedMinistersView
  },
  {
    path: '/',
    name: 'Index',
    component: IndexView
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
