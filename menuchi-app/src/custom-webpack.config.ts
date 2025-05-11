import { Configuration, DefinePlugin } from 'webpack';

const Dotenv = require('dotenv-webpack');
module.exports = {
  plugins: [new Dotenv()],
};

const config: Configuration = {
  plugins: [
    new DefinePlugin({
      'process.env.API_URL': JSON.stringify(
        process.env['API_URL'] || 'http://default-api.local',
      ),
    }),
  ],
};

export default config;
