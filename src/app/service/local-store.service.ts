import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {

  constructor() { }
  saveLocalStore(key: string, value: string) {
    localStorage.setItem(key, value)
  }
  removeLocalStore(key: string) {
    localStorage.removeItem(key)
  }
  removeAllLocalStore() {
    localStorage.removeItem('NS-Label_access_token')
    localStorage.removeItem('NS-Label_refresh_token')
    localStorage.removeItem('NS-Label_profile')
    localStorage.removeItem('NS-Label-department')
    localStorage.removeItem('NS-Label_role')
  }
  getToken(): string | null {
    return localStorage.getItem('NS-Label_access_token')
  }
  getRefreshToken(): string | null {
    return localStorage.getItem('NS-Label_refresh_token')
  }
  setToken(value: string) {
    localStorage.setItem('NS-Label_access_token', value)
  }
  setRefreshToken(value: string) {
    localStorage.setItem('NS-Label_refresh_token', value)
  }

  getProfile(): string | null {
    return localStorage.getItem('NS-Label_profile')
  }
  setProfile(value: string) {
    localStorage.setItem('NS-Label_profile', value)
  }
  getDepartment(): string | null {
    return localStorage.getItem('NS-Label-department')
  }
  setDepartment(value: string) {
    localStorage.setItem('NS-Label-department', value)
  }

  getRole(): string | null {
    return localStorage.getItem('NS-Label_role')
  }
  setRole(value: string) {
    localStorage.setItem('NS-Label_role', value)
  }



}
