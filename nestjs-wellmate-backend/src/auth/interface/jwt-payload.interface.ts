export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  isProfileComplete?: boolean;
  iat?: number;
  exp?: number;
}
