// Weather service for location-based recommendations
export interface WeatherData {
  location: string;
  temperature: number; // Celsius
  condition: string;
  humidity: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface SeasonalRecommendation {
  season: string;
  temperature_range: string;
  clothing_weight: 'light' | 'medium' | 'heavy' | 'layered';
  fabric_suggestions: string[];
  style_notes: string;
}

// Get current season based on hemisphere and month
function getCurrentSeason(latitude: number): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = new Date().getMonth(); // 0-11
  const isNorthern = latitude >= 0;

  if (isNorthern) {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  } else {
    if (month >= 2 && month <= 4) return 'autumn';
    if (month >= 5 && month <= 7) return 'winter';
    if (month >= 8 && month <= 10) return 'spring';
    return 'summer';
  }
}

// OpenWeather API integration
export async function getWeatherForLocation(location: string): Promise<WeatherData | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  // If no API key, use intelligent defaults based on location string
  if (!apiKey) {
    return getDefaultWeather(location);
  }

  try {
    // First, geocode the location
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      return getDefaultWeather(location);
    }

    const { lat, lon } = geoData[0];

    // Get weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    return {
      location,
      temperature: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main,
      humidity: weatherData.main.humidity,
      season: getCurrentSeason(lat),
    };
  } catch (error) {
    console.error('[Weather] API error:', error);
    return getDefaultWeather(location);
  }
}

// Smart defaults based on location keywords
function getDefaultWeather(location: string): WeatherData {
  const loc = (location || '').toLowerCase();
  const month = new Date().getMonth();

  // Determine climate zone
  let baseTemp = 20;
  let condition = 'Clear';
  let latitude = 40; // Default northern hemisphere

  // Hot climates
  if (loc.includes('miami') || loc.includes('florida') || loc.includes('texas') ||
      loc.includes('arizona') || loc.includes('dubai') || loc.includes('singapore') ||
      loc.includes('mumbai') || loc.includes('bangkok') || loc.includes('hawaii')) {
    baseTemp = 30;
    condition = 'Sunny';
    latitude = 25;
  }
  // Cold climates
  else if (loc.includes('canada') || loc.includes('alaska') || loc.includes('russia') ||
           loc.includes('norway') || loc.includes('sweden') || loc.includes('finland') ||
           loc.includes('iceland') || loc.includes('minnesota') || loc.includes('chicago')) {
    baseTemp = 5;
    condition = 'Cloudy';
    latitude = 55;
  }
  // Temperate US
  else if (loc.includes('san francisco') || loc.includes('sf') || loc.includes('bay area')) {
    baseTemp = 18;
    condition = 'Foggy';
    latitude = 37;
  }
  else if (loc.includes('new york') || loc.includes('nyc') || loc.includes('boston')) {
    baseTemp = 15;
    condition = 'Partly Cloudy';
    latitude = 41;
  }
  else if (loc.includes('los angeles') || loc.includes('la') || loc.includes('san diego')) {
    baseTemp = 24;
    condition = 'Sunny';
    latitude = 34;
  }
  else if (loc.includes('seattle') || loc.includes('portland') || loc.includes('vancouver')) {
    baseTemp = 14;
    condition = 'Rainy';
    latitude = 47;
  }
  // UK & Europe
  else if (loc.includes('london') || loc.includes('uk') || loc.includes('england')) {
    baseTemp = 12;
    condition = 'Cloudy';
    latitude = 51;
  }
  else if (loc.includes('paris') || loc.includes('france')) {
    baseTemp = 14;
    condition = 'Partly Cloudy';
    latitude = 48;
  }
  else if (loc.includes('berlin') || loc.includes('germany')) {
    baseTemp = 10;
    condition = 'Cloudy';
    latitude = 52;
  }
  // Southern hemisphere
  else if (loc.includes('australia') || loc.includes('sydney') || loc.includes('melbourne')) {
    baseTemp = 22;
    condition = 'Sunny';
    latitude = -34;
  }

  // Seasonal adjustment
  const season = getCurrentSeason(latitude);
  const seasonalAdjustment = {
    'summer': 8,
    'winter': -10,
    'spring': 0,
    'autumn': -3,
  };

  return {
    location,
    temperature: baseTemp + seasonalAdjustment[season],
    condition,
    humidity: 60,
    season,
  };
}

// Get clothing recommendations based on weather
export function getSeasonalRecommendations(weather: WeatherData): SeasonalRecommendation {
  const { temperature, season, condition } = weather;

  // Temperature-based weight
  let clothing_weight: 'light' | 'medium' | 'heavy' | 'layered';
  let fabric_suggestions: string[];
  let style_notes: string;

  if (temperature >= 28) {
    clothing_weight = 'light';
    fabric_suggestions = ['linen', 'cotton', 'silk', 'chambray', 'seersucker'];
    style_notes = 'Focus on breathable fabrics and loose fits. Light colors reflect heat.';
  } else if (temperature >= 20) {
    clothing_weight = 'light';
    fabric_suggestions = ['cotton', 'lightweight wool', 'jersey', 'denim'];
    style_notes = 'Perfect weather for most styles. Can experiment with layers.';
  } else if (temperature >= 12) {
    clothing_weight = 'layered';
    fabric_suggestions = ['wool', 'cashmere', 'cotton', 'flannel', 'corduroy'];
    style_notes = 'Layer season - cardigans, light jackets, and sweaters work great.';
  } else if (temperature >= 5) {
    clothing_weight = 'medium';
    fabric_suggestions = ['wool', 'cashmere', 'fleece', 'leather', 'tweed'];
    style_notes = 'Time for substantial outerwear. Focus on quality coats and warm accessories.';
  } else {
    clothing_weight = 'heavy';
    fabric_suggestions = ['heavy wool', 'cashmere', 'down', 'shearling', 'tech fabrics'];
    style_notes = 'Warmth is priority. Puffer jackets, heavy coats, and layered insulation.';
  }

  // Condition-based adjustments
  if ((condition || '').toLowerCase().includes('rain')) {
    fabric_suggestions = [...fabric_suggestions, 'water-resistant nylon', 'waxed cotton'];
    style_notes += ' Consider waterproof options and rubber-soled shoes.';
  }

  return {
    season,
    temperature_range: `${temperature - 3}°C to ${temperature + 3}°C`,
    clothing_weight,
    fabric_suggestions,
    style_notes,
  };
}
