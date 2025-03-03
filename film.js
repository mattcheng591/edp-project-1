let nameH1;
let birthYearSpan;
let heightSpan;
let massSpan;
let filmsDiv;
let planetDiv;
let producerSpan;
let directorSpan;
let releaseDateSpan;
let crawlSpan;

const baseUrl = `http://localhost:9001/api`;

// Runs on page load
addEventListener("DOMContentLoaded", () => {
  nameH1 = document.querySelector("h1#name");
  birthYearSpan = document.querySelector("span#birth_year");
  massSpan = document.querySelector("span#mass");
  heightSpan = document.querySelector("span#height");
  homeworldSpan = document.querySelector("span#homeworld");
  producerSpan = document.querySelector("span#producer");
  directorSpan = document.querySelector("span#director");
  releaseDateSpan = document.querySelector("span#releaseDate");
  charactersUl = document.querySelector("#characters>ul");
  planetsUl = document.querySelector("#planets>ul");
  crawlSpan = document.querySelector("span#crawl");
  const sp = new URLSearchParams(window.location.search);
  const id = sp.get("id");
  getFilm(id);
});

async function getCharacter(id) {
  let character;
  try {
    character = await fetchCharacter(id);
    character.homeworld = await fetchHomeworld(character);
    character.films = await fetchFilms(character);
  } catch (ex) {
    console.error(`Error reading character ${id} data.`, ex.message);
  }
  renderCharacter(character);
}
async function fetchCharacter(id) {
  let characterUrl = `${baseUrl}/characters/${id}`;
  return await fetch(characterUrl).then((res) => res.json());
}

async function fetchHomeworld(character) {
  const url = `${baseUrl}/planets/${character?.homeworld}`;
  const planet = await fetch(url).then((res) => res.json());
  return planet;
}

async function fetchFilms(character) {
  const url = `${baseUrl}/characters/${character?.id}/films`;
  const films = await fetch(url).then((res) => res.json());
  return films;
}

const renderCharacter = (character) => {
  document.title = `SWAPI - ${character?.name}`; // Just to make the browser tab say their name
  nameH1.textContent = character?.name;
  heightSpan.textContent = character?.height;
  massSpan.textContent = character?.mass;
  birthYearSpan.textContent = character?.birth_year;
  homeworldSpan.innerHTML = `<a href="/planet.html?id=${character?.homeworld.id}">${character?.homeworld.name}</a>`;
  const filmsLis = character?.films?.map(
    (film) => `<li><a href="/film.html?id=${film.id}">${film.title}</li>`
  );
  filmsUl.innerHTML = filmsLis.join("");
};

async function getFilm(id) {
  let film;
  try {
    film = await fetchFilm(id);
    film.characters = await fetchCharacters(film);
    film.planets = await fetchPlanets(film);
  } catch (ex) {
    console.error(`Error reading film ${id} data.`, ex.message);
  }
  renderFilm(film);
}

async function fetchFilm(id) {
  const url = `${baseUrl}/films/${id}`;
  const details = await fetch(url).then((res) => res.json());
  return details;
}

const renderFilm = (film) => {
  document.title = `SWAPI - ${film?.title}`; // Just to make the browser tab say their name
  nameH1.textContent = film?.title;
  producerSpan.textContent = film?.producer;
  directorSpan.textContent = film?.director;
  releaseDateSpan.textContent = film?.release_date;
  crawlSpan.textContent = film?.opening_crawl;
  const planetsLis = film?.planets?.map(
    (planet) => `<li><a href="planet.html?id=${planet.id}">${planet.name}</li>`
  );
  planetsUl.innerHTML = planetsLis.join("");

  const charactersLis = film?.characters?.map(
    (character) =>
      `<li><a href="character.html?id=${character.id}">${character.name}</li>`
  );
  charactersUl.innerHTML = charactersLis.join("");
};

async function fetchCharacters(film) {
  const url = `${baseUrl}/films/${film.id}/characters`;
  const character = await fetch(url).then((res) => res.json());
  return character;
}

async function fetchPlanets(film) {
  const url = `${baseUrl}/films/${film.id}/planets`;
  const planet = await fetch(url).then((res) => res.json());
  return planet;
}
// const renderFilmDetails();
