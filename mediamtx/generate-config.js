const fs = require("fs");
const path = require("path");

// Cargar .env si existe
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...valueParts] = trimmed.split("=");
    if (key) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  });
}

// Cargar .env.local si existe (sobreescribe .env)
const envLocalPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...valueParts] = trimmed.split("=");
    if (key) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  });
}

/**
 * Configuración del DVR
 * Estos valores se pueden sobreescribir con variables de entorno
 */
const DVR_CONFIG = {
  IP: process.env.DVR_IP || "192.168.20.181",
  RTSP_PORT: process.env.DVR_RTSP_PORT || "554",
  USER: process.env.DVR_USER || "admin",
  PASSWORD: process.env.DVR_PASSWORD || "Marcelo2022",
};

/**
 * Genera la configuración de mediamtx
 */
function generateConfig() {
  const templatePath = path.join(__dirname, "mediamtx.template.yml");
  const outputPath = path.join(__dirname, "mediamtx.yml");

  if (!fs.existsSync(templatePath)) {
    console.error("Error: No se encontró el archivo de plantilla mediamtx.template.yml");
    process.exit(1);
  }

  console.log("=".repeat(50));
  console.log("  Generando configuración MediaMTX");
  console.log("=".repeat(50));
  console.log(`  DVR IP:        ${DVR_CONFIG.IP}`);
  console.log(`  Puerto RTSP:   ${DVR_CONFIG.RTSP_PORT}`);
  console.log(`  Usuario:       ${DVR_CONFIG.USER}`);
  console.log(`  Contraseña:    ${"*".repeat(DVR_CONFIG.PASSWORD.length)}`);
  console.log("=".repeat(50));

  // Leer la plantilla
  let config = fs.readFileSync(templatePath, "utf8");

  // Reemplazar los placeholders
  config = config.replace(/\{\{DVR_IP\}\}/g, DVR_CONFIG.IP);
  config = config.replace(/\{\{RTSP_PORT\}\}/g, DVR_CONFIG.RTSP_PORT);
  config = config.replace(/\{\{DVR_USER\}\}/g, DVR_CONFIG.USER);
  config = config.replace(/\{\{DVR_PASSWORD\}\}/g, DVR_CONFIG.PASSWORD);

  // Escribir el archivo final
  fs.writeFileSync(outputPath, config);

  console.log("");
  console.log("✓ Configuración generada exitosamente en mediamtx.yml");
  console.log("  - 8 cámaras configuradas (canales 1-8)");
  console.log("  - HLS en puerto 8888");
  console.log("  - RTSP en puerto 8554");
  console.log("  - WebRTC en puerto 8889");
  console.log("");
  console.log("URL RTSP de prueba:");
  console.log(`  rtsp://${DVR_CONFIG.USER}:****@${DVR_CONFIG.IP}:${DVR_CONFIG.RTSP_PORT}/Streaming/Channels/101`);
  console.log("");
}

generateConfig();
