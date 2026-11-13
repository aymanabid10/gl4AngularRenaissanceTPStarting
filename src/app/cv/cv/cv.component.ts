import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  computed,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable, catchError, of } from "rxjs";
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
import { EmbaucheService } from "../services/embauche.service";
import { ListComponent } from "../list/list.component";
import { CvCardComponent } from "../cv-card/cv-card.component";
import { EmbaucheComponent } from "../embauche/embauche.component";

@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ListComponent, CvCardComponent, EmbaucheComponent],
  standalone: true,
})
export class CvComponent implements OnInit {
  // PROBLEM: cvs/selectedCv were plain fields written from subscribe callbacks, and the
  // selectCv$ subscription was never released (root-provided Subject → leak).
  // → FIX: expose cold streams; the template's async pipe subscribes on view creation,
  // unsubscribes on destroy and marks the view for check on each emission.
  constructor(
    private logger: LoggerService,
    private toastr: ToastrService,
    private cvService: CvService,
    private embaucheService: EmbaucheService
  ) {
    // PROBLEM: the constructor fired the HTTP call, toasts and logging, so instantiating the
    // component (incl. in tests) had side effects. → FIX: the constructor only wires streams.
    // PROBLEM: the fake-cvs fallback and error toast lived in a subscribe error callback, outside
    // the stream, so the pipeline could not be composed or reused.
    // → FIX: catchError swaps the failed request for a fallback stream, keeping cvs$ a plain
    // Observable<Cv[]> that never errors for the template.
  }

  cvs$ = this.cvService.getCvs().pipe(
    catchError(() => {
      this.toastr.error(`
        Attention!! Les données sont fictives, problème avec le serveur.
        Veuillez contacter l'admin.`);
      return of(this.cvService.getFakeCvs());
    })
  );
  selectedCv$ = this.cvService.selectCv$;
  hasEmbauche = computed(
    () => this.embaucheService.embauchees().length > 0
  );
  date = new Date();

  ngOnInit(): void {
    // One-shot UI side effects live in ngOnInit rather than tap() on a stream: tap() would
    // re-fire on every subscription to cvs$ (each async pipe or resubscribe), ngOnInit runs once.
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
  }
}
