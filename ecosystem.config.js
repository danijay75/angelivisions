module.exports = {
    apps: [
        {
            name: "angelivisions",
            script: "npm",
            args: "start",
            cwd: "/var/www/angelivisions",
            env: {
                NODE_ENV: "production",
            },
            instances: 1, // Only 1 instance
            autorestart: true, // Auto restart if crash
            watch: false,
            max_memory_restart: "1G", // Restart if uses more than 1GB RAM
        },
    ],
};
