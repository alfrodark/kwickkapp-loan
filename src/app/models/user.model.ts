export interface User {
  uid: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  photoUrl?: string;
}

export interface UserSettings {
  notificationEnabled: boolean;
  theme: string;

}
