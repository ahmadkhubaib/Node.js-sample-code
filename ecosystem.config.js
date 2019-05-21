module.exports = {
  apps: [{
    name: 'API',
    script: './index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 2 || process.env.WEB_CONCURRENCY,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
		NODE_ENV: process.env.NODE_ENV,
		PORT: process.env.PORT,
		HOSTNAME: process.env.HOSTNAME,
		ATHENIUM_URI: process.env.ATHENIUM_URI,
		ZOHO_UNAME: process.env.ZOHO_UNAME,
		ZOHO_PASSWORD: process.env.ZOHO_PASSWORD,
		PASSPORT_SECRET: process.env.PASSPORT_SECRET,
		REDIS_URL: process.env.REDIS_URL,
		AWS_REGION: process.env.AWS_REGION,
		AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
		AWS_ACCESS_SECRET: process.env.AWS_ACCESS_SECRET,
		AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    },
  }],

  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
