declare module '@okta/okta-vue' {
  import { PluginObject } from 'vue';

  const Auth: PluginObject<{
    issuer: string;
    clientId: string;
    redirectUri: string;
    postLoginRedirectUri: string;
    scopes: string[];
    responseType: ('id_token' | 'token' | 'code')[];
    pkce: boolean;
  }>;
  export default Auth;
}
