import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { take } from 'rxjs/operators';
import AdminLoginView from '@/views/admin/AdminLogin.vue';
import AdministrationView from '@/views/admin/Administration.vue';
import EditMinisterView from '@/views/admin/EditMinister.vue';
import MinisterTableView from '@/views/admin/MinisterTable.vue';
import DeceasedMinistersView from '@/views/DeceasedMinisters.vue';
import OrderOfTheFaithView from '@/views/OrderOfTheFaith.vue';
import IndexView from '@/views/Index.vue';
import MinisterBiographyView from '@/views/MinisterBiography.vue';
import { parseSearchQuery } from '@/data/search.model';
import UserStore from '@/data/user.store';

Vue.use(VueRouter);

// Routes for the app when served from oof.upci.org
const routes: Array<RouteConfig> = [
  {
    path: '/deceased-ministers',
    name: 'DeceasedMinisters',
    meta: { title: 'Deceased Ministers - UPCI Wall Of Honor' },
    component: DeceasedMinistersView,
    props: route => ({ searchState: parseSearchQuery(route) })
  },
  {
    path: '/order-of-the-faith/:year?/:page?',
    name: 'OrderOfTheFaith',
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
    path: '/admin/login',
    meta: { title: 'Administration - UPCI Wall of Honor' },
    name: 'AdminLogin',
    component: AdminLoginView
  },
  {
    path: '/admin',
    meta: { title: 'Administration - UPCI Wall of Honor' },
    component: AdministrationView,
    children: [
      { path: '', redirect: { name: 'AdminAllMinistersTable' } },
      {
        path: 'all-ministers',
        name: 'AdminAllMinistersTable',
        component: MinisterTableView,
        meta: {
          authRequired: true,
          title: 'All Ministers - UPCI Wall of Honor'
        },
        props: { filter: 'all' }
      },
      {
        path: 'order-of-the-faith',
        name: 'AdminOrderOfTheFaithTable',
        component: MinisterTableView,
        meta: {
          authRequired: true,
          title: 'Order of the Faith - UPCI Wall of Honor'
        },
        props: { filter: 'ootf' }
      },
      {
        path: 'edit-minister/:slug',
        name: 'AdminEditMinister',
        component: EditMinisterView,
        meta: {
          authRequired: true,
          title: 'Edit Minister - UPCI Wall of Honor'
        }
      },
      {
        path: 'add-minister',
        name: 'AdminAddMinister',
        component: EditMinisterView,
        meta: {
          authRequired: true,
          title: 'Add Minister - UPCI Wall of Honor'
        }
      }
    ]
  },
  {
    path: '/',
    name: 'Index',
    component: IndexView
  }
];

// Routes for the app when served from oof.upci.org
const oofRoutes: Array<RouteConfig> = [
  {
    path: '/minister-bio/:slug',
    name: 'MinisterBiography',
    meta: { title: "Minister's Biography - UPCI Wall of Honor" },
    component: MinisterBiographyView
  },
  {
    path: '/:year?/:page?',
    name: 'OrderOfTheFaith',
    meta: { title: 'Order of the Faith - UPCI Wall Of Honor' },
    component: OrderOfTheFaithView,
    props: route => ({ searchState: parseSearchQuery(route) })
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes:
    window.location.host === 'oof.upci.org' ||
    process.env.VUE_APP_UPCI_WOH_FORCE_OOTF
      ? oofRoutes
      : routes
});

router.beforeEach((to, from, next) => {
  UserStore.isAuthenticated$.pipe(take(1)).subscribe(isAuthed => {
    if (to.meta.authRequired && !isAuthed) {
      next({ name: 'AdminLogin' });
    } else {
      document.title = to.meta.title || 'UPCI Wall Of Honor';
      next();
    }
  });
});

export default router;
