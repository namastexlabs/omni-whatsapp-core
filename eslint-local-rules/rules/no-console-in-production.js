module.exports = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow console.* in favor of Logger class' },
    messages: { useLogger: 'Use Logger class from @config/logger.config instead of console.{{method}}()' },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'console' &&
          ['log', 'error', 'warn', 'info', 'debug'].includes(node.callee.property.name)
        ) {
          if (context.getFilename().endsWith('logger.config.ts')) return;
          context.report({ node, messageId: 'useLogger', data: { method: node.callee.property.name } });
        }
      },
    };
  },
};
