import { Injectable } from '@nestjs/common';
import { usersData } from '../../data/users.data';
import { User } from '../../interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = usersData;

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  /** Creează un nou utilizator */
  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newId =
      this.users.length > 0 ? Math.max(...this.users.map((u) => u.id)) + 1 : 1;
    const newUser: User = { id: newId, createdAt: new Date(), ...userData };
    this.users.push(newUser);
    return newUser;
  }

  /** Actualizează un utilizator existent */
  updateUser(id: number, updates: Partial<User>): User | null {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    Object.assign(user, updates);
    return user;
  }

  /** Șterge un utilizator după id */
  deleteUser(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}
