"use strict";
const api = "https://ipapi.co/";
const apiKey = "AIzaSyBfZSS0pdjxYqjTf_cH9mYk3IC9APIzxxk";

const btnHome = document.querySelector(".img-logo");
const btnSearch = document.querySelector(".btn-search");
const appContainer = document.querySelector(".main-app");

const inputEle = document.querySelector(".input-ip");

document.addEventListener("DOMContentLoaded", function () {
  getIpDetails("");
});

btnSearch.addEventListener("click", (e) => {
  e.preventDefault();
  let ipAddress = inputEle.value;
  ipAddress.includes(".com")
    ? getDnsLookup(ipAddress)
    : getIpDetails(ipAddress);
});

btnHome.addEventListener("click", () => location.reload());

async function getDnsLookup(hostname) {
  const apiUrl = `https://networkcalc.com/api/dns/lookup/${hostname}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    getIpDetails(data.records.A[0].address);
  } catch (error) {
    console.error("Error fetching DNS lookup:", error);
    throw error;
  }
}

async function getIpDetails(ipAddress) {
  try {
    const response = await fetch(`${api}${ipAddress}/json/`);
    const data = await response.json();
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
        <p class="ip-add"><strong>IP Address: </strong>${data.version} - ${
    data.ip
  }</p>
        <p class="country"><strong>Country: </strong>${
          data.country_name
        } (<span class="code">${data.country_code}</span>)</p>
        <p class="state"><strong>State: </strong>${
          data.region
        } (<span class="code">${data.region_code}</span>)</p>
        <p class="city"><strong>City: </strong>${data.city}</p>
        <p class="zip"><strong>Pin Code: </strong>${data.postal || "N/A"}</p>
        <p class="coordinates"><strong>Coordinates: </strong>${data.latitude},${
    data.longitude
  }</p>
        <p class="isp-name"><strong>ISP Name: </strong>${data.org}</p>
        <p class="date-now"><strong>Date: </strong>${dateTimeString}</p>
      </section>
      <section class='map-container'>
      <div id="map" class="display-map"></div></section>
    </article>
  `;

  displayMap(data.latitude, data.longitude, data.city);
}

function displayMap(lat, lon, city) {
  const mapContainer = document.getElementById("map");
  mapContainer.insertAdjacentHTML(
    "beforeend",
    `<img src='https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=11&size=1920x1080&maptype=roadmap&markers=color:red%7Clabel:%7C${lat},${lon}&key=${apiKey}' alt='${city} location Map'>`
  );
}
