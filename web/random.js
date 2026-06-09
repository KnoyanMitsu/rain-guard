const WebSocket = require('ws');

// Alamat server WebSocket Anda (Ganti jika berbeda)
const url = 'ws://4.145.113.15:1880/ws/iot';
const ws = new WebSocket(url);

// Fungsi untuk menghasilkan angka acak dalam rentang tertentu
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

ws.on('open', () => {
    // Looping pengiriman data

    // Looping pengiriman data
    setInterval(() => {
        // 1. Simulasi sensor: Jarak acak dari sensor ke air (misal 5cm - 20cm)
        const rawDistance = getRandom(5, 20);

        // 2. Logika perhitungan Anda: 25 - distance
        const actualAirValue =  rawDistance;

        // 3. Susun JSON sesuai format yang Anda minta
        const payload = {
            distance: parseFloat(actualAirValue.toFixed(2)), // Angka distance diganti ke actualAir
            rain: Math.floor(getRandom(1000, 4095)),        // Simulasi nilai sensor hujan
            buzzer: actualAirValue > 15 ? "Aktif" : "Non Aktif",
            status_rain: Math.random() > 0.5 ? "Hujan" : "Tidak",
            timestamp: Date.now()
        };

        // 4. Kirim data
        ws.send(JSON.stringify(payload));
    }, 5000); // 5000ms = 5 detik
});

ws.on('error', (err) => {
    const errStr = String(err.message).replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "***.***.***.***");
    console.error("Koneksi Error:", errStr);
});

ws.on('close', () => {
});