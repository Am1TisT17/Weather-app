document.getElementById('get-weather').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value;
    if (!city) return alert('Please enter a city.');

    try {
        const weatherResponse = await fetch(`/api/weather?city=${city}`);
        if (!weatherResponse.ok) throw new Error('Failed to fetch weather data');
        const weatherData = await weatherResponse.json();

        document.getElementById('weather-info').innerHTML = `
            <h2>Weather in ${weatherData.name}</h2>
            <p>Temperature: ${weatherData.main.temp}°C</p>
            <p>Feels Like: ${weatherData.main.feels_like}°C</p>
            <p>Description: ${weatherData.weather[0].description}</p>
            <p>Humidity: ${weatherData.main.humidity}%</p>
            <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
        `;
        const newsResponse = await fetch(`/api/news?city=${city}`);
        if (newsResponse.status === 404) {
            document.getElementById('news-info').innerHTML = '<p>No news available for this city.</p>';
        } else if (!newsResponse.ok) {
            throw new Error('Failed to fetch news data');
        } else {
            const newsData = await newsResponse.json();
            document.getElementById('news-info').innerHTML = `
                <h3>News</h3>
                <ul>${newsData.slice(0, 5).map(article => `<li>${article.title}</li>`).join('')}</ul>
            `;
        }

        const triviaResponse = await fetch('/api/trivia');
        if (!triviaResponse.ok) throw new Error('Failed to fetch trivia');
        const triviaData = await triviaResponse.json();

        document.getElementById('trivia-info').innerHTML = `
            <h3>Trivia</h3>
            <p>${triviaData.text}</p>
        `;
        const { lon, lat } = weatherData.coord;
        initMap(lat, lon, city);

    } catch (error) {
        console.error('Error:', error.message);
        alert('Failed to fetch data. Please try again.');
    }
});

function initMap(lat, lon, city) {
    document.getElementById('map').style.display = 'block'; 

    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat, lng: lon },
        zoom: 12,
    });

    new google.maps.Marker({
        position: { lat, lng: lon },
        map,
        title: city,
    });
}
