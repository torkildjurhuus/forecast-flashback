import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const API_URL = 'https://api.open-meteo.com/v1/forecast';
const LATITUDE = 61.9828;
const LONGITUDE = -6.8829;
const HOURLY_PARAMS = 'temperature_2m,rain,showers,snowfall';

interface ForecastData {
    timestamp: number;
    temperature_2m: number;
    rain?: { value: number };
    showers?: { value: number };
    snowfall?: { value: number };
}

const WeatherForecast: React.FC = () => {
    const [forecastData, setForecastData] = useState<ForecastData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWeatherForecast();
    }, []);

    const fetchWeatherForecast = async () => {
        try {
            const response = await axios.get(`${API_URL}?latitude=${LATITUDE}&longitude=${LONGITUDE}&hourly=${HOURLY_PARAMS}`);
            const forecastArray: ForecastData[] = Object.values(response.data.hourly);
            setForecastData(forecastArray);
            setLoading(false);
        } catch (error) {
            setError('Error fetching weather data');
            setLoading(false);
        }
    };

    const chartOptions = {
        title: {
            text: 'Weather Forecast',
        },
        xAxis: {
            type: 'datetime',
        },
        yAxis: [
            {
                title: {
                    text: 'Temperature (°C)',
                },
            },
            {
                title: {
                    text: 'Precipitation (mm)',
                },
                opposite: true,
            },
        ],
        series: [
            {
                name: 'Temperature',
                type: 'line',
                data: forecastData.map((data) => [data.timestamp * 1000, data.temperature_2m]),
                yAxis: 0,
            },
            {
                name: 'Rain',
                type: 'column',
                data: forecastData.map((data) => [data.timestamp * 1000, data.rain?.value || 0]),
                yAxis: 1,
            },
            {
                name: 'Showers',
                type: 'column',
                data: forecastData.map((data) => [data.timestamp * 1000, data.showers?.value || 0]),
                yAxis: 1,
            },
            {
                name: 'Snowfall',
                type: 'column',
                data: forecastData.map((data) => [data.timestamp * 1000, data.snowfall?.value || 0]),
                yAxis: 1,
            },
        ],
    };

    return (
        <div>
            <h2>Weather Forecast</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            )}
        </div>
    );
};

export default WeatherForecast;
