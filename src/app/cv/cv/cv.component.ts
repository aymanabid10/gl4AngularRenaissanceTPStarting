import { Component, ChangeDetectionStrategy } from "@angular/core";
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
export class CvComponent {
  cvs: Cv[] = [];
  selectedCv: Cv | null = null;
  /*   selectedCv: Cv | null = null; */
  date = new Date();

  constructor(
    private logger: LoggerService,
    private toastr: ToastrService,
    private cvService: CvService
  ) {
    // PROBLEM: HTTP call, toasts and logging run in the constructor, so merely instantiating the
    // component (incl. in tests) fires a request, and cvs/selectedCv are written from callbacks.
    // → FIX (TP1-28): expose cvs$ as a cold stream consumed by the async pipe; side effects move
    // to ngOnInit/tap().
    this.cvService.getCvs().subscribe({
      next: (cvs) => {
        this.cvs = cvs;
      },
      // PROBLEM: error handling is buried in the subscriber, so the stream cannot be reused or
      // composed. → FIX (TP1-29): catchError in the pipe returns the fake cvs as a fallback stream.
      error: () => {
        this.cvs = this.cvService.getFakeCvs();
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
      },
    });
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
    // PROBLEM: selectCv$ is a Subject on a root-provided service and never completes, so every
    // CvComponent instance leaves a live subscriber behind (leak) that is never unsubscribed.
    // → FIX (TP1-28): bind selectedCv$ with the async pipe, which unsubscribes on destroy.
    this.cvService.selectCv$.subscribe((cv) => (this.selectedCv = cv));
  }
}
