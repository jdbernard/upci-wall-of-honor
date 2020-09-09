import { Component, Vue } from 'vue-property-decorator';
import { stringifyQuery } from '@/util';
import UPCILogo from '@/assets/svg-components/UPCILogo.vue';
import UserStore from '@/data/user.store';
import { logService } from '@jdbernard/logging';

const logger = logService.getLogger('LOGGER_NAME');

const SESSION_REDIRECT = 'session-redirect';

@Component({ components: { UPCILogo } })
export default class AdminLoginView extends Vue {
  public message = 'redirecting to the login screen...';

  private loginRedirect(to: null | string | (null | string)[]) {
    if (to) {
      if (typeof to === 'string') {
        localStorage.setItem(SESSION_REDIRECT, to);
      } else if (to[0]) {
        localStorage.setItem(SESSION_REDIRECT, to[0]);
      }
    }

    /* eslint-disable @typescript-eslint/camelcase */
    window.location.href =
      this.$appConfig.auth.loginUrl +
      stringifyQuery({
        client_id: this.$appConfig.auth.clientId,
        response_type: 'code',
        scope: 'openid',
        redirect_uri: window.origin + '/admin/login'
      });
    /* eslint-enable @typescript-eslint/camelcase */
  }

  public async mounted() {
    /*if (this.$route.query?.to) {
      this.loginRedirect(this.$route.query?.to);
    }*/
    debugger;
  }
}
