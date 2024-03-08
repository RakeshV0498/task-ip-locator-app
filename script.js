"use strict";

const api = "http://ip-api.com/json/";
const apiKey = "AIzaSyBfZSS0pdjxYqjTf_cH9mYk3IC9APIzxxk";

const btnHome = document.querySelector(".img-logo");
const btnSearch = document.querySelector(".btn-search");
const appContainer = document.querySelector(".main-app");

document.addEventListener("DOMContentLoaded", function () {
  const ipAddress = document.querySelector(".input-ip").value;
  getIpDetails(ipAddress);
});

btnSearch.addEventListener("click", (e) => {
  e.preventDefault();
  const ipAddress = document.querySelector(".input-ip").value;
  getIpDetails(ipAddress);
});

btnHome.addEventListener("click", () => location.reload());

async function getIpDetails(ipAddress) {
  try {
    const response = await fetch(
      `${api}${ipAddress}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,zip,lat,lon,timezone,currency,isp,org,as,query`
    );
    const data = await response.json();
    console.log(data);
    displayIpDetails(data);
  } catch (error) {
    console.error("Error fetching IP details:", error);
  }
}

function displayIpDetails(data) {
  const todayDate = new Date();
  const dateTimeString = todayDate
    .toLocaleDateString()
    .concat(" ", todayDate.toLocaleTimeString()); // Format date as ISO string

  appContainer.innerHTML = `
    <article class="display-ip">
      <section class="display-data">
        <p class="ip-add"><strong>IP Address: </strong>${data.query}</p>
        <p class="continent"><strong>Continent: </strong>${
          data.continent
        } (<span class="code">${data.continentCode}</span>)</p>
        <p class="country"><strong>Country: </strong>${
          data.country
        } (<span class="code">${data.countryCode}</span>)</p>
        <p class="state"><strong>State: </strong>${
          data.regionName
        } (<span class="code">${data.region}</span>)</p>
        <p class="city"><strong>City: </strong>${data.city}</p>
        <p class="zip"><strong>Pin Code: </strong>${data.zip || "N/A"}</p>
        <p class="coordinates"><strong>Coordinates: </strong>${data.lat},${
    data.lon
  }</p>
        <p class="isp-name"><strong>ISP Name: </strong>${data.isp}</p>
        <p class="date-now"><strong>Date: </strong>${dateTimeString}</p>
      </section>
      <section class='map-container'>
      <div id="map" class="display-map"></div></section>
    </article>
  `;

  displayMap(data.lat, data.lon);
}

function displayMap(lat, lon) {
  const mapContainer = document.getElementById("map");
  mapContainer.style.backgroundImage = `url('https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=11&size=1920x1080&maptype=roadmap&markers=color:red%7Clabel:%7C${lat},${lon}&key=${apiKey}')`;
}
