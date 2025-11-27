module.exports = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Enforce use of project exception classes' },
    messages: { useException: 'Use exception classes instead of throwing raw objects' },
  },
  create(context) {
    return {
      ThrowStatement(node) {
        if (node.argument.type === 'ObjectExpression') {
          const properties = node.argument.properties.map((p) => p.key?.name);
          if (properties.includes('status') && properties.includes('error')) {
            context.report({ node, messageId: 'useException' });
          }
        }
      },
    };
  },
};
