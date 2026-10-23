import { Injectable } from '@angular/core';


// tinstancih mara barka zeyed 
@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
 // persisti data under a given  key  
  persist<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`[StateManagementService] Error persisting state for key "${key}":`, error);
    }
  }

  // thib  tretreavi  data mil local storage taa key mou3ayen
  getState<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[StateManagementService] Error reading state for key "${key}":`, error);
      return null;
    }
  }

  // tclearni  ay key 
  clear(key?: string): void {
    try {
      if (key) {
        localStorage.removeItem(key);
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.error(`[StateManagementService] Error clearing state for key "${key}":`, error);
    }
  }
}
