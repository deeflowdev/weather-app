from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("WEATHER_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "server is running"


@app.route("/weather")
def get_weather():
    city = request.args.get("city")

    if not city:
        return jsonify({"error": "City is required"}), 400

    geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}"
    geo_res = requests.get(geo_url).json()

    if not geo_res:
        return jsonify({"error": f"No results found for '{city}'"})

    returned_name = geo_res[0].get("name", "").lower()
    if returned_name != city.lower():
        return jsonify({"error": f"No exact match for '{city}'"})

    lat = geo_res[0]["lat"]
    lon = geo_res[0]["lon"]

    weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    weather_res = requests.get(weather_url).json()

    return jsonify(weather_res)


if __name__ == "__main__":
    app.run(debug=True)