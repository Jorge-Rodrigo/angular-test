import { Component } from '@angular/core';
import { EmailService } from '../../services/email-service.service';

@Component({
  selector: 'app-email-generate',
  templateUrl: './email-generate.component.html',
  styleUrls: ['./email-generate.component.css'],
})
export class EmailGenerateComponent {
  email: string = '';
  timeRemaining: number = 0;
  showCopySuccess = false;

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    this.updateEmail();

    setInterval(() => {
      this.updateEmail();
    }, 1000);
  }
  copyToClipboard() {
    const emailInput = document.getElementById('email') as HTMLInputElement;

    if (emailInput) {
      emailInput.select();
      document.execCommand('copy');
      const textToCopy = emailInput.value;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          this.showCopySuccess = true;
          setTimeout(() => {
            this.showCopySuccess = false;
          }, 3000);
        })
        .catch((error) => {
          console.error('Erro ao copiar texto: ', error);
        });
    }
  }
  updateEmail() {
    const storageEmail = localStorage.getItem('@Temp_Email');
    if (storageEmail) {
      const emailInfo = JSON.parse(storageEmail);
      const expiresAt = new Date(emailInfo.expiresAt);
      const now = new Date();

      if (expiresAt > now) {
        this.email = emailInfo.email;
        this.timeRemaining = Math.floor(
          (expiresAt.getTime() - now.getTime()) / 1000
        );
      } else {
        this.requestNewEmail();
      }
    } else {
      this.requestNewEmail();
    }
  }
  requestNewEmail() {
    this.emailService.introduceSession().subscribe((response: any) => {
      if (response && response.data && response.data.introduceSession) {
        const newEmail = response.data.introduceSession.addresses[0].address;
        const expiresDate = response.data.introduceSession.expiresAt;
        const emailInfo = {
          email: newEmail,
          expiresAt: expiresDate,
        };
        localStorage.setItem('@Temp_Email', JSON.stringify(emailInfo));

        this.email = newEmail;
        const now = new Date();
        this.timeRemaining = Math.floor((expiresDate - now.getTime()) / 1000);
        this.emailService.updateCurrentEmail(this.email);
      }
    });
  }
}
