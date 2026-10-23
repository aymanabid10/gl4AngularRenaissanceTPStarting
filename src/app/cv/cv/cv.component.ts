import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
@Component({
    selector: "app-cv",
    templateUrl: "./cv.component.html",
    styleUrls: ["./cv.component.css"],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CvComponent implements OnInit {
  // PROBLEM: cvs/selectedCv were plain fields written from subscribe callbacks, and the
  // selectCv$ subscription was never released (root-provided Subject → leak).
  // → FIX: expose cold streams; the template's async pipe subscribes on view creation,
  // unsubscribes on destroy and marks the view for check on each emission.
  cvs$: Observable<Cv[]>;
  selectedCv$: Observable<Cv>;
  date = new Date();

  constructor(
    private logger: LoggerService,
    private toastr: ToastrService,
    private cvService: CvService
  ) {
    // PROBLEM: the constructor fired the HTTP call, toasts and logging, so instantiating the
    // component (incl. in tests) had side effects. → FIX: the constructor only wires streams.
    this.cvs$ = this.cvService.getCvs();
    this.selectedCv$ = this.cvService.selectCv$;
  }

  ngOnInit(): void {
    // One-shot UI side effects live in ngOnInit rather than tap() on a stream: tap() would
    // re-fire on every subscription to cvs$ (each async pipe or resubscribe), ngOnInit runs once.
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
  }
}
