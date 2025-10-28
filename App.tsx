import { useState } from "react";

interface WeatherData {
  city: string;
  temperature: number;
  windspeed: number;
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name!");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found. Try another name!");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: `${name}, ${country}`,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
      });
    } catch {
      setError("Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
        fontFamily: "Poppins, sans-serif",
        color: "#333",
        textAlign: "center",
        overflow: "hidden",
        padding: "1rem",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "1.5rem",
          color: "#fff",
          textShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        🌤️ Weather App
      </h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={city}
          placeholder="Enter city name"
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "220px",
            fontSize: "1rem",
            outline: "none",
          }}
        />
        <button
          onClick={fetchWeather}
          style={{
            padding: "0.6rem 1.2rem",
            marginLeft: "8px",
            border: "none",
            borderRadius: "8px",
            background: "#4a6cf7",
            color: "white",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#3558e6")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#4a6cf7")}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <p style={{ color: "#ffdddd", fontWeight: 500 }}>{error}</p>}

      {weather && (
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            padding: "1.5rem 2rem",
            borderRadius: "15px",
            display: "inline-block",
            marginTop: "1.5rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
            animation: "fadeIn 0.6s ease",
          }}
        >
          <h2 style={{ fontSize: "1.6rem", color: "#333" }}>{weather.city}</h2>
          <p style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
            🌡️ <strong>{weather.temperature}°C</strong>
          </p>
          <p style={{ fontSize: "1.2rem" }}>
            💨 Wind Speed: <strong>{weather.windspeed} km/h</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
