export default {
  apps: [
    {
      name: "bank-transfer-server",
      script: "src/index.js",
      instances: 1,
      exec_mode: "fork",
      env: { NODE_ENV: "production" }
    }
  ]
};

