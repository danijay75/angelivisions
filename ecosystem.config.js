module.exports = {
    apps: [
        {
            name: "angelivisions",
            script: "node_modules/.bin/next",
            args: "start",
            // On lance toujours la release pointée par le lien `current`.
            // Le déploiement ne fait que changer ce lien, puis `pm2 reload`.
            cwd: "/var/www/angelivisions/current",
            env: {
                NODE_ENV: "production",
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
        },
    ],
};
