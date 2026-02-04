module.exports = {
    apps: [
        {
            name: 'sierra-dorada-api',
            script: './server/index.js',
            cwd: '/home/pi/sierra-dorada',
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            watch: false,
            max_memory_restart: '150M',
            env_production: {
                NODE_ENV: 'production',
                PORT: 3003
            },
            error_file: '/home/pi/logs/sierra-api-error.log',
            out_file: '/home/pi/logs/sierra-api-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            merge_logs: true
        }
    ]
};
