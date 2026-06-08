import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-support",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./support.html",
  styleUrls: ["./support.css"]
})
export class SupportComponent {
  activeFaq: number | null = null;

  toggleFaq(index: number) {
    this.activeFaq = this.activeFaq === index ? null : index;
  }
}
