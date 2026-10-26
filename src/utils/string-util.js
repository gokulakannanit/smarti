export class StringUtils {
  static capitalizeSentence(sentence) {
    return sentence
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  static kebabToPascal(str) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
  static sanitizeString(str) {
    if (typeof str !== 'string') return '';
    // Replaces dangerous HTML characters with safe encoded entities
    return str.replace(/[&<>"']/g, function(match) {
        const escapeChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        };
        return escapeChars[match];
    });
}
}