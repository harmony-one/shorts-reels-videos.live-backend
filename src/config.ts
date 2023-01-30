import * as process from 'process';

export default () => ({
  client: {
    url: process.env.CLIENT_URL || '',
  },
  mux: {
    sighingKey: process.env.MUX_SIGNING_KEY,
    privateKey: process.env.MUX_PRIVATE_KEY,
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
  },
  web3: {
    url: process.env.RPC_URL || 'https://api.s0.t.hmny.io',
    subscriptionsContractAddress: process.env.SUBSCRIPTIONS_CONTRACT_ADDRESS ||
      '0xaef596d26be185d1c25c0aadfab6ab054e7c011f',
    oneCountryContractAddress:
      process.env.ONE_COUNTRY_CONTRACT_ADDRESS ||
      '0xaef596d26be185d1c25c0aadfab6ab054e7c011f',
  },
  paymentService: {
    url: 'https://stripe-payments-backend.fly.dev'
  },
  version: process.env.npm_package_version || '0.0.1',
  name: process.env.npm_package_name || '',
  port: parseInt(process.env.PORT, 10) || 8080,
});