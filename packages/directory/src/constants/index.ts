export const Titles = {
  dashboardTitle: '¿Qué deseas hacer hoy?',
  successfulLoginMessage: '¡Inicio de sesión exitoso!',
  welcomeMessage: 'Hola '
} as const;

export const KeyWords = {
  testWord: 'Test'
} as const;

export const Strings = {
  emptyString: '',
} as const;

export const NonExistentUser = {
    username: 'invalidUser@test.com',
    password: 'invalidPassword'
}

export const PageConstantMessages = {
  badEmailFormat: 'Ingrese un correo "xxxx@xxxxx.xxx" válido',
  requiredField: 'Campo obligatorio'
}

export type Role = 'admin' | 'leader' | 'dataEntry';

export const Users = {
  admin: {
    username: process.env.USERNAME_ADMIN ?? '',
    password: process.env.PASSWORD_ADMIN ?? '',
    name: 'UsuarioAdmin'
  },
  leader: {
    username: process.env.USERNAME_LEADER ?? '',
    password: process.env.PASSWORD_LEADER ?? '',
    name: 'nombreLíder'
  },
  dataEntry: {
    username: process.env.USERNAME_DATAENTRY ?? '',
    password: process.env.PASSWORD_DATAENTRY ?? '',
    name: 'nombreDigitador'
  }
} satisfies Record<Role, { username: string; password: string; name: string }>;
