import { AUTH_CREDENTIALS, isPasswordFormatValid, PASSWORD_RULES } from '../constants/auth';

export { AUTH_CREDENTIALS, PASSWORD_RULES, isPasswordFormatValid };

export function validatePassword(password: string): string | null {
  const failedRule = PASSWORD_RULES.find((rule) => !rule.test(password));
  if (failedRule) {
    return `Password belum memenuhi: ${failedRule.label}.`;
  }
  return null;
}

export function validateNim(username: string): string | null {
  if (username.trim() !== AUTH_CREDENTIALS.username) {
    return `Username harus NIM ${AUTH_CREDENTIALS.username}.`;
  }
  return null;
}
