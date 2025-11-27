module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow hardcoded credentials' },
    messages: { noHardcodedCredential: 'Avoid hardcoded credentials. Use environment variables.' },
  },
  create(context) {
    const sensitivePatterns = [/api[_-]?key/i, /secret[_-]?key/i, /password/i, /\bauth[_-]?token\b/i, /\bsession[_-]?token\b/i, /\baccess[_-]?token\b/i];
    return {
      Literal(node) {
        if (typeof node.value !== 'string' || node.value.length < 8) return;
        const parent = node.parent;
        if (parent.type === 'Property' || parent.type === 'VariableDeclarator') {
          const name = parent.key?.name || parent.id?.name;
          if (name && sensitivePatterns.some((p) => p.test(name))) {
            context.report({ node, messageId: 'noHardcodedCredential' });
          }
        }
      },
    };
  },
};
