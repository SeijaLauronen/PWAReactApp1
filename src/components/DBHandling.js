import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Form = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  margin-right: 10px;
  padding: 5px;
`;

const Button = styled.button`
  margin-right: 10px;
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

const EditButton = styled.button`
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #2196F3;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0b7dda;
  }
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #da190b;
  }
`;

const IndexedDBComponent = () => {
  const [db, setDb] = useState(null);
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const request = indexedDB.open('MyDatabase', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore('MyObjectStore', { keyPath: 'id' });
      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('email', 'email', { unique: true });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      setDb(db);
      fetchData(db);
    };

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
    };
  }, []);

  const fetchData = (dbInstance) => {
    const transaction = dbInstance.transaction(['MyObjectStore'], 'readonly');
    const objectStore = transaction.objectStore('MyObjectStore');
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      setData(event.target.result);
    };

    request.onerror = (event) => {
      console.error('Fetch request error:', event.target.errorCode);
    };
  };

  const addData = (data) => {
    const transaction = db.transaction(['MyObjectStore'], 'readwrite');
    const objectStore = transaction.objectStore('MyObjectStore');
    const request = objectStore.add(data);

    request.onsuccess = () => {
      fetchData(db);
    };

    request.onerror = (event) => {
      console.error('Add request error:', event.target.errorCode);
    };
  };

  const updateData = (data) => {
    const transaction = db.transaction(['MyObjectStore'], 'readwrite');
    const objectStore = transaction.objectStore('MyObjectStore');
    const request = objectStore.put(data);

    request.onsuccess = () => {
      fetchData(db);
    };

    request.onerror = (event) => {
      console.error('Update request error:', event.target.errorCode);
    };
  };

  const deleteData = (key) => {
    const transaction = db.transaction(['MyObjectStore'], 'readwrite');
    const objectStore = transaction.objectStore('MyObjectStore');
    const request = objectStore.delete(key);

    request.onsuccess = () => {
      fetchData(db);
    };

    request.onerror = (event) => {
      console.error('Delete request error:', event.target.errorCode);
    };
  };

  const handleAddData = () => {
    const id = data.length ? data[data.length - 1].id + 1 : 1; // Generate new ID
    addData({ id, name, email });
    setName('');
    setEmail('');
  };

  const handleUpdateData = (id) => {
    const updatedName = prompt('Enter new name:', name);
    const updatedEmail = prompt('Enter new email:', email);
    if (updatedName && updatedEmail) {
      updateData({ id, name: updatedName, email: updatedEmail });
    }
  };

  return (
    <Container>
      <h1>IndexedDB React Component</h1>
      <Form>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleAddData}>Add Data</Button>
      </Form>
      <DataList>
        {data.map((item) => (
          <DataItem key={item.id}>
            <div>
              <DataText>ID: {item.id}</DataText>
              <DataText>Name: {item.name}</DataText>
              <DataText>Email: {item.email}</DataText>
            </div>
            <div>
              <EditButton onClick={() => handleUpdateData(item.id)}>Edit</EditButton>
              <DeleteButton onClick={() => deleteData(item.id)}>Delete</DeleteButton>
            </div>
          </DataItem>
        ))}
      </DataList>
    </Container>
  );
};

export default IndexedDBComponent;
