const axios = require('axios');
const dns = require('dns').promises;

const GOOGLE_PING_URL = "https://ep1.adtrafficquality.google/getconfig/sodar";
const SAINSFES_DOMAIN = "sainsfes.com";
const SAINSFES_PROTOCOL = "https";

let cachedIP = null;

// 🔎 Resolve domain → IP (non-fatal)
async function resolveDomainIP() {
    try {
        const res = await dns.lookup(SAINSFES_DOMAIN);
        cachedIP = res.address;
        console.log(`🌐 SAINSFES IP: ${cachedIP}`);
    } catch (err) {
        console.warn(`⚠️ Gagal resolve IP ${SAINSFES_DOMAIN}: ${err.message}`);
        cachedIP = null;
    }
}

// 📡 Ping Google (SELALU JALAN)
async function pingGoogle() {
    const start = Date.now();
    try {
        const res = await axios.get(GOOGLE_PING_URL, {
            params: {
                sv: 200,
                tid: "gda",
                tv: "r20251211",
                st: "env",
                sjk: "7497552165096490"
            },
            timeout: 5000
        });

        console.log(`✅ GOOGLE | ${res.status} | ${Date.now() - start} ms`);
    } catch (err) {
        console.error(`❌ GOOGLE FAIL | ${err.message}`);
    }
}

// 📡 Ping sainsfes (jalan hanya jika IP ada)
async function pingSainsfes() {
    if (!cachedIP) {
        console.warn("⚠️ SAINSFES dilewati (IP belum tersedia)");
        return;
    }

    const start = Date.now();
    try {
        const res = await axios.get(`${SAINSFES_PROTOCOL}://${cachedIP}`, {
            headers: {
                "Host": SAINSFES_DOMAIN,
                "User-Agent": "Mozilla/5.0"
            },
            timeout: 5000
        });

        console.log(
            `✅ SAINSFES (${cachedIP}) | ${res.status} | ${Date.now() - start} ms`
        );
    } catch (err) {
        console.error(
            `❌ SAINSFES FAIL (${cachedIP}) | ${err.message}`
        );
    }
}

// ▶ Start ping loop (TIDAK PERNAH BATAL)
function startPing(interval = 2000) {

    // resolve IP pertama kali (async, non-blocking)
    resolveDomainIP();

    // refresh IP tiap 1 menit (optional tapi aman)
    setInterval(resolveDomainIP, 60_000);

    async function runPing() {
        await pingGoogle();
        await pingSainsfes();
    }

    runPing();
    const intervalId = setInterval(runPing, interval);
    return intervalId;
}

// 🛑 Stop ping
function stopPing(intervalId) {
    if (intervalId) {
        clearInterval(intervalId);
        console.log("🛑 Ping dihentikan");
    }
}

module.exports = {
    startPing,
    stopPing
};
