export const queryKeys = {
  admin: {
    all: ['admin'] as const,
    profile: () => [...queryKeys.admin.all, 'profile'] as const,
  },
};
