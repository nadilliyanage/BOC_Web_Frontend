// Constants for SMS limits
export const SMS_LIMITS = {
  MAX_TOTAL_CHARS: 1950,
  MAX_SEGMENT_CHARS: 160,
  MAX_SEGMENT_CHARS_WITH_EMOJI: 70,
};

// Function to check if text contains emojis
export const hasEmoji = (text) => {
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E6}-\u{1F1FF}]/u;
  return emojiRegex.test(text);
};

// Function to calculate number of segments needed
export const calculateSegments = (text) => {
  const maxCharsPerSegment = hasEmoji(text)
    ? SMS_LIMITS.MAX_SEGMENT_CHARS_WITH_EMOJI
    : SMS_LIMITS.MAX_SEGMENT_CHARS;
  return Math.ceil(text.length / maxCharsPerSegment);
};

// Function to validate SMS length
export const validateSMSLength = (text) => {
  if (text.length > SMS_LIMITS.MAX_TOTAL_CHARS) {
    return {
      isValid: false,
      message: "1950(0)",
    };
  }

  const segments = calculateSegments(text);
  const maxCharsPerSegment = hasEmoji(text)
    ? SMS_LIMITS.MAX_SEGMENT_CHARS_WITH_EMOJI
    : SMS_LIMITS.MAX_SEGMENT_CHARS;
  const remainingChars =
    maxCharsPerSegment - (text.length % maxCharsPerSegment);

  return {
    isValid: true,
    message:
      segments > 1 ? `${remainingChars}(${segments})` : `${remainingChars}`,
    segments,
    remainingChars,
  };
};

// Function to split message into segments
export const splitIntoSegments = (text) => {
  const maxCharsPerSegment = hasEmoji(text)
    ? SMS_LIMITS.MAX_SEGMENT_CHARS_WITH_EMOJI
    : SMS_LIMITS.MAX_SEGMENT_CHARS;
  const segments = [];

  for (let i = 0; i < text.length; i += maxCharsPerSegment) {
    segments.push(text.slice(i, i + maxCharsPerSegment));
  }

  return segments;
};
