const calculator = document.getElementById('calculator');
const display = document.getElementById('calcDisplay');
const clock = document.getElementById('clock');
const weatherTemp = document.getElementById('weatherTemp');
const weatherDesc = document.getElementById('weatherDesc');
const weatherMeta = document.getElementById('weatherMeta');
const timezone = document.getElementById('timezone');
const navButtons = document.querySelectorAll('.nav-btn');
const factText = document.getElementById('factText');
const factButton = document.getElementById('factButton');
const conversionType = document.getElementById('conversionType');
const convertInput = document.getElementById('convertInput');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const conversionResult = document.getElementById('conversionResult');

let currentValue = '0';
let storedValue = null;
let pendingOperator = null;
let shouldReset = false;

function updateDisplay() {
  display.value = currentValue;
}

function formatTimezoneLabel() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const parts = timeZone.split('/');
  const city = parts[parts.length - 1].replace(/_/g, ' ');
  const abbreviation = new Intl.DateTimeFormat('en', {
    timeZoneName: 'short'
  }).formatToParts(new Date()).find((part) => part.type === 'timeZoneName')?.value || 'UTC';

  return `${abbreviation} · ${city}`;
}

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  timezone.textContent = formatTimezoneLabel();
}

function formatTimeZoneLabel() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const parts = timeZone.split('/');
  const city = parts[parts.length - 1].replace(/_/g, ' ');
  const abbreviation = new Intl.DateTimeFormat('en', {
    timeZoneName: 'short'
  }).formatToParts(new Date()).find((part) => part.type === 'timeZoneName')?.value || 'UTC';

  return `${abbreviation} (${city})`;
}

function formatTimezoneLabel() {
  return formatTimeZoneLabel();
}

function handleNumber(value) {
  if (shouldReset) {
    currentValue = value;
    shouldReset = false;
  } else if (currentValue === '0' && value !== '.') {
    currentValue = value;
  } else if (value === '.' && currentValue.includes('.')) {
    return;
  } else {
    currentValue += value;
  }

  updateDisplay();
}

function applyOperator(operator) {
  const numericValue = Number(currentValue);

  if (storedValue === null) {
    storedValue = numericValue;
  } else if (pendingOperator) {
    switch (pendingOperator) {
      case '+':
        storedValue += numericValue;
        break;
      case '-':
        storedValue -= numericValue;
        break;
      case '*':
        storedValue *= numericValue;
        break;
      case '/':
        storedValue /= numericValue;
        break;
      case '^':
        storedValue = Math.pow(storedValue, numericValue);
        break;
    }
    currentValue = String(storedValue);
    updateDisplay();
  }

  pendingOperator = operator;
  shouldReset = true;
}

function calculateResult() {
  if (storedValue === null || !pendingOperator) {
    return;
  }

  const numericValue = Number(currentValue);

  switch (pendingOperator) {
    case '+':
      storedValue += numericValue;
      break;
    case '-':
      storedValue -= numericValue;
      break;
    case '*':
      storedValue *= numericValue;
      break;
    case '/':
      storedValue /= numericValue;
      break;
    case '^':
      storedValue = Math.pow(storedValue, numericValue);
      break;
  }

  currentValue = String(storedValue);
  updateDisplay();
  pendingOperator = null;
  storedValue = null;
  shouldReset = true;
}

const sections = Array.from(document.querySelectorAll('.card, .fact-card'));

function setActiveNavButton() {
  const scrollPosition = window.scrollY + 180;

  let activeSection = null;

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      activeSection = section;
    }
  });

  navButtons.forEach((button) => {
    const isActive = activeSection && button.dataset.target === activeSection.id;
    button.classList.toggle('active', isActive);
  });
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.target);
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setActiveNavButton();
  });
});

window.addEventListener('scroll', setActiveNavButton);
window.addEventListener('load', setActiveNavButton);

function setWeatherFallback(message) {
  weatherTemp.textContent = '—';
  weatherDesc.textContent = message;
  weatherMeta.textContent = 'Location access is off or unavailable';
}

function updateWeather(position) {
  const { latitude, longitude } = position.coords;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const current = data.current;
      const code = current?.weather_code;
      const description = getWeatherDescription(code);
      weatherTemp.textContent = `${Math.round(current?.temperature_2m ?? 0)}°C`;
      weatherDesc.textContent = description;
      weatherMeta.textContent = `Wind ${Math.round(current?.wind_speed_10m ?? 0)} km/h`;
    })
    .catch(() => {
      setWeatherFallback('Weather is temporarily unavailable');
    });
}

function getWeatherDescription(code) {
  const map = {
    0: 'Clear sky',
    1: 'Mostly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Rime fog',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Heavy drizzle',
    61: 'Light rain',
    63: 'Rain',
    65: 'Heavy rain',
    71: 'Light snow',
    73: 'Snow',
    75: 'Heavy snow',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail'
  };

  return map[code] || 'A pleasant day';
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(updateWeather, () => {
    setWeatherFallback('Allow location access for local weather');
  });
} else {
  setWeatherFallback('Geolocation is not supported');
}

