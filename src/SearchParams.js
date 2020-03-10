import React, { useState, useEffect, useContext } from 'react';
import pet, { ANIMALS } from '@frontendmasters/pet';
import Results from './Results';
import useDropdown from './useDropdown';
import ThemeContext from './ThemeContext';

const SearchParams = () => {
  const [location, setLocation] = useState("Seattle, WA");
  const [breeds, setBreeds] = useState([]);
  const [animal, AnimalDropdown] = useDropdown("Animal", "dog", ANIMALS);
  const [breed, BreedDropdown, setBreed] = useDropdown("Breed", "", breeds);
  const [pets, setPets] = useState([]);
  const [theme, setTheme] = useContext(ThemeContext);

  async function requestPets() {
    const { animals } = await pet.animals({
      location,
      breed,
      type: animal
    });

    setPets(animals || []);
  }

  useEffect(() => {
    setBreeds([]);
    setBreed("");

    pet.breeds(animal)
    .then(({ breeds: response }) => {
      const breeds = response.map(({ name }) => name);

      setBreeds(breeds);
    }, console.error);
  }, [animal, setBreed, setBreeds]);

  return (
    <div className="search-params">
      <form onSubmit={ (e) => {
        e.preventDefault();
        requestPets();
      }}>
        <label htmlFor="location">
          location
          <input id="location" value={ location } onChange={ e => setLocation(e.target.value) } placeholder="Location" />
        </label>
        <AnimalDropdown />
        <BreedDropdown />
        <label htmlFor="theme">
          Theme
          <select 
            value={ theme }
            onChange={ e => setTheme(e.target.value) }
            onBlur={ e => setTheme(e.target.value)
            }
          >
            <option value="peru">Peru</option>
            <option value="blue">Blue</option>
            <option value="mediumorchid">Medium Orchid</option>
            <option value="chartreuse">Chartreuse</option>
          </select>
        </label>
        <button style={{ "background-color": theme }}type="submit">Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
}

export default SearchParams