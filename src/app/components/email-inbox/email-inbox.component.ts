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
  constructor(private emailService: EmailService) {}

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
}
