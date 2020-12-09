import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Auth from '@okta/okta-vue';
//import AdminLoginView from '@/views/admin/AdminLogin.vue';
import AdministrationView from '@/views/admin/Administration.vue';
import AdminGeneralOfficialsView from '@/views/admin/GeneralOfficials.vue';
import AdminMinistryDirectorsView from '@/views/admin/MinistryDirectors.vue';
import AdminGeneralBoardView from '@/views/admin/GeneralBoard.vue';
import EditMinisterView from '@/views/admin/EditMinister.vue';
import MinisterTableView from '@/views/admin/MinisterTable.vue';
import AdminPowerToolsView from '@/views/admin/PowerTools.vue';
import DeceasedMinistersView from '@/views/DeceasedMinisters.vue';
import OrderOfTheFaithView from '@/views/OrderOfTheFaith.vue';
import MinisterBiographyView from '@/views/MinisterBiography.vue';
import GeneralBoardView from '@/views/GeneralBoard.vue';
import GeneralOfficialsView from '@/views/GeneralOfficials.vue';
import MinistryDirectorsView from '@/views/MinistryDirectors.vue';
import { parseSearchQuery } from '@/data/search.model';

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
    path: '/leadership/executive',
    name: 'GeneralOfficials',
    meta: { title: 'Executive Leadership - UPCI Wall Of Honor' },
    component: GeneralOfficialsView
  },
  {
    path: '/leadership/ministries',
    name: 'MinistryDirectors',
    meta: { title: 'Ministries Leadership - UPCI Wall Of Honor' },
    component: MinistryDirectorsView
  },
  {
    path: '/leadership/general-board',
    name: 'GeneralBoard',
    meta: { title: 'General Board - UPCI Wall Of Honor' },
    component: GeneralBoardView
  },
  {
    path: '/leadership',
    name: 'Leadership',
    redirect: { name: 'GeneralOfficials' }
  },
  {
    path: '/minister-bio/:slug',
    name: 'MinisterBiography',
    meta: { title: "Minister's Biography - UPCI Wall of Honor" },
    component: MinisterBiographyView,
    props: route => ({
      leadershipPositionId: route.query?.lid
    })
  },
  {
    path: '/admin/login',
    component: Auth.handleCallback()
  },
  /*{
    path: '/admin/login',
    meta: { title: 'Administration - UPCI Wall of Honor' },
    name: 'AdminLogin',
    component: AdminLoginView
  },*/
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
          requiresAuth: true,
          title: 'All Ministers - UPCI Wall of Honor'
        },
        props: { filter: 'all' }
      },
      {
        path: 'order-of-the-faith',
        name: 'AdminOrderOfTheFaithTable',
        component: MinisterTableView,
        meta: {
          requiresAuth: true,
          title: 'Order of the Faith - UPCI Wall of Honor'
        },
        props: { filter: 'ootf' }
      },
      {
        path: 'leadership',
        name: 'AdminLeadership',
        redirect: { name: 'AdminGeneralOfficials' }
      },
      {
        path: 'leadership/executive',
        name: 'AdminGeneralOfficials',
        component: AdminGeneralOfficialsView,
        meta: {
          requiresAuth: true,
          title: 'Executive Leadership - UPCI Wall of Honor'
        }
      },
      {
        path: 'leadership/ministries',
        name: 'AdminMinistryDirectors',
        component: AdminMinistryDirectorsView,
        meta: {
          requiresAuth: true,
          title: 'Ministry Directors - UPCI Wall of Honor'
        }
      },
      {
        path: 'leadership/general-board',
        name: 'AdminGeneralBoard',
        component: AdminGeneralBoardView,
        meta: {
          requiresAuth: true,
          title: 'General Board - UPCI Wall of Honor'
        }
      },
      {
        path: 'edit-minister/:slug',
        name: 'AdminEditMinister',
        component: EditMinisterView,
        meta: {
          requiresAuth: true,
          title: 'Edit Minister - UPCI Wall of Honor'
        }
      },
      {
        path: 'add-minister',
        name: 'AdminAddMinister',
        component: EditMinisterView,
        meta: {
          requiresAuth: true,
          title: 'Add Minister - UPCI Wall of Honor'
        }
      },
      {
        path: 'power-tools',
        name: 'PowerTools',
        component: AdminPowerToolsView,
        meta: {
          requiresAuth: true,
          title: 'PowerTools - USE CAUTION'
        }
      }
    ]
  },
  { path: '/', redirect: { name: 'OrderOfTheFaith' } }
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

/*
router.beforeEach((to, from, next) => {
  UserStore.isAuthenticated$.pipe(take(1)).subscribe(isAuthed => {
    if (to.meta.requiresAuth && !isAuthed) {
      next({ name: 'AdminLogin', query: { to: to.path } });
    } else {
      document.title = to.meta.title || 'UPCI Wall Of Honor';
      next();
    }
  });
});
*/

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'UPCI Wall Of Honor';
  next();
});

export default router;
