import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
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
  modal: boolean = false;
  mailCount: number = 0;
  previousMailCount: number = 0;
  private emailSubscription!: Subscription;

  constructor(private emailService: EmailService) {}

  closeNotification(): void {
    this.showNotifications = false;
  }
  ngOnInit(): void {
    this.emailSubscription = this.emailService.newEmail$.subscribe(() => {
      this.enableNotifications();
    });
    this.requestMails();

    setInterval(() => {
      this.requestMails();
    }, 15000);
  }

  requestMails() {
    const storageEmail = localStorage.getItem('@Temp_Email');
    if (storageEmail) {
      const emailInfo = JSON.parse(storageEmail);
      this.email = emailInfo.email;
      const expiresAt = new Date(emailInfo.expiresAt);
      const now = new Date();
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
          if (this.mailCount > this.previousMailCount) {
            this.emailService.notifyNewEmail();
          }

          this.previousMailCount = this.mailCount;
          this.mails = emailMails;
          this.mailCount = emailMails.length;
        }
      }
    });
  }
  enableNotifications() {
    if (this.mailCount > this.previousMailCount) {
      if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            this.closeNotification();
            const notification = new Notification('Novo Email', {
              body: 'Você recebeu um novo email em sua conta temporária.',
            });
          } else if (permission === 'denied') {
            console.log('Permissão para notificações negada.');
          }
        });
      } else {
        console.log('Notificações não suportadas neste navegador.');
      }
    }
  }

  captureEmail(email: Email, mobile: boolean) {
    this.selectedMail = email;
    if (mobile) {
      this.modal = true;
    }
    console.log(this.selectedMail);
  }
  closeEmail() {
    this.modal = false;
    this.selectedMail = null;
  }
  ngOnDestroy(): void {
    this.emailSubscription.unsubscribe();
  }
}
