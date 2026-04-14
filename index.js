// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
const weatherApi = "https://api.weather.gov/alerts/active?area="

function getElement(id) {
  return document.getElementById(id)
}



function displayAlerts(data) {
  const alertsDisplay = getElement('alerts-display')
  alertsDisplay.textContent = ''

  const { title, features } = data
  const count = Array.isArray(features) ? features.length : 0
  const summary = document.createElement('p')
  summary.textContent = `${title}: ${count}`
  alertsDisplay.append(summary)

  if (count > 0) {
    const list = document.createElement('ul')
    features.forEach(feature => {
      const headline = feature?.properties?.headline || 'No headline available'
      const item = document.createElement('li')
      item.textContent = headline
      list.append(item)
    })
    alertsDisplay.append(list)
  }
}




function displayError(message) {
  const errorElement = getElement('error-message')
  errorElement.textContent = message
  errorElement.classList.remove('hidden')
}


function clearError() {
  const errorElement = getElement('error-message')
  errorElement.textContent = ''
  errorElement.classList.add('hidden')
}


function clearInput() {
  const input = getElement('state-input')
  if (input) {
    input.value = ''
  }
}


async function fetchWeatherAlerts(stateAbbr) {
  if (!stateAbbr || !/^[A-Za-z]{2}$/.test(stateAbbr)) {
    throw new Error('Please enter a valid two-letter state abbreviation.')
  }

  const response = await fetch(`${weatherApi}${stateAbbr}`)
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}


async function handleFetchAlerts(event) {
  event.preventDefault()
  const input = getElement('state-input')
  const stateAbbr = input?.value.trim().toUpperCase()
  const alertsDisplay = getElement('alerts-display')
  alertsDisplay.textContent = ''
  clearError()


  try {
    const data = await fetchWeatherAlerts(stateAbbr)
    displayAlerts(data)
    clearInput()
  } catch (error) {
    clearInput()
    displayError(error.message)
  }
}


function init() {
  const button = getElement('fetch-alerts')
  if (!button) return

  button.addEventListener('click', handleFetchAlerts)
}

document.addEventListener('DOMContentLoaded', init)
