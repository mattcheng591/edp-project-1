let planetNameH1;
let birthYearSpan;
let heightSpan;
let massSpan;
let filmsDiv;
let planetDiv;
let climateSpan;
let terrainSpan;
let populationSpan;
const baseUrl = `http://localhost:9001/api`;

// Runs on page load
addEventListener("DOMContentLoaded", () => {
  planetNameH1 = document.querySelector("h1#name");
  populationSpan = document.querySelector("span#birth_year");
  climateSpan = document.querySelector("span#mass");
  terrainSpan = document.querySelector("span#height");
  homeworldSpan = document.querySelector("span#homeworld");
  filmsUl = document.querySelector("#films>ul");
  charactersUl = document.querySelector("#characters>ul");
  const sp = new URLSearchParams(window.location.search);
  const id = sp.get("id");
  getPlanet(id);
});

async function getPlanet(id) {
  let planet;
  try {
    planet = await fetchPlanet(id);
    planet.character = await fetchCharacter(planet);
    planet.films = await fetchFilms(planet);
  } catch (ex) {
    console.error(`Error reading planet ${id} data.`, ex.message);
  }
  renderCharacter(planet);
}
async function fetchPlanet(id) {
  let planetUrl = `${baseUrl}/planets/${id}`;
  return await fetch(planetUrl).then((res) => res.json());
}

async function fetchCharacter(planet) {
  const url = `${baseUrl}/planets/${planet?.id}/characters`;
  const characters = await fetch(url).then((res) => res.json());
  return characters;
}

// async function getPlanetDetails(film) {
//   const url = `${baseUrl}/planet/${film?.id}`;
//   const film = await fetch(url).then((res) => res.json());
//   return film;
// }

async function fetchFilms(planet) {
  const url = `${baseUrl}/planets/${planet?.id}/films`;
  const films = await fetch(url).then((res) => res.json());
  return films;
}

const renderCharacter = (planet) => {
  document.title = `SWAPI - ${planet?.name}`; // Just to make the browser tab say their name
  planetNameH1.textContent = planet?.name;
  climateSpan.textContent = planet?.climate;
  terrainSpan.textContent = planet?.terrain;
  populationSpan.textContent = planet?.population;
  // homeworldSpan.innerHTML = `<a href="/planet.html?id=${planet?.homeworld.id}">${planet?.homeworld.name}</a>`;

  const characterLis = planet?.character?.map(
    (character) =>
      `<li><a href="/character.html?id=${character.id}">${character.name}</li>`
  );
  filmsUl.innerHTML = characterLis.join("");

  const filmsLis = planet?.films?.map(
    (film) => `<li><a href="/film.html?id=${film.id}">${film.title}</li>`
  );
  charactersUl.innerHTML = filmsLis.join("");
};