const facts = [
  'The Moon is slowly moving away from Earth by about 3.8 cm each year.',
  'A day on Venus is longer than a year on Venus.',
  'Octopuses have three hearts and blue blood.',
  'The Eiffel Tower can grow taller in hot weather.',
  'Honey never spoils and has been found in ancient tombs.',
  'Bananas are berries, but strawberries are not.',
  'The largest empire in history was the British Empire, which covered almost a quarter of Earth\'s land at its greatest extent.'
];

function showRandomFact() {
  const fact = facts[Math.floor(Math.random() * facts.length)];
  factText.textContent = fact;
}

showRandomFact();

factButton.addEventListener('click', showRandomFact);

function handleCalculatorInput(value) {
  if (/^[0-9.]$/.test(value)) {
    handleNumber(value);
    return;
  }

  if (value === 'back') {
    if (shouldReset) {
      currentValue = '0';
      shouldReset = false;
    } else if (currentValue.length > 1) {
      currentValue = currentValue.slice(0, -1);
    } else {
      currentValue = '0';
    }
    updateDisplay();
    return;
  }

  if (value === 'C') {
    currentValue = '0';
    storedValue = null;
    pendingOperator = null;
    shouldReset = false;
    updateDisplay();
    return;
  }

  if (['+', '-', '*', '/', '^'].includes(value)) {
    applyOperator(value);
    return;
  }

  if (value === 'sqrt') {
    currentValue = String(Math.sqrt(Number(currentValue)));
    updateDisplay();
    return;
  }

  if (value === '=') {
    calculateResult();
  }
}

document.querySelectorAll('.calc-btn').forEach((button) => {
  button.addEventListener('click', () => {
    handleCalculatorInput(button.dataset.value);
  });
});

window.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^[0-9.]$/.test(key)) {
    handleCalculatorInput(key);
    return;
  }

  if (key === 'Backspace') {
    handleCalculatorInput('back');
    return;
  }

  if (['+', '-', '*', '/', '^', '=', 'Enter', 'c', 'C'].includes(key)) {
    if (key === 'Enter') {
      handleCalculatorInput('=');
    } else if (key === 'c' || key === 'C') {
      handleCalculatorInput('C');
    } else {
      handleCalculatorInput(key);
    }
  }

  if (key === 's' || key === 'S') {
    handleCalculatorInput('sqrt');
  }
});

function populateConversionUnits() {
  const type = conversionType.value;
  const options = {
    temp: [
      { value: 'C', label: 'Celsius' },
      { value: 'F', label: 'Fahrenheit' }
    ],
    length: [
      { value: 'm', label: 'Meters' },
      { value: 'ft', label: 'Feet' }
    ],
    weight: [
      { value: 'kg', label: 'Kilograms' },
      { value: 'lb', label: 'Pounds' }
    ]
  };

  const units = options[type];
  fromUnit.innerHTML = units.map((unit) => `<option value="${unit.value}">${unit.label}</option>`).join('');
  toUnit.innerHTML = units.map((unit) => `<option value="${unit.value}">${unit.label}</option>`).join('');
  fromUnit.value = units[0].value;
  toUnit.value = units[1].value;
  convertValue();
}

function convertValue() {
  const type = conversionType.value;
  const amount = Number(convertInput.value);

  if (!Number.isFinite(amount)) {
    conversionResult.textContent = 'Enter a number';
    return;
  }

  let result = amount;
  let fromLabel = fromUnit.options[fromUnit.selectedIndex]?.text || '';
  let toLabel = toUnit.options[toUnit.selectedIndex]?.text || '';

  if (type === 'temp') {
    if (fromUnit.value === 'C' && toUnit.value === 'F') {
      result = (amount * 9) / 5 + 32;
    } else if (fromUnit.value === 'F' && toUnit.value === 'C') {
      result = ((amount - 32) * 5) / 9;
    }
  } else if (type === 'length') {
    if (fromUnit.value === 'm' && toUnit.value === 'ft') {
      result = amount * 3.28084;
    } else if (fromUnit.value === 'ft' && toUnit.value === 'm') {
      result = amount / 3.28084;
    }
  } else if (type === 'weight') {
    if (fromUnit.value === 'kg' && toUnit.value === 'lb') {
      result = amount * 2.20462;
    } else if (fromUnit.value === 'lb' && toUnit.value === 'kg') {
      result = amount / 2.20462;
    }
  }

  const formattedAmount = Number.isInteger(amount) ? amount : amount.toFixed(2);
  const formattedResult = Number.isInteger(result) ? result : result.toFixed(2);
  conversionResult.textContent = `${formattedAmount} ${fromLabel} = ${formattedResult} ${toLabel}`;
}

conversionType.addEventListener('change', populateConversionUnits);
fromUnit.addEventListener('change', convertValue);
toUnit.addEventListener('change', convertValue);
convertInput.addEventListener('input', convertValue);
populateConversionUnits();

updateClock();
setInterval(updateClock, 1000);
