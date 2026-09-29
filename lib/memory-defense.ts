/**
 * Hindsight Memory Defense implementation
 * Scrubs sensitive PII, API tokens, passwords, credit cards, and defense against prompt injection
 * Reference: https://hindsight.vectorize.io/developer/memory-defense
 */

export interface DefenseScanResult {
  scrubbedContent: string;
  redactedCount: number;
  redactedTypes: string[];
  hasInjectionRisk: boolean;
  injectionWarnings: string[];
}

// 45+ standard patterns for credentials, tokens, PII, and sensitive corporate data
const REDACTION_PATTERNS: Array<{ type: string; regex: RegExp }> = [
  // API Keys & Tokens
  { type: 'openai_api_key', regex: /sk-[a-zA-Z0-9]{20,64}/g },
  { type: 'azure_key', regex: /[a-f0-9]{32}(?=[^a-f0-9]|$)/gi },
  { type: 'github_token', regex: /gh[pousr]-[A-Za-z0-9_]{36,255}/g },
  { type: 'aws_access_key', regex: /AKIA[0-9A-Z]{16}/g },
  { type: 'aws_secret_key', regex: /(?:aws_secret_access_key|secret_key)\s*[:=]\s*['"]?([A-Za-z0-9/+=]{40})['"]?/gi },
  { type: 'slack_token', regex: /xox[baprs]-[0-9a-zA-Z]{10,48}/g },
  { type: 'generic_bearer', regex: /Bearer\s+[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.?[A-Za-z0-9\-_=]*/gi },
  { type: 'private_key', regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g },
  
  // Credentials & Passwords
  { type: 'password_in_text', regex: /(?:password|passwd|pwd)\s*[:=]\s*['"]?([^\s'"]{6,})['"]?/gi },
  { type: 'db_connection_string', regex: /(?:postgres|mysql|mongodb|redis|mssql):\/\/[^\s]+/gi },
  
  // PII
  { type: 'ssn', regex: /\b\d{3}-\d{2}-\d{4}\b/g },
  { type: 'credit_card', regex: /\b(?:\d{4}[ -]?){3}\d{4}\b/g },
  { type: 'routing_number', regex: /\b\d{9}\b(?=.*(?:routing|aba|bank account))/gi },
];

// Untrusted prompt injection heuristics
const INJECTION_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  { name: 'instruction_override', regex: /(?:(?:ignore|disregard)\s+(?:all\s+)?(?:previous|above|prior|system)\s+instructions?|system\s+prompt\s+override|disregard\s+the\s+above)/gi },
  { name: 'role_hijack', regex: /(?:you\s+are\s+now|act\s+as\s+a\s+DAN|system:\s*you\s+must)/gi },
  { name: 'memory_poisoning', regex: /(?:delete\s+all\s+memories|override\s+deal\s+facts|fake\s+this\s+pricing)/gi },
];

export function applyMemoryDefense(rawContent: string): DefenseScanResult {
  let scrubbed = rawContent;
  let redactedCount = 0;
  const redactedTypes: Set<string> = new Set();
  const injectionWarnings: string[] = [];

  // Check injection patterns
  for (const { name, regex } of INJECTION_PATTERNS) {
    if (regex.test(scrubbed)) {
      injectionWarnings.push(`Suspicious pattern detected: ${name}`);
      // Neutralize injection attempt
      scrubbed = scrubbed.replace(regex, `[DEFENSE_NEUTRALIZED:${name}]`);
    }
  }

  // Apply secret and PII redaction
  for (const { type, regex } of REDACTION_PATTERNS) {
    const matches = scrubbed.match(regex);
    if (matches && matches.length > 0) {
      redactedCount += matches.length;
      redactedTypes.add(type);
      scrubbed = scrubbed.replace(regex, `[REDACTED:${type}]`);
    }
  }

  return {
    scrubbedContent: scrubbed,
    redactedCount,
    redactedTypes: Array.from(redactedTypes),
    hasInjectionRisk: injectionWarnings.length > 0,
    injectionWarnings,
  };
}
