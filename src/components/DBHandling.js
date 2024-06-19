import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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

const LinkButton = styled.button`
  padding: 5px 10px;
  background-color: #008CBA;
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
  &:hover {
    background-color: #007bb5;
  }
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

const IndexedDBComponent = () => {
  const [db, setDb] = useState(null);
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
  const [view, setView] = useState('people'); // Default view is 'people'

  useEffect(() => {
    const request = indexedDB.open('MyDatabase', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const peopleStore = db.createObjectStore('PeopleStore', { keyPath: 'id' });
      peopleStore.createIndex('name', 'name', { unique: false });
      peopleStore.createIndex('email', 'email', { unique: true });
      peopleStore.createIndex('city', 'city', { unique: false });

      const cityStore = db.createObjectStore('CityStore', { keyPath: 'id' });
      cityStore.createIndex('name', 'name', { unique: true });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      setDb(db);
      fetchData(db);
      fetchCities(db);
    };

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
    };
  }, []);

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
    const transaction = db.transaction(['PeopleStore'], 'readwrite');
    const objectStore = transaction.objectStore('PeopleStore');
    const id = data.length ? data[data.length - 1].id + 1 : 1;
    const newData = { id, name: editFormData.name, email: editFormData.email, city: editFormData.city };

    const request = objectStore.add(newData);

    request.onsuccess = () => {
      fetchData(db);
      setEditFormData({ id: null, name: '', email: '', city: '' });
    };

    request.onerror = (event) => {
      console.error('Add request error:', event.target.errorCode);
    };
  };

  const addCity = () => {
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
      console.error('Update request error:', event.target.errorCode);
    };
  };

  const updateCity = (city) => {
    const transaction = db.transaction(['CityStore'], 'readwrite');
    const objectStore = transaction.objectStore('CityStore');
    const request = objectStore.put(city);

    request.onsuccess = () => {
      fetchCities(db);
      setCityName('');
      setIsCityEditing(false);
    };

    request.onerror = (event) => {
      console.error('Update city request error:', event.target.errorCode);
    };
  };

  const handleEditData = (item) => {
    setEditFormData({
      id: item.id,
      name: item.name,
      email: item.email,
      city: item.city
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleCityChange = (e) => {
    setCityName(e.target.value);
  };

  const cancelEdit = () => {
    setEditFormData({ id: null, name: '', email: '', city: '' });
    setIsEditing(false);
  };

  const deleteData = (id) => {
    const transaction = db.transaction(['PeopleStore'], 'readwrite');
    const objectStore = transaction.objectStore('PeopleStore');
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      fetchData(db);
    };

    request.onerror = (event) => {
      console.error('Delete request error:', event.target.errorCode);
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
      console.error('Delete city request error:', event.target.errorCode);
    };
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(editFormData.name.toLowerCase())
  );

  const renderPeopleView = () => (
    <>
      <Form>
        <Input
          type="text"
          placeholder="Name"
          name="name"
          value={editFormData.name}
          onChange={handleInputChange}
        />
        <Input
          type="email"
          placeholder="Email"
          name="email"
          value={editFormData.email}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          placeholder="City"
          name="city"
          value={editFormData.city}
          onChange={handleInputChange}
        />
        <Button onClick={addData}>Add Data</Button>
      </Form>
      <Accordion>
        {cities.map(city => (
          <AccordionItem key={city.id}>
            <AccordionTitle onClick={() => setAccordionOpen(prev => ({ ...prev, [city.id]: !prev[city.id] }))}>
              {city.name}
            </AccordionTitle>
            <AccordionContent isOpen={accordionOpen[city.id]}>
              <DataList>
                {filteredData
                  .filter(person => person.city === city.name)
                  .map(item => (
                    <DataItem key={item.id}>
                      <div>
                        <DataText>ID: {item.id}</DataText>
                        <DataText>Name: {item.name}</DataText>
                        <DataText>Email: {item.email}</DataText>
                      </div>
                      <div>
                        <Button onClick={() => handleEditData(item)}>Edit</Button>
                      </div>
                    </DataItem>
                  ))}
              </DataList>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {isEditing && (
        <EditFormContainer>
          <EditForm onSubmit={updateData}>
            <EditInput
              type="text"
              placeholder="Name"
              name="name"
              value={editFormData.name}
              onChange={handleInputChange}
            />
            <EditInput
              type="email"
              placeholder="Email"
              name="email"
              value={editFormData.email}
              onChange={handleInputChange}
            />
            <EditInput
              type="text"
              placeholder="City"
              name="city"
              value={editFormData.city}
              onChange={handleInputChange}
            />
            <div>
              <EditButton type="submit">Save</EditButton>
              <CancelButton type="button" onClick={cancelEdit}>Cancel</CancelButton>
              <DeleteButton type="button" onClick={() => deleteData(editFormData.id)}>Delete</DeleteButton>
            </div>
          </EditForm>
        </EditFormContainer>
      )}
    </>
  );

  const renderCitiesView = () => (
    <CityFormContainer>
      <Form>
        <Input
          type="text"
          placeholder="City"
          value={cityName}
          onChange={handleCityChange}
        />
        <Button onClick={addCity}>Add City</Button>
      </Form>
      <DataList>
        {cities.map(city => (
          <DataItem key={city.id}>
            <div>
              <DataText>ID: {city.id}</DataText>
              <DataText>Name: {city.name}</DataText>
            </div>
            <div>
              <Button onClick={() => {
                setCityName(city.name);
                setIsCityEditing(true);
              }}>Edit</Button>
              <DeleteButton onClick={() => deleteCity(city.id)}>Delete</DeleteButton>
            </div>
          </DataItem>
        ))}
      </DataList>
      {isCityEditing && (
        <EditFormContainer>
          <EditForm onSubmit={() => updateCity({ id: cities.find(city => city.name === cityName).id, name: cityName })}>
            <EditInput
              type="text"
              placeholder="City"
              value={cityName}
              onChange={handleCityChange}
            />
            <div>
              <EditButton type="submit">Save</EditButton>
              <CancelButton type="button" onClick={() => setIsCityEditing(false)}>Cancel</CancelButton>
            </div>
          </EditForm>
        </EditFormContainer>
      )}
    </CityFormContainer>
  );

  return (
    <Container>
      <h1>IndexedDB React Component</h1>
      <LinkButton onClick={() => setView('people')}>Manage People</LinkButton>
      <LinkButton onClick={() => setView('cities')}>Manage Cities</LinkButton>
      {view === 'people' ? renderPeopleView() : renderCitiesView()}
    </Container>
  );
};

export default IndexedDBComponent;
