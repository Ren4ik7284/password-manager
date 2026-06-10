import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin.html",
  styleUrls: ["./admin.css"]
})
export class AdminComponent implements OnInit {
  messages: any[] = [];
  loading = true;
  error = "";
  isDark = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const theme = localStorage.getItem("theme");
    this.isDark = theme === "dark";
    this.loadMessages();
  }

  loadMessages() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      this.error = "Не авторизован";
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders().set("Authorization", "Bearer " + token);
    this.http.get("http://localhost:3000/support/all-messages", { headers }).subscribe({
      next: (data: any) => {
        this.messages = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Ошибка загрузки";
        this.loading = false;
      }
    });
  }

  updateStatus(id: number, event: any) {
    const status = event.target.value;
    const token = localStorage.getItem("access_token");
    const headers = new HttpHeaders().set("Authorization", "Bearer " + token);
    this.http.post("http://localhost:3000/support/update-status", { id, status }, { headers }).subscribe({
      next: () => {
        const msg = this.messages.find(m => m.id === id);
        if (msg) msg.status = status;
      }
    });
  }

  getStatusText(status: string): string {
    const map: any = { new: "Новое", processing: "В обработке", resolved: "Решено" };
    return map[status] || status;
  }

  getStatusCount(status: string): number {
    return this.messages.filter(m => m.status === status).length;
  }

  deleteMessage(id: number) {
    const token = localStorage.getItem("access_token");
    const headers = new HttpHeaders().set("Authorization", "Bearer " + token);
    this.http.delete(`http://localhost:3000/support/delete/${id}`, { headers }).subscribe({
      next: () => {
        this.messages = this.messages.filter(m => m.id !== id);
      }
    });
  }
}
