import { Component } from '@angular/core';
import { EmailService } from '../../services/email-service.service';

@Component({
  selector: 'app-email-generate',
  templateUrl: './email-generate.component.html',
  styleUrls: ['./email-generate.component.css'],
})
export class EmailGenerateComponent {
  email: string = '';

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    const storageEmail = localStorage.getItem('@Temp_Email');
    if (storageEmail) {
      this.email = JSON.parse(storageEmail);
    }

    this.emailService.introduceSession().subscribe((response: any) => {
      if (response && response.data && response.data.introduceSession) {
        const newEmail = response.data.introduceSession.addresses[0].address;

        if (!storageEmail) {
          localStorage.setItem('@Temp_Email', JSON.stringify(newEmail));
        }

        if (!this.email) {
          this.email = newEmail;
        }
      }
    });
  }
}
