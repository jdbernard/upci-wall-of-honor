import Vue from 'vue';
import { AppConfig } from '@/data/app.config.model';
import { User } from '@/data/user.model';

declare module 'vue/types/vue' {
  interface Vue {
    $appConfig: AppConfig;
    $auth: {
      isAuthenticated: () => boolean;
      getUser: () => User;
    };
  }
}
