document.addEventListener("DOMContentLoaded", function() {
  // Get the current date
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentDay = today.getDate();

  // Fetch the prayer times from the JSON file
  fetch('salah-timings.json')
    .then(response => response.json())
    .then(data => {
      // Access the current month's data dynamically
      const monthData = data[`${currentMonth} ${today.getFullYear()}`];

      if (monthData && monthData[currentDay]) {
        const todayTimes = monthData[currentDay];

        // Populate the HTML with the times for today
        document.getElementById('gregorianDate').textContent = `${currentMonth} ${currentDay}, ${today.getFullYear()}`;
        document.getElementById('fajrTime').textContent = todayTimes.Fajr;
        document.getElementById('sunriseTime').textContent = todayTimes.Sunrise;
        document.getElementById('zuhrTime').textContent = todayTimes.Dhuhr;
        document.getElementById('asrTime').textContent = todayTimes.Asr;
        document.getElementById('maghrebTime').textContent = todayTimes.Maghrib;
        document.getElementById('ishaTime').textContent = todayTimes.Isha;

        // Calculate Sunrise Iqama time (10 minutes after Sunrise Azan)
        const sunriseAzanTime = todayTimes.Sunrise.trim();
        const [sunriseHours, sunriseMinutes] = sunriseAzanTime.split(':').map(Number);

        if (!isNaN(sunriseHours) && !isNaN(sunriseMinutes)) {
          const sunriseAzan = new Date(today.getFullYear(), today.getMonth(), today.getDate(), sunriseHours, sunriseMinutes);
          const sunriseIqama = new Date(sunriseAzan.getTime() + 10 * 60000); // Add 10 minutes

          const iqamaSunriseHours = sunriseIqama.getHours();
          const iqamaSunriseMinutes = sunriseIqama.getMinutes().toString().padStart(2, '0');
          const sunrisePeriod = iqamaSunriseHours >= 12 ? 'P.M.' : 'A.M.';
          const formattedSunriseHours = ((iqamaSunriseHours + 11) % 12 + 1); // Convert to 12-hour format

          document.querySelector('tr:nth-child(3) td:nth-child(3)').textContent = `${formattedSunriseHours}:${iqamaSunriseMinutes} ${sunrisePeriod}`;
        } else {
          console.error(`Invalid Sunrise time format: ${sunriseAzanTime}`);
        }

        // Calculate Maghrib Iqama time (5 minutes after Maghrib Azan)
        const maghribAzanTime = todayTimes.Maghrib.trim();
        const [maghribHours, maghribMinutes] = maghribAzanTime.split(':').map(Number);

        if (!isNaN(maghribHours) && !isNaN(maghribMinutes)) {
          const maghribAzan = new Date(today.getFullYear(), today.getMonth(), today.getDate(), maghribHours, maghribMinutes);
          const maghribIqama = new Date(maghribAzan.getTime() + 5 * 60000); // Add 5 minutes

          const iqamaMaghribHours = maghribIqama.getHours();
          const iqamaMaghribMinutes = maghribIqama.getMinutes().toString().padStart(2, '0');
          const maghribPeriod = iqamaMaghribHours >= 12 ? 'P.M.' : 'A.M.';
          const formattedMaghribHours = ((iqamaMaghribHours + 11) % 12 + 1); // Convert to 12-hour format

          document.querySelector('tr:nth-child(6) td:nth-child(3)').textContent = `${formattedMaghribHours}:${iqamaMaghribMinutes} ${maghribPeriod}`;
        } else {
          console.error(`Invalid Maghrib time format: ${maghribAzanTime}`);
        }
      } else {
        console.error('Prayer times for today are not available.');
      }
    })
    .catch(error => console.error('Error fetching prayer times:', error));
});
