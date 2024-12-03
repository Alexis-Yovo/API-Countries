const loadCountryAPI = () => {
  fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((data) => {
      console.log("Data received:", data); // Vérifier les données reçues
      displayCountries(data);
    })
    .catch((err) => console.error("Fetching error:", err)); // Ajout de la gestion d'erreur
};

const displayCountries = (countries) => {
  console.log("Displaying countries:", countries); // Vérifier chaque pays avant traitement
  const countriesHTML = countries.map((country) => getCountry(country));
  const container = document.getElementById("countries");
  container.innerHTML = countriesHTML.join(" ");
};

const getCountry = (country) => {
  // Ajoutez des logs pour diagnostiquer les données de chaque pays
  console.log("Processing country:", country);

  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((currency) => currency.name)
        .join(", ")
    : "N/A";
  const callingCodes = country.idd
    ? country.idd.root +
      (country.idd.suffixes ? country.idd.suffixes.join(", ") : "")
    : "N/A";



    // Formater la population pour insérer un espace à chaque millième
  const population = country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
   // Formater la surface pour insérer un espace à chaque millième
  const area = country.area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Traduire si le pays est enclavé ou non
  const landlocked = country.landlocked ? "Oui" : "Non";

   // Objet de correspondance pour les continents
   const continentTranslation = {
    Africa: "Afrique",
    Americas: "Amériques",
    Antarctic: "Antarctique",
    Asia: "Asie",
    Europe: "Europe",
    Oceania: "Océanie"
  };

  // Objet de correspondance pour les sous-régions
  const subregionTranslation = {
    "Central Africa": "Afrique centrale",
    "Eastern Africa": "Afrique de l'Est",
    "Middle Africa": "Afrique  centrale",
    "Northern Africa": "Afrique du Nord",
    "Southern Africa": "Afrique du Sud",
    "Western Africa": "Afrique de l'Ouest",
    "Caribbean": "Caraïbes",
    "Central America": "Amérique centrale",
    "North America": "Amérique du Nord",
    "South America": "Amérique du Sud",
    "Central Asia": "Asie centrale",
    "Eastern Asia": "Asie de l'Est",
    "South-Eastern Asia": "Asie du Sud-Est",
    "Southern Asia": "Asie du Sud",
    "Western Asia": "Asie de l'Ouest",
    "Eastern Europe": "Europe de l'Est",
    "Northern Europe": "Europe du Nord",
    "Southern Europe": "Europe du Sud",
    "Central Europe": "Europe centrale",
    "Western Europe": "Europe de l'Ouest",
    "Australia and New Zealand": "Australie et Nouvelle-Zélande",
    "Melanesia": "Mélanésie",
    "Micronesia": "Micronésie",
    "Polynesia": "Polynésie"
  };

  // Traduire le nom du continent et de la sous-région
  const region = continentTranslation[country.region] || country.region;
  const subregion = subregionTranslation[country.subregion] || country.subregion;

    // Accéder au démonyme en français
    const demonym_male = country.demonyms && country.demonyms.fra ? country.demonyms.fra.m : "Aucun";
    const demonym_female = country.demonyms && country.demonyms.fra ? country.demonyms.fra.f : "Aucune";


  return `
        <div class="country-div">
        <img src="${country.flags.png}">
        <h2>${country.translations.fra.common}</h2>
        <hr>
        <h3>Code du Pays : ${country.fifa}</h3>
        <h3>Population: ${population}</h3>
        <h3>Superficie : ${area} km²</h3>
        <h3>Gentilé : ${demonym_male} / ${demonym_female} </h3>
        <h3>Continent : ${region}</h3>
        <h3>Région du Continent : ${subregion}</h3>
        <h3>Pays Enclavé: ${landlocked}</h3>
        <h3>Pays Frontaliers: ${country.borders ? country.borders.join(", ") : "Aucun"}</h3>
        <h3>Capitale: ${country.capital}</h3>
        <h3>Langue(s) : ${
          country.languages
            ? Object.values(country.languages).join(", ")
            : "N/A"
        }</h3>
        <h3>Devise : ${currencies}</h3>
        <h3>Indice Téléphonique : ${callingCodes}</h3>
        </div>
    `;
};

/* Trier les infos des pays */

const sortCountries = (criteria, order) => {
  const container = document.getElementById("countries");
  const countries = Array.from(container.children).map((countryDiv) => {
    const countryName = countryDiv.querySelector("h2").textContent;
    const countryArea = parseFloat(countryDiv.querySelector("h3:nth-of-type(3)").textContent.replace(/[^0-9]/g, ""));
    const countryPopulation = parseFloat(countryDiv.querySelector("h3:nth-of-type(2)").textContent.replace(/[^0-9]/g, ""));
    return { element: countryDiv, name: countryName, area: countryArea, population: countryPopulation };
  });

  countries.sort((a, b) => {
    if (criteria === "name") {
      return order === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (criteria === "area") {
      return order === "asc" ? a.area - b.area : b.area - a.area;
    } else if (criteria === "population") {
      return order === "asc" ? a.population - b.population : b.population - a.population;
    }
  });

  container.innerHTML = "";
  countries.forEach((country) => container.appendChild(country.element));
};

document.getElementById("sort-button").addEventListener("click", () => {
  const sortOptions = document.getElementById("sort-options");
  sortOptions.style.display = sortOptions.style.display === "none" ? "block" : "none";
});

// Filtrage (barre de recherche)
const filterCountries = (e) => {
  const query = e.target.value.toLowerCase();
  const countries = document.querySelectorAll(".country-div");
  countries.forEach((country) => {
    const countryName = country.querySelector("h2").textContent.toLowerCase();
    if (countryName.includes(query)) {
      country.style.display = "";
    } else {
      country.style.display = "none";
    }
  });
};

// Ignorer les accents dans le filtrage
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};


// Ajouter un gestionnaire d'événements pour la barre de recherche
document.getElementById("search-bar").addEventListener("input", filterCountries);

loadCountryAPI();
