import { LoginResponseDto } from './login-response.dto';

export interface AuthSession extends LoginResponseDto {
  expirationDate: number;
  email: string;
}
