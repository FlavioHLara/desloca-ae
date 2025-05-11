document.addEventListener("DOMContentLoaded", () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                const mapa = L.map("mapa").setView([lat, lon], 13);

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: '&copy; OpenStreetMap contributors',
                }).addTo(mapa);

                L.marker([lat, lon])
                    .addTo(mapa)
                    .bindPopup("Você está aqui!")
                    .openPopup();
            },
            (err) => {
                alert("Não foi possível obter sua localização.");
            }
        );
    } else {
        alert("Geolocalização não suportada neste navegador.");
    }
});