const axios = require('axios');

const PING_URL = "https://ep1.adtrafficquality.google/getconfig/sodar";

function startPing(interval = 2000) {
    async function pingWeb() {
        const start = Date.now();

        try {
            const response = await axios.get(PING_URL, {
                params: {
                    sv: 200,
                    tid: "gda",
                    tv: "r20251211",
                    st: "env",
                    sjk: "7497552165096490"
                },
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    "Accept": "*/*",
                    "Referer": "https://www.google.com"
                },
                timeout: 5000
            });

            const latency = Date.now() - start;
            console.log(
                `✅ PING OK | ${response.status} | ${latency} ms | ${new Date().toLocaleTimeString()}`
            );

        } catch (error) {
            console.error(
                `❌ PING FAIL | ${error.message} | ${new Date().toLocaleTimeString()}`
            );
        }
    }

    // ping pertama langsung
    pingWeb();

    // ping berulang
    const intervalId = setInterval(pingWeb, interval);

    return intervalId; // supaya bisa di-stop dari file utama
}

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
