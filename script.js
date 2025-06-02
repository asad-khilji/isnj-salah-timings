document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD"

  fetch('salah-timings.json')
    .then(response => response.json())
    .then(data => {
      const todayData = data.find(entry => entry.date === formattedDate);

      if (todayData) {
        // Display Gregorian and Hijri Dates
        document.getElementById('gregorianDate').textContent = `Gregorian: ${todayData.date}`;
        document.getElementById('hijriDate').textContent = `Hijri: ${todayData.hijri}`;

        // Salah times
        document.getElementById('fajrTime').textContent = todayData.fajr;
        document.getElementById('iqamahFajr').textContent = todayData.iqamah_fajr;

        document.getElementById('dhuhrTime').textContent = todayData.dhuhr;
        document.getElementById('iqamahDhuhr').textContent = todayData.iqamah_dhuhr;

        document.getElementById('asrTime').textContent = todayData.asr;
        document.getElementById('iqamahAsr').textContent = todayData.iqamah_asr;

        document.getElementById('maghribTime').textContent = todayData.maghrib;
        // Maghrib Iqama = 5 mins after azan (if not in JSON)
        if (todayData.iqamah_maghrib) {
          document.getElementById('iqamahMaghrib').textContent = todayData.iqamah_maghrib;
        } else {
          const [h, m] = todayData.maghrib.split(':').map(Number);
          const maghribAzan = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m);
          const maghribIqama = new Date(maghribAzan.getTime() + 5 * 60000);
          const formatted = maghribIqama.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          document.getElementById('iqamahMaghrib').textContent = formatted;
        }

        document.getElementById('ishaTime').textContent = todayData.isha;
        document.getElementById('iqamahIsha').textContent = todayData.iqamah_isha;
      } else {
        console.error('Today’s data not found');
      }
    })
    .catch(error => {
      console.error('Error fetching prayer times:', error);
    });
});
