/**
 * Utility to highlight suspicious keywords in text
 * Used for visual highlighting of potential phishing indicators
 */

const SUSPICIOUS_KEYWORDS = [
  "urgent",
  "verify",
  "password",
  "bank",
  "click",
  "account",
  "update",
  "login",
  "confirm",
  "authorize",
  "act now",
  "immediately",
  "limited time",
  "expire",
  "suspended",
  "locked",
  "secure",
  "confirm identity",
  "validate",
  "authenticate",
  "re-enter",
  "restore",
  "activate",
  "click here",
  "download",
  "attachment",
];

/**
 * Highlight suspicious keywords in text
 * Returns an array of React elements with highlighted keywords
 * 
 * @param {string} text - Original text to highlight
 * @returns {JSX.Element[]} Array of text and span elements
 */
export function highlightSuspiciousKeywords(text) {
  if (!text || typeof text !== 'string') return [text];

  // Create regex pattern for all suspicious keywords (case-insensitive, word boundaries)
  const pattern = new RegExp(
    `\\b(${SUSPICIOUS_KEYWORDS.join('|')})\\b`,
    'gi'
  );

  const parts = [];
  let lastIndex = 0;
  let match;

  // Find all matches
  while ((match = pattern.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add highlighted match
    parts.push(
      <span
        key={`highlight-${match.index}`}
        className="suspicious-keyword-highlight"
        title="Potential risk keyword"
        style={{
          backgroundColor: '#ff6b6b',
          color: '#ffffff',
          padding: '2px 6px',
          borderRadius: '4px',
          fontWeight: '600',
          cursor: 'help',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#ff5252';
          e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 107, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#ff6b6b';
          e.target.style.boxShadow = 'none';
        }}
      >
        {match[0]}
      </span>
    );

    lastIndex = pattern.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * Get list of suspicious keywords found in text
 * @param {string} text - Text to search
 * @returns {string[]} Array of found keywords (lowercase, unique)
 */
export function getSuspiciousKeywordsFound(text) {
  if (!text || typeof text !== 'string') return [];

  const pattern = new RegExp(
    `\\b(${SUSPICIOUS_KEYWORDS.join('|')})\\b`,
    'gi'
  );

  const found = new Set();
  let match;

  while ((match = pattern.exec(text)) !== null) {
    found.add(match[0].toLowerCase());
  }

  return Array.from(found).sort();
}

/**
 * Count suspicious keywords in text
 * @param {string} text - Text to search
 * @returns {number} Number of suspicious keywords found
 */
export function countSuspiciousKeywords(text) {
  if (!text || typeof text !== 'string') return 0;

  const pattern = new RegExp(
    `\\b(${SUSPICIOUS_KEYWORDS.join('|')})\\b`,
    'gi'
  );

  let count = 0;
  while (pattern.exec(text) !== null) {
    count++;
  }

  return count;
}

const keywordHighlighterUtils = {
  highlightSuspiciousKeywords,
  getSuspiciousKeywordsFound,
  countSuspiciousKeywords,
  SUSPICIOUS_KEYWORDS,
};

export default keywordHighlighterUtils;
