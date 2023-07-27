// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  keycloak: {
    url: "http://10.30.1.4:9080/auth/",
    realm: "SSO_VCM",
    clientId: "frontend-ticket",
    // url: "http://10.60.98.93:9080/auth/",
    // realm: "viettel-vss",
    // clientId: "VBOM"
  },
  apiUrl: '',
  config: {
    isHorizontalMenu: false,
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
