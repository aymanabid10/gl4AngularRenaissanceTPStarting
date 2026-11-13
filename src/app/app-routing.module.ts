import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";
import { SelectivePreloadingStrategy } from "./services/selective-preloading-strategy";
import { LoginComponent } from "./auth/login/login.component";
import { NF404Component } from "./components/nf404/nf404.component";
import { FrontComponent } from "./templates/front/front.component";
import { MiniWordComponent } from "./directives/mini-word/mini-word.component";
import { NgclassComponent } from "./directives/ngclass/ngclass.component";
import { RhComponent } from "./optimizationPattern/rh/rh.component";
import { ProductsComponent } from "./products/products.component";

const routes: Route[] = [
  { path: "login", component: LoginComponent },
  { path: "rh", component: RhComponent },
  { path: "products", component: ProductsComponent },
  {
    path: "cv",
    loadChildren: () => import("./cv/cv.module").then((m) => m.CvModule),
    data: { preload: true },
  },
  {
    path: "",
    component: FrontComponent,
    children: [
      {
        path: "todo",
        loadChildren: () =>
          import("./todo/todo.module").then((m) => m.TodoModule),
        data: { preload: true },
      },
      { path: "word", component: MiniWordComponent },
      { path: "ngclass", component: NgclassComponent },
    ],
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./templates/admin.module").then((m) => m.AdminModule),
  },
  { path: "**", component: NF404Component },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: SelectivePreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
