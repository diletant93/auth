export const authProviders = ['github', 'discord'] as const
export type AuthProvider = typeof authProviders[number]
