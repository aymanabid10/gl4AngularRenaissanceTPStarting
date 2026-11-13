import { Component, ChangeDetectionStrategy, computed, debounced, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { CvService } from "../services/cv.service";
import { ListComponent } from "../list/list.component";
import { CvCardComponent } from "../cv-card/cv-card.component";

const MIN_LETTERS = 3;
const DEBOUNCE_MS = 300;

@Component({
    selector: "app-autocomplete",
    templateUrl: "./autocomplete.component.html",
    styleUrls: ["./autocomplete.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ListComponent, CvCardComponent],
})
export class AutocompleteComponent {
  private cvService = inject(CvService);
  protected readonly minLetters = MIN_LETTERS;

  readonly searchTerm = signal("");

  protected readonly trimmedTerm = computed(() => this.searchTerm().trim());

  private readonly debouncedTerm = debounced(this.trimmedTerm, DEBOUNCE_MS);

  protected readonly searchParam = computed(() => {
    const term = this.debouncedTerm.value();
    const letters = term.replace(/[^\p{L}]/gu, "").length;
    return letters >= MIN_LETTERS ? term : undefined;
  });

  readonly cvs = rxResource({
    params: this.searchParam,
    stream: ({ params }) => this.cvService.selectByName(params),
    defaultValue: [],
  });

  readonly selectedCv = computed(() => {
    const selected = this.cvService.selectedCv();
    const results = this.cvs.hasValue() ? this.cvs.value() : [];
    return results.some((cv) => cv.id === selected?.id) ? selected : null;
  });
}
