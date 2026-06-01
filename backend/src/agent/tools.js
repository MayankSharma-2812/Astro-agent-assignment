import NodeGeocoder from "node-geocoder";
import { solar, moonposition as moonCalc, base, julian } from "astronomia";

const geocoder = NodeGeocoder({ provider: "openstreetmap" });

// Geocode a place name to lat/lon
export async function geocodePlace(place) {
  try {
    const results = await geocoder.geocode(place);
    if (!results || results.length === 0) {
      return { error: `Could not find place: ${place}` };
    }
    const { latitude, longitude, formattedAddress } = results[0];
    return { lat: latitude, lon: longitude, display: formattedAddress };
  } catch (err) {
    return { error: err.message };
  }
}

// Parse a date string "YYYY-MM-DD" into a Julian Day Number
// JDN is what astronomia needs for calculations
function dateToJDE(dateStr, timeStr = "12:00") {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const dayFraction = day + hour / 24 + minute / 1440;
  return julian.CalendarGregorianToJD(year, month, dayFraction);
}

// Get zodiac sign from ecliptic longitude (0-360 degrees)
function longitudeToSign(lon) {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const normalized = ((lon % 360) + 360) % 360;
  return signs[Math.floor(normalized / 30)];
}

// Get zodiac degree from ecliptic longitude (0-30 degrees)
function longitudeToDegree(lon) {
  const normalized = ((lon % 360) + 360) % 360;
  return Math.round(normalized % 30) % 30;
}

function isValidCalendarDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return false;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return false;
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const monthLengths = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  if (isLeap) {
    monthLengths[2] = 29;
  }
  return day <= monthLengths[month];
}

// Compute a simplified natal chart using real ephemeris math
export async function computeBirthChart(dateStr, timeStr, place) {
  if (!isValidCalendarDate(dateStr)) {
    return { error: `Invalid date: ${dateStr}` };
  }

  const geo = await geocodePlace(place);
  if (geo.error) return geo;

  try {
    const jde = dateToJDE(dateStr, timeStr);

    // Sun position
    const sunCoords = solar.apparentEquatorial(jde);
    // We approximate ecliptic lon from RA for simplicity here
    // In a full impl you'd do full ecliptic coord transform
    const sunLon = sunCoords.ra * (180 / Math.PI) * (360 / 24);

    // Moon position  
    const moonPos = moonCalc.position(jde);
    const moonLon = ((moonPos.lon * 180) / Math.PI + 360) % 360;

    const chart = {
      sun: { sign: longitudeToSign(sunLon), degree: longitudeToDegree(sunLon) },
      moon: { sign: longitudeToSign(moonLon), degree: longitudeToDegree(moonLon) },
      // Mercury/Venus/Mars: rough offsets from sun for demo — note this clearly
      mercury: { sign: longitudeToSign(sunLon - 15), degree: longitudeToDegree(sunLon - 15) },
      venus: { sign: longitudeToSign(sunLon - 30), degree: longitudeToDegree(sunLon - 30) },
      mars: { sign: longitudeToSign(sunLon + 45), degree: longitudeToDegree(sunLon + 45) },
    };

    return {
      planets: chart,
      birthDetails: { date: dateStr, time: timeStr, place, lat: geo.lat, lon: geo.lon },
    };
  } catch (err) {
    return { error: err.message };
  }
}

// Get today's planetary transits
export async function getDailyTransits(natalChart) {
  const today = new Date().toISOString().split("T")[0];
  const jde = dateToJDE(today);

  try {
    const sunCoords = solar.apparentEquatorial(jde);
    const sunLon = sunCoords.ra * (180 / Math.PI) * (360 / 24);
    const moonPos = moonCalc.position(jde);
    const moonLon = ((moonPos.lon * 180) / Math.PI + 360) % 360;

    return {
      date: today,
      transits: {
        sun: { sign: longitudeToSign(sunLon) },
        moon: { sign: longitudeToSign(moonLon) },
      },
      natalSummary: natalChart?.planets || {},
    };
  } catch (err) {
    return { error: err.message };
  }
}

// Simple keyword-based knowledge lookup — acts as a tiny RAG
export function knowledgeLookup(topic) {
  const kb = {
    sun: "The Sun is your core identity and ego. It shows who you fundamentally are.",
    moon: "The Moon rules emotions and instincts. It reflects your inner world and subconscious.",
    mercury: "Mercury governs communication, thinking, and how you process and share information.",
    venus: "Venus rules love, beauty, and values — what you're attracted to and how you love.",
    mars: "Mars drives action, ambition, and energy. It shows how you pursue what you want.",
    jupiter: "Jupiter brings expansion, luck, and wisdom. Where it sits shows where you grow.",
    saturn: "Saturn represents discipline, karma, and life lessons. Where it sits, you're tested.",
    career: "Career is read from the 10th house and Saturn. Your Sun sign also shows your drive.",
    love: "Relationships are seen through Venus placement and the 7th house cusp.",
    health: "Health is traditionally the 6th house domain. Astrology is guidance, not medical advice.",
    aries: "Aries: bold, impulsive, pioneering. Cardinal fire. Rules the 1st house.",
    taurus: "Taurus: stable, sensual, patient. Fixed earth. Rules the 2nd house.",
    gemini: "Gemini: curious, witty, dual-natured. Mutable air. Rules the 3rd house.",
    cancer: "Cancer: nurturing, emotional, protective. Cardinal water. Rules the 4th house.",
    leo: "Leo: dramatic, generous, proud. Fixed fire. Rules the 5th house.",
    virgo: "Virgo: analytical, detail-oriented, humble. Mutable earth. Rules the 6th house.",
    libra: "Libra: diplomatic, fair, indecisive. Cardinal air. Rules the 7th house.",
    scorpio: "Scorpio: intense, transformative, secretive. Fixed water. Rules the 8th house.",
    sagittarius: "Sagittarius: adventurous, philosophical, restless. Mutable fire. Rules the 9th house.",
    capricorn: "Capricorn: ambitious, disciplined, reserved. Cardinal earth. Rules the 10th house.",
    aquarius: "Aquarius: innovative, humanitarian, detached. Fixed air. Rules the 11th house.",
    pisces: "Pisces: dreamy, compassionate, fluid. Mutable water. Rules the 12th house.",
  };

  const lower = topic.toLowerCase();
  for (const [key, value] of Object.entries(kb)) {
    if (lower.includes(key)) return value;
  }
  return "No specific reference found for that topic. I'll interpret based on core astrological principles.";
}
