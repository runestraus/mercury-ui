import { User } from './user.model';
export class UserData {
  profile: Profile;
  user: User;
}
export class Profile {
  id: string;
  name: string;
  givenName: string;
  familyName: string;
  imageUrl: string;
  email: string;
}
// Echoes typings
export interface GoogleApiAuthBasic {
  get(): any;
}
export interface GoogleProfile {
  getId(): string;
  getName(): string;
  getGivenName(): string;
  getFamilyName(): string;
  getImageUrl(): string;
  getEmail(): string;
}
export interface GoogleAuthResponse {
  access_token: string;
  id_token: string;
  login_hint: string;
  scope: string;
  expires_in: string;
  first_issued_at: string;
  expires_at: string;
  currentUser: any;
  isSignedIn: any;
  disconnect: any;
  signOut: any;
  signIn(any): Promise<GoogleAuthCurrentUser>;
}
export interface GoogleAuthCurrentUser extends GoogleApiAuthBasic {
  listen(listener: (GoogleUser: any) => any);
  getId(): string;
  isSignedIn(): boolean;
  getBasicProfile(): GoogleProfile;
  getAuthResponse(): GoogleAuthResponse;
  reloadAuthResponse(): Promise<GoogleAuthResponse>;
}
export interface GoogleAuthSignInOptions {
  app_package_name?: string;
  fetch_basic_profile?: boolean;
  prompt?: string;
  scope?: string;
}
