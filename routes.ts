import { AUTH_ROUTES, MAIN_ROUTES } from 'routes';

export const authRoutes = [AUTH_ROUTES.LOGIN, AUTH_ROUTES.SIGN_UP];

export const apiAuthPrefix = '/api/auth';

export const DEFAULT_LOGIN_REDIRECT = MAIN_ROUTES.HOME;
