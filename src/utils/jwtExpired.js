import {jwtDecode} from 'jwt-decode';

export const  isTokenExpired = (token) => {
  const { exp } = jwtDecode(token);
  const now = Math.floor(Date.now() / 1000);
  return exp < now;
}