export const Titles = {
  adminDashboard: 'Balance',
  sellerHome: 'Venta de Recargas',
  pleaseWaitPopUp: 'Por favor espere...'
} as const;

export const NonExistentUser = {
    username: 'invalidUser',
    password: 'invalidPassword'
}

export const BlockedAdminUser = {
    username: 'dparra',
    password: '123654'
}

export type Role = 'admin' | 'seller';

export const Users = {
  admin: {
    username: process.env.USERNAME_ADMIN ?? '',
    password: process.env.PASSWORD_ADMIN ?? ''
  },
  seller: {
    username: process.env.USERNAME_SELLER ?? '',
    password: process.env.PASSWORD_SELLER ?? ''
  }
} satisfies Record<Role, { username: string; password: string }>;
