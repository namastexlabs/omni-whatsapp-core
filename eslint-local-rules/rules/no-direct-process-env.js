module.exports = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow direct process.env access outside env.config.ts' },
    messages: { useConfigService: 'Use ConfigService instead of direct process.env access' },
  },
  create(context) {
    const allowedFiles = ['env.config.ts', 'instrumentSentry.ts'];
    return {
      MemberExpression(node) {
        if (
          node.object.type === 'MemberExpression' &&
          node.object.object.name === 'process' &&
          node.object.property.name === 'env'
        ) {
          if (allowedFiles.some((f) => context.getFilename().endsWith(f))) return;
          context.report({ node, messageId: 'useConfigService' });
        }
      },
    };
  },
};
