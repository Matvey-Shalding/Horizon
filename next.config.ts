const path = require('path');

const nextConfig = {
  output: 'export',
  webpack(config: any) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
};

module.exports = nextConfig;
