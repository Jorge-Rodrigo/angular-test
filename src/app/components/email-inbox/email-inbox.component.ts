import { Component } from '@angular/core';
import { EmailService } from '../../services/email-service.service';

interface Email {
  toAddr: string;
  text: string;
  rawSize: number;
  headerSubject: string;
  fromAddr: string;
  downloadUrl: string;
}

@Component({
  selector: 'app-email-inbox',
  templateUrl: './email-inbox.component.html',
  styleUrls: ['./email-inbox.component.css'],
})
export class EmailInboxComponent {
  email: string = '';
  mails: Email[] = [];
  selectedMail: Email | null = null;
  showNotifications: boolean = true;
  modal = false;
  constructor(private emailService: EmailService) {}
  closeNotification(): void {
    this.showNotifications = false;
  }

  ngOnInit(): void {
    const storageEmail = localStorage.getItem('@Temp_Email');
    if (storageEmail) {
      const emailInfo = JSON.parse(storageEmail);
      this.email = emailInfo.email;
      const expiresAt = new Date(emailInfo.expiresAt);
      const now = new Date();
      console.log(now, expiresAt);
      if (expiresAt > now) {
        this.email = emailInfo.email;
      } else {
        localStorage.clear();
      }
    }
    this.emailService.fetchEmails().subscribe((response: any) => {
      if (response && response.data && response.data.sessions) {
        const sessions = response.data.sessions;

        const emailMails: Email[] = [];
        for (const session of sessions) {
          for (const mail of session.mails) {
            if (mail.toAddr === this.email) {
              emailMails.push(mail);
            }
          }
        }
        if (emailMails.length > 0) {
          this.mails = emailMails;
        }
      }
    });
  }
  enableNotifications() {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const notification = new Notification('Novo Email', {
            body: 'Você recebeu um novo email em sua conta temporária.',
            icon: 'caminho-para-o-ícone.png',
          });
        } else if (permission === 'denied') {
          console.log('Permissão para notificações negada.');
        }
      });
    } else {
      console.log('Notificações não suportadas neste navegador.');
    }
  }
  captureEmail(email: Email) {
    this.selectedMail = email;
    this.modal = true;
    console.log(this.selectedMail);
  }
  captureEmail2(email: Email) {
    this.selectedMail = email;

    console.log(this.selectedMail);
  }
  closeEmail() {
    this.modal = false;
    this.selectedMail = null;
  }
}
