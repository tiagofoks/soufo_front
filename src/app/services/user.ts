import { Injectable } from '@angular/core';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  github: string;
  linkedin: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userName = '';
  private userEmail = '';
  private authToken = '';
  private firstName = '';
  private lastName = '';
  private phone = '';
  private bio = '';
  private location = '';
  private github = '';
  private linkedin = '';
  private readonly apiUrl = '/api';

  constructor() {
    this.authToken = localStorage.getItem('soufo-auth-token') || '';
    this.userEmail = localStorage.getItem('soufo-user-email') || '';
    this.userName = localStorage.getItem('soufo-user-name') || '';
    this.firstName = localStorage.getItem('soufo-user-first-name') || '';
    this.lastName = localStorage.getItem('soufo-user-last-name') || '';
    this.phone = localStorage.getItem('soufo-user-phone') || '';
    this.bio = localStorage.getItem('soufo-user-bio') || '';
    this.location = localStorage.getItem('soufo-user-location') || '';
    this.github = localStorage.getItem('soufo-user-github') || '';
    this.linkedin = localStorage.getItem('soufo-user-linkedin') || '';
  }

  setUserName(name: string) {
    this.userName = name;
    localStorage.setItem('soufo-user-name', name);
  }

  getUserName(): string {
    return this.userName || 'Usuário';
  }

  setFirstName(name: string) {
    this.firstName = name;
    localStorage.setItem('soufo-user-first-name', name);
  }

  getFirstName(): string {
    return this.firstName;
  }

  setLastName(name: string) {
    this.lastName = name;
    localStorage.setItem('soufo-user-last-name', name);
  }

  getLastName(): string {
    return this.lastName;
  }

  setUserEmail(email: string) {
    this.userEmail = email;
    localStorage.setItem('soufo-user-email', email);
  }

  getEmail(): string {
    return this.userEmail;
  }

  setPhone(phone: string) {
    this.phone = phone;
    localStorage.setItem('soufo-user-phone', phone);
  }

  getPhone(): string {
    return this.phone;
  }

  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem('soufo-auth-token', token);
  }

  getAuthToken(): string {
    return this.authToken || localStorage.getItem('soufo-auth-token') || '';
  }

  isAuthenticated(): boolean {
    return Boolean(this.getAuthToken());
  }

  getInitials(): string {
    const first = this.getFirstName().trim();
    const last = this.getLastName().trim();

    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }

    const displayName = this.getUserName().trim();
    const parts = displayName.split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return 'SF';
  }

  getProfile(): UserProfile {
    return {
      firstName: this.getFirstName(),
      lastName: this.getLastName(),
      email: this.getEmail(),
      phone: this.getPhone(),
      bio: this.bio,
      location: this.location,
      github: this.github,
      linkedin: this.linkedin
    };
  }

  setProfileFromAuth(response: AuthResponse, phone = '') {
    this.setFirstName(response.firstName);
    this.setLastName(response.lastName);
    this.setUserName(`${response.firstName} ${response.lastName}`.trim());
    this.setUserEmail(response.email);
    this.setAuthToken(response.token);

    if (phone) {
      this.setPhone(phone);
    }
  }

  updateProfile(profile: Partial<UserProfile>): void {
    if (profile.firstName !== undefined) {
      this.setFirstName(profile.firstName);
    }

    if (profile.lastName !== undefined) {
      this.setLastName(profile.lastName);
    }

    if (profile.phone !== undefined) {
      this.setPhone(profile.phone);
    }

    if (profile.bio !== undefined) {
      this.bio = profile.bio;
      localStorage.setItem('soufo-user-bio', profile.bio);
    }

    if (profile.location !== undefined) {
      this.location = profile.location;
      localStorage.setItem('soufo-user-location', profile.location);
    }

    if (profile.github !== undefined) {
      this.github = profile.github;
      localStorage.setItem('soufo-user-github', profile.github);
    }

    if (profile.linkedin !== undefined) {
      this.linkedin = profile.linkedin;
      localStorage.setItem('soufo-user-linkedin', profile.linkedin);
    }

    this.setUserName(`${this.getFirstName()} ${this.getLastName()}`.trim());
  }

  logout(): void {
    this.userName = '';
    this.userEmail = '';
    this.authToken = '';
    this.firstName = '';
    this.lastName = '';
    this.phone = '';
    this.bio = '';
    this.location = '';
    this.github = '';
    this.linkedin = '';

    [
      'soufo-auth-token',
      'soufo-user-email',
      'soufo-user-name',
      'soufo-user-first-name',
      'soufo-user-last-name',
      'soufo-user-phone',
      'soufo-user-bio',
      'soufo-user-location',
      'soufo-user-github',
      'soufo-user-linkedin'
    ].forEach((key) => localStorage.removeItem(key));
  }

  async login(email: string, password: string): Promise<AuthResponse | null> {
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }

  async register(payload: RegisterPayload): Promise<AuthResponse | null> {
    const response = await fetch(`${this.apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email,
        password: payload.senha,
        firstName: payload.nome,
        lastName: payload.sobrenome
      })
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }
}
