import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Form = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  margin-right: 10px;
  padding: 5px;
  flex: 1;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const Accordion = styled.div`
  margin-bottom: 20px;
`;

const AccordionItem = styled.div`
  border: 1px solid #ddd;
  margin-bottom: 10px;
`;

const AccordionTitle = styled.div`
  background-color: #f9f9f9;
  padding: 10px;
  cursor: pointer;
`;

const AccordionContent = styled.div`
  padding: 10px;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

let db;

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyDatabase', 1);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      const peopleStore = db.createObjectStore('PeopleStore', { keyPath: 'id' });
      peopleStore.createIndex('name', 'name', { unique: false });
      peopleStore.createIndex('email', 'email', { unique: true });
      peopleStore.createIndex('city', 'city', { unique: false });

      const cityStore = db.createObjectStore('CityStore', { keyPath: 'id' });
      cityStore.createIndex('name', 'name', { unique: false });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
  });
};

const fetchCities = (dbInstance, setCities) => {
  const transaction = dbInstance.transaction(['CityStore'], 'readonly');
  const objectStore = transaction.objectStore('CityStore');
  const request = objectStore.getAll();

  request.onsuccess = (event) => {
    setCities(event.target.result);
  };

  request.onerror = (event) => {
    console.error('Fetch request error:', event.target.errorCode);
  };
};

const CitiesView = () => {
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState('');
  const [isCityEditing, setIsCityEditing] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState({});

  useEffect(() => {
    openDatabase().then((dbInstance) => {
      db = dbInstance;
      fetchCities(db, setCities);
    }).catch((error) => {
      console.error('Error opening database:', error);
    });
  }, []);

  const addCity = () => {
    const transaction = db.transaction(['CityStore'], 'readwrite');
    const objectStore = transaction.objectStore('CityStore');
    const request = objectStore.add({ id: Date.now(), name: cityName });

    request.onsuccess = () => {
      fetchCities(db, setCities);
      setCityName('');
    };

    request.onerror = (event) => {
      console.error('Add city request error:', event.target.error);
    };
  };

  const deleteCity = (id) => {
    const transaction = db.transaction(['CityStore'], 'readwrite');
    const objectStore = transaction.objectStore('CityStore');
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      fetchCities(db, setCities);
    };

    request.onerror = (event) => {
      console.error('Delete city request error:', event.target.error);
    };
  };

  const toggleAccordion = (id) => {
    setAccordionOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  return (
    <div>
      <h2>Cities</h2>
      <Form>
        <Input
          type="text"
          placeholder="Add a city"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        />
        <Button onClick={addCity}>{isCityEditing ? 'Update City' : 'Add City'}</Button>
      </Form>
      <Accordion>
        {cities.map((city) => (
          <AccordionItem key={city.id}>
            <AccordionTitle onClick={() => toggleAccordion(city.id)}>
              {city.name}
            </AccordionTitle>
            <AccordionContent isOpen={accordionOpen[city.id]}>
              <Button onClick={() => { setCityName(city.name); setIsCityEditing(true); }}>Edit</Button>
              <Button onClick={() => deleteCity(city.id)}>Delete</Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CitiesView;
