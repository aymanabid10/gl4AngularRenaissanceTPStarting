import { isDevMode, importProvidersFrom } from "@angular/core";


import { AuthInterceptorProvider } from "./app/auth/interceptors/auth.interceptor";
import { provideHttpClient, withXhr, withInterceptorsFromDi } from "@angular/common/http";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import {  routes } from "./app/app-routing.module";
import { ServiceWorkerModule } from "@angular/service-worker";
import { AppComponent } from "./app/app.component";
import { provideRouter } from "@angular/router";


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, // required animations module
        ToastrModule.forRoot(), // ToastrModule added
         ReactiveFormsModule, ServiceWorkerModule.register("ngsw-worker.js", {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: "registerWhenStable:30000",
        })),
        AuthInterceptorProvider,
        provideRouter(routes),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
    ]
})
  .catch(err => console.error(err));
