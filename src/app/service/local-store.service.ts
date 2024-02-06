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
}
