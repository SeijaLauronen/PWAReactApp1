import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
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
  align-items: center;
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
  width: 80%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EditInput = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  width: calc(100% - 20px);
`;

const EditButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  cursor: pointer;
`;

const CancelButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
`;

// Database operations and component
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

const fetchData = (dbInstance, setData) => {
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

const PeopleView = () => {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editFormData, setEditFormData] = useState({
    id: null,
    name: '',
    email: '',
    city: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    openDatabase().then((dbInstance) => {
      db = dbInstance;
      fetchData(db, setData);
    }).catch((error) => {
      console.error('Error opening database:', error);
    });
  }, []);

  const addData = (e) => {
    e.preventDefault();
    if (!inputValue) return;
    const transaction = db.transaction(['PeopleStore'], 'readwrite');
    const objectStore = transaction.objectStore('PeopleStore');
    const request = objectStore.add({
      id: Date.now(),
      name: inputValue,
      email: `${inputValue.toLowerCase()}@example.com`,
      city: 'Unknown'
    });

    request.onsuccess = () => {
      fetchData(db, setData);
      setInputValue('');
    };

    request.onerror = (event) => {
      console.error('Add request error:', event.target.error);
    };
  };

  const deleteData = (id) => {
    const transaction = db.transaction(['PeopleStore'], 'readwrite');
    const objectStore = transaction.objectStore('PeopleStore');
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      fetchData(db, setData);
      cancelEdit();
    };

    request.onerror = (event) => {
      console.error('Delete request error:', event.target.error);
    };
  };

  const updateData = () => {
    const transaction = db.transaction(['PeopleStore'], 'readwrite');
    const objectStore = transaction.objectStore('PeopleStore');
    const request = objectStore.put(editFormData);

    request.onsuccess = () => {
      fetchData(db, setData);
      cancelEdit();
    };

    request.onerror = (event) => {
      console.error('Update request error:', event.target.error);
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

  const handleDeleteData = () => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      deleteData(editFormData.id);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const cancelEdit = () => {
    setEditFormData({ id: null, name: '', email: '', city: '' });
    setIsEditing(false);
  };

  return (
    <Container>
      <h2>People</h2>
      <Form onSubmit={addData}>
        <Input
          type="text"
          placeholder="Add a person or filter by name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="submit">Add Person</Button>
      </Form>
      <DataList>
        {data.map((item) => (
          <DataItem key={item.id}>
            <div>
              <DataText>Name: {item.name}</DataText>
              <DataText>Email: {item.email}</DataText>
              <DataText>City: {item.city}</DataText>
            </div>
            <div>
              <Button onClick={() => handleEditData(item)}>Edit</Button>
            </div>
          </DataItem>
        ))}
      </DataList>
      {isEditing && (
        <EditFormContainer>
          <EditForm onSubmit={(e) => {
            e.preventDefault();
            updateData();
          }}>
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
              <EditButton type="submit">Update</EditButton>
              <CancelButton type="button" onClick={cancelEdit}>Cancel</CancelButton>
              <DeleteButton type="button" onClick={handleDeleteData}>Delete</DeleteButton>
            </div>
          </EditForm>
        </EditFormContainer>
      )}
    </Container>
  );
};

export default PeopleView;
