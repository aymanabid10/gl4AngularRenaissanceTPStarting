import { Component, ChangeDetectionStrategy, computed, inject, signal } from "@angular/core";
import { rxResource, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";
import { CvService } from "../services/cv.service";
import { ListComponent } from "../list/list.component";
import { CvCardComponent } from "../cv-card/cv-card.component";

@Component({
    selector: "app-autocomplete",
    templateUrl: "./autocomplete.component.html",
    styleUrls: ["./autocomplete.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ListComponent, CvCardComponent],
})
export class AutocompleteComponent {
  private cvService = inject(CvService);

  readonly searchTerm = signal("");

  private readonly trimmedTerm = computed(() => this.searchTerm().trim());

  private readonly debouncedTerm = toSignal(
    toObservable(this.trimmedTerm).pipe(debounceTime(300)),
    { initialValue: "" }
  );

  readonly cvs = rxResource({
    params: () => this.debouncedTerm() || undefined,
    stream: ({ params }) => this.cvService.selectByName(params),
    defaultValue: [],
  });

  readonly selectedCv = this.cvService.selectedCv;
}
