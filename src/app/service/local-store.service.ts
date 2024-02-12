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
    let len = localStorage.length
    for (let i = 0; i < len; i++) {
      let key = localStorage.key(i)
      if (key?.includes("NS-Label")) {
        localStorage.removeItem(key)
      }
    }
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

  getRole(): string | null {
    return localStorage.getItem('NS-Label_role')
  }
  setRole(value: string) {
    localStorage.setItem('NS-Label_role', value)
  }



}
