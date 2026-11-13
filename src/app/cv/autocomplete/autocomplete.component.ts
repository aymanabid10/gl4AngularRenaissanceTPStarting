import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, AbstractControl, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from "rxjs";
import { CvService } from "../services/cv.service";
import { ItemComponent } from "../item/item.component";

@Component({
    selector: "app-autocomplete",
    templateUrl: "./autocomplete.component.html",
    styleUrls: ["./autocomplete.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ItemComponent],
    standalone: true
})
export class AutocompleteComponent {
  formBuilder = inject(FormBuilder);
  cvService = inject(CvService);
  toastr = inject(ToastrService);
  get search(): AbstractControl {
    return this.form.get("search")!;
  }
  form = this.formBuilder.group({ search: [""] });
  cvs$ = this.search.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((name) =>
      name
        ? this.cvService.selectByName(name).pipe(
            catchError(() => {
              this.toastr.error("La recherche a échoué, veuillez réessayer");
              return of([]);
            })
          )
        : of([])
    )
  );
}
