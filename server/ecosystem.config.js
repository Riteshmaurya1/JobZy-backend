module.exports = {
  apps: [
    {
      name: 'jobzy-backend',
      script: './server.js', 
      
      // ✅ CLUSTER MODE (use all CPU cores)
      instances: 'max', // or specify number: 2, 4, etc.
      exec_mode: 'cluster',
      
      // ✅ ENVIRONMENT
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      
      // ✅ LOGGING
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // ✅ RESTART CONFIGURATION
      max_memory_restart: '500M', // Restart if memory exceeds 500MB
      max_restarts: 10,           // Max restarts within 1 minute
      min_uptime: '10s',          // Min uptime before considered stable
      
      // ✅ AUTO-RESTART ON FILE CHANGES (development only)
      watch: false,
      
      // ✅ GRACEFUL SHUTDOWN
      kill_timeout: 5000, // Wait 5s for graceful shutdown
      wait_ready: true,
      listen_timeout: 10000,
      
      // ✅ CRON RESTART (optional - restart daily at 4 AM)
      cron_restart: '0 4 * * *',
      
      // ✅ AUTORESTART
      autorestart: true,
    },
    // ✅ SEPARATE WORKER FOR CRON JOBS
    {
      name: 'jobzy-cron-worker',
      script: './src/cron/emailReminders.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/cron-error.log',
      out_file: './logs/cron-out.log',
      max_memory_restart: '200M',
      autorestart: true,
    },
  ],
};
