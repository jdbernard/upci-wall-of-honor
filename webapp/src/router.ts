import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import DeceasedMinistersView from '@/views/DeceasedMinisters.vue';
import OrderOfTheFaithView from '@/views/OrderOfTheFaith.vue';
import IndexView from '@/views/Index.vue';
import MinisterBiographyView from '@/views/MinisterBiography.vue';
import { parseSearchQuery } from '@/data/search.model';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/deceased-ministers',
    name: 'DeceasedMinisters',
    meta: { title: 'Deceased Ministers - UPCI Wall Of Honor' },
    component: DeceasedMinistersView,
    props: route => ({ searchState: parseSearchQuery(route) })
  },
  {
    path: '/order-of-the-faith',
    name: 'OrderOfTheFaith',
    meta: { title: 'Order of the Faith - UPCI Wall Of Honor' },
    component: OrderOfTheFaithView,
    props: route => ({ searchState: parseSearchQuery(route) })
  },
  {
    path: '/order-of-the-faith/:year/:page',
    name: 'OrderOfTheFaithByYear',
    meta: { title: 'Order of the Faith - UPCI Wall Of Honor' },
    component: OrderOfTheFaithView,
    props: route => ({ searchState: parseSearchQuery(route) })
  },
  {
    path: '/minister-bio/:slug',
    name: 'MinisterBiography',
    meta: { title: "Minister's Biography - UPCI Wall of Honor" },
    component: MinisterBiographyView
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

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'UPCI Wall Of Honor';
  next();
});

export default router;
