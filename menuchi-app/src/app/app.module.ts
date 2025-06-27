import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {fa_IR, provideNzI18n} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import fa from '@angular/common/locales/fa';
import {FormsModule} from '@angular/forms';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch, withInterceptors,} from '@angular/common/http';
import {UserModule} from './user/user.module';
import {MainModule} from './main/main.module';
import {authInterceptor} from './main/interceptors/auth.interceptor';
import {errorHandlingInterceptor} from './main/interceptors/error-handling.interceptor';
import {provideAnimations} from '@angular/platform-browser/animations';

registerLocaleData(fa);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    UserModule,
    MainModule,
  ],
  providers: [
    provideNzI18n(fa_IR),
    provideAnimationsAsync(),
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorHandlingInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
