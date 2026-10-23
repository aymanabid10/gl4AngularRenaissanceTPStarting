import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
import { ListComponent } from "../list/list.component";
import { CvCardComponent } from "../cv-card/cv-card.component";
import { EmbaucheComponent } from "../embauche/embauche.component";
import { UpperCasePipe, DatePipe } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, of } from "rxjs";
@Component({
    selector: "app-cv",
    templateUrl: "./cv.component.html",
    styleUrls: ["./cv.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ListComponent, CvCardComponent, EmbaucheComponent, UpperCasePipe, DatePipe]
})
export class CvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  private cvService = inject(CvService);

  cvs = toSignal(
    this.cvService.getCvs().pipe(
      catchError(() => {
        this.toastr.error("Attention!! Les données sont fictives, problème avec le serveur. Veuillez contacter l'admin.");
        // si on ne fait pas of(...), on aura une erreur car le signal ne peut pas être null, 
        // donc on retourne un tableau vide
        // of(...) transforme la valeur en Observable
        return of(this.cvService.getFakeCvs());})
    ),
    { initialValue: [] }
  );

  selectedCv = this.cvService.selectedCv;
  date = new Date();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
  }
}
