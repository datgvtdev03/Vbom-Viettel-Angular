import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { vi_VN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import {LayoutFullComponent} from './layout/layout-full/layout-full.component';
import {LayoutBlankComponent} from './layout/layout-blank/layout-blank.component';
import {
  AuthInterceptor,
  ErrorInterceptor,
  MenuModule, PermissionService,
  TabGroupModule, TableModule,
  VssApiService,
  VssUiConfig, VssUiModule
} from '@viettel-vss-base/vss-ui';
import {KeycloakService} from 'keycloak-angular';
import {NzModalService} from 'ng-zorro-antd/modal';
import {environment} from '@vbomEnv/environment';
import {VbomPermissionServiceService} from '@vbomApp/service/vbom-permission-service.service';
import {AuthService} from '@vbomApp/service/auth.service';
import {Router} from '@angular/router';
registerLocaleData(vi);

function initializeKeycloak(keycloak: KeycloakService): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        await keycloak.init({
          config: {
            url: environment.keycloak.url,
            realm: environment.keycloak.realm,
            clientId: environment.keycloak.clientId,
          },
          loadUserProfileAtStartUp: false,
          initOptions: {
            onLoad: 'login-required',
            checkLoginIframe: true
          },
          bearerExcludedUrls: [
          ],
        });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };
}
@NgModule({
  declarations: [
    AppComponent,
    LayoutFullComponent,
    LayoutBlankComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    MenuModule,
    TableModule,
    TabGroupModule
  ],
  providers: [
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true,
    },
    { provide: NZ_I18N, useValue: vi_VN },
    {
      provide: PermissionService,
      useClass: VbomPermissionServiceService,
      deps: [Router, AuthService]
    },

    // {
    //   provide: VssUiConfig,
    //   useClass: ExtentApi,
    //   deps: [TestService, OptionService]
    // },
    // {
    //   provide: VssApiService,
    //   useClass: BaseService,
    //   deps: [HttpClient]
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    NzModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
