export const Titles = {
  adminDashboard: '¿Qué deseas hacer hoy?'
} as const;

export const NonExistentUser = {
    username: 'invalidUser',
    password: 'invalidPassword'
}

export type Role = 'admin' | 'leader' | 'dataEntry';

export const Users = {
  admin: {
    username: process.env.USERNAME_ADMIN ?? '',
    password: process.env.PASSWORD_ADMIN ?? ''
  },
  leader: {
    username: process.env.USERNAME_LEADER ?? '',
    password: process.env.PASSWORD_LEADER ?? ''
  },
  dataEntry: {
    username: process.env.USERNAME_DATAENTRY ?? '',
    password: process.env.PASSWORD_DATAENTRY ?? ''
  }
} satisfies Record<Role, { username: string; password: string }>;
