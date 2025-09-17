import { User } from '../interfaces/user.interface';

export const usersData: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@laptopmarket.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    username: 'john_doe',
    email: 'john@example.com',
    role: 'user',
    isActive: true,
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 3,
    username: 'jane_smith',
    email: 'jane@example.com',
    role: 'user',
    isActive: true,
    createdAt: new Date('2024-03-10'),
  },
];
