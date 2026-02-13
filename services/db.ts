
import { User, UserRole, Activity } from '../types';

const USERS_KEY = 'tps_users';
const ACTIVITIES_KEY = 'tps_activities';

export const db = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  
  saveUser: (user: User) => {
    const users = db.getUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  },

  updateUser: (updatedUser: User) => {
    const users = db.getUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify(users.map(u => u.id === updatedUser.id ? updatedUser : u)));
  },

  getActivities: (): Activity[] => JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '[]'),

  saveActivity: (activity: Activity) => {
    const activities = db.getActivities();
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify([...activities, activity]));
  },

  deleteActivity: (id: string) => {
    const activities = db.getActivities();
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities.filter(a => a.id !== id)));
  },

  updateActivity: (updated: Activity) => {
    const activities = db.getActivities();
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities.map(a => a.id === updated.id ? updated : a)));
  }
};
