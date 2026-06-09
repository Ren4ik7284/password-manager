import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./admin.html",
  styleUrls: ["./admin.css"]
})
export class AdminComponent implements OnInit {
  messages: any[] = [];
  loading = true;
  error = "";

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      this.error = "Не авторизован. Войдите в аккаунт.";
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders().set("Authorization", "Bearer " + token);

    this.http.get("http://localhost:3000/support/admin/all-messages", { headers }).subscribe({
      next: (data: any) => {
        this.messages = data;
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 403) {
          this.error = "Доступ запрещен. У вас нет прав администратора.";
        } else if (err.status === 401) {
          this.error = "Не авторизован. Войдите в аккаунт.";
        } else {
          this.error = "Ошибка загрузки сообщений";
        }
        this.loading = false;
      }
    });
  }

  updateStatus(id: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const status = select.value;
    const token = localStorage.getItem("access_token");
    const headers = new HttpHeaders().set("Authorization", "Bearer " + token);

    this.http.post("http://localhost:3000/support/admin/update-status", { id, status }, { headers }).subscribe({
      next: () => {
        const msg = this.messages.find(m => m.id === id);
        if (msg) msg.status = status;
      }
    });
  }

  getStatusText(status: string): string {
    const statuses: any = {
      new: "Новое",
      processing: "В обработке",
      resolved: "Решено"
    };
    return statuses[status] || status;
  }

  getStatusCount(status: string): number {
    return this.messages.filter(m => m.status === status).length;
  }
}
