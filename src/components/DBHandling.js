import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Menu from './Menu';

const Container = styled.div`
  padding: 20px;
`;

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

const DataList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const DataItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
`;

const DataText = styled.span`
  margin-right: 10px;
`;

const EditFormContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EditForm = styled.form`
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EditInput = styled.input`
  margin-bottom: 10px;
  padding: 5px;
  width: calc(100% - 20px);
`;

const EditButton = styled.button`
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #2196F3;
  color: white;
  border: none;
  cursor: pointer;
`;

const CancelButton = styled.button`
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
`;

const CityFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Accordion = styled.div`
  margin-bottom: 20px;
`;

const AccordionItem = styled.div`
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  margin-bottom: 10px;
`;

const AccordionTitle = styled.div`
  cursor: pointer;
  padding: 10px;
  font-weight: bold;
`;

const AccordionContent = styled.div`
  padding: 10px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
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

const handleDeleteDatabase = async () => {
  const request = indexedDB.deleteDatabase('MyDatabase');
  request.onsuccess = async () => {
    console.log('Database deleted successfully');
    db = await openDatabase();
  };
  request.onerror = (event) => {
    console.error('Error deleting database:', event.target.errorCode);
  };
};

const IndexedDBComponent = () => {
  useEffect(() => {
    openDatabase().then((dbInstance) => {
      db = dbInstance;
      fetchData(db);
      fetchCities(db);
    }).catch((error) => {
      console.error('Error opening database:', error);
    });
  }, []);

  const [data, setData] = useState([]);
  const [editFormData, setEditFormData] = useState({
    id: null,
    name: '',
    email: '',
    city: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [cityName, setCityName] = useState('');
  const [cities, setCities] = useState([]);
  const [isCityEditing, setIsCityEditing] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState({});
  const [view, setView] = useState('people');
  const [filterName, setFilterName] = useState('');

  const fetchData = (dbInstance) => {
    const transaction = dbInstance.transaction(['PeopleStore'], 'readonly');
    const objectStore = transaction.objectStore('PeopleStore');
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      setData(event.target.result);
    };

    request.onerror = (event) => {
      console.error('Fetch request error:', event.target.errorCode);
    };
  };

  const fetchCities = (dbInstance) => {
    const transaction = dbInstance.transaction(['CityStore'], 'readonly');
    const objectStore = transaction.objectStore('CityStore');
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      setCities(event.target.result);
    };

    request.onerror = (event) => {
      console.error('Fetch cities request error:', event.target.errorCode);
    };
  };

  const addData = () => {
    if (!db) {
      console.error('Database connection is not available.');
      return;
    }

    const transaction = db.transaction(['PeopleStore'], 'readwrite');
    const objectStore = transaction.objectStore('PeopleStore');
    const id = data.length ? data[data.length - 1].id + 1 : 1;
    const newData = { id, name: filterName, email: '', city: '' };

    const request = objectStore.add(newData);

    request.onsuccess = () => {
      console.log('Data added successfully.');
      fetchData(db);
      setEditFormData({ id: null, name: '', email: '', city: '' });
    };

    request.onerror = (event) => {
      console.error('Add request error:', event.target.error);
    };

    transaction.oncomplete = () => {
      console.log('Transaction completed.');
    };

    transaction.onerror = (event) => {
      console.error('Transaction error:', event.target.error);
    };
  };

  const addCity = () => {
    if (!db) {
      console.error('Database connection is not available.');
      return;
    }

    const transaction = db.transaction(['CityStore'], 'readwrite');
    const objectStore = transaction.objectStore('CityStore');
    const id = cities.length ? cities[cities.length - 1].id + 1 : 1;
    const newCity = { id, name: cityName };

    const request = objectStore.add(newCity);

    request.onsuccess = () => {
      fetchCities(db);
      setCityName('');
    };

    request.onerror = (event) => {
      console.error('Add city request error:', event.target.errorCode);
    };

    transaction.oncomplete = () => {
      console.log('Transaction completed.');
    };

    transaction.onerror = (event) => {
      console.error('Transaction error:', event.target.error);
    };
  };

  const updateData = () => {
    const transaction = db.transaction(['PeopleStore'], 'readwrite');
    const objectStore = transaction.objectStore('PeopleStore');
    const request = objectStore.put(editFormData);

    request.onsuccess = () => {
      fetchData(db);
      setEditFormData({ id: null, name: '', email: '', city: '' });
      setIsEditing(false);
    };

    request.onerror = (event) => {
      console.error('Update request error:', event.target.error);
    };
  };

  const deleteData = (id) => {
    const transaction = db.transaction(['PeopleStore'], 'readwrite');
    const objectStore = transaction.objectStore('PeopleStore');
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      fetchData(db);
    };

    request.onerror = (event) => {
      console.error('Delete request error:', event.target.error);
    };
  };

  const handleEditClick = (item) => {
    setEditFormData(item);
    setIsEditing(true);
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCityEditClick = (item) => {
    setCityName(item.name);
    setIsCityEditing(true);
  };

  const updateCity = () => {
    const transaction = db.transaction(['CityStore'], 'readwrite');
    const objectStore = transaction.objectStore('CityStore');
    const updatedCity = { ...editFormData, name: cityName };
    const request = objectStore.put(updatedCity);

    request.onsuccess = () => {
      fetchCities(db);
      setCityName('');
      setIsCityEditing(false);
    };

    request.onerror = (event) => {
      console.error('Update city request error:', event.target.error);
    };
  };

  const deleteCity = (id) => {
    const transaction = db.transaction(['CityStore'], 'readwrite');
    const objectStore = transaction.objectStore('CityStore');
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      fetchCities(db);
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
    <Container>
      <h1>IndexedDB with React</h1>
      <Menu setView={setView} handleDeleteDatabase={handleDeleteDatabase} />

      {view === 'people' && (
        <>
          <h2>People</h2>
          <Input
            type="text"
            placeholder="Filter by name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
          <Button onClick={addData}>Add Data</Button>
          <DataList>
            {data
              .filter((item) => item.name.toLowerCase().includes(filterName.toLowerCase()))
              .map((item) => (
                <DataItem key={item.id}>
                  <DataText>Name: {item.name}</DataText>
                  <DataText>Email: {item.email}</DataText>
                  <DataText>City: {item.city}</DataText>
                  <Button onClick={() => handleEditClick(item)}>Edit</Button>
                  <DeleteButton onClick={() => deleteData(item.id)}>Delete</DeleteButton>
                </DataItem>
              ))}
          </DataList>
          {isEditing && (
            <EditFormContainer>
              <EditForm onSubmit={updateData}>
                <h2>Edit Data</h2>
                <EditInput
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                />
                <EditInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                />
                <EditInput
                  type="text"
                  name="city"
                  placeholder="City"
                  value={editFormData.city}
                  onChange={handleEditFormChange}
                />
                <EditButton type="submit">Update</EditButton>
                <CancelButton onClick={() => setIsEditing(false)}>Cancel</CancelButton>
              </EditForm>
            </EditFormContainer>
          )}
        </>
      )}

      {view === 'cities' && (
        <>
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
                  <Button onClick={() => handleCityEditClick(city)}>Edit</Button>
                  <DeleteButton onClick={() => deleteCity(city.id)}>Delete</DeleteButton>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
    </Container>
  );
};

export default IndexedDBComponent;
