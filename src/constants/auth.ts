/** Kredensial login yang disiapkan (hardcoded) */
export const AUTH_CREDENTIALS = {
  username: '23050951',
  password: 'MyP@ssw0rd',
} as const;

export type PasswordRule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'Minimal 8 karakter', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'Huruf kapital (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'Huruf kecil (a-z)', test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'Angka (0-9)', test: (p) => /[0-9]/.test(p) },
  { id: 'symbol', label: 'Simbol khusus (!@#$...)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function isPasswordFormatValid(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

export function isUsernameFormatValid(username: string): boolean {
  return username.trim() === AUTH_CREDENTIALS.username;
}

export function isLoginValid(username: string, password: string): boolean {
  return (
    username.trim() === AUTH_CREDENTIALS.username &&
    password === AUTH_CREDENTIALS.password &&
    isPasswordFormatValid(password)
  );
}
