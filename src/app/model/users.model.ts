export class RegistrarUser {
  email: string;
  securityPhrase: string;
  isActive?: boolean;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  faxNumber?: string;
  role: string;
  gaeUserId: string;
  clientId: string;
}
