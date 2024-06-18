import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Form = styled.div`
  display: flex;
  justify-content: space-between;
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

const IndexedDBComponent = () => {
  const [db, setDb] = useState(null);
  const [data, setData] = useState([]);
  const [editFormData, setEditFormData] = useState({
    id: null,
    name: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);

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

  const addData = () => {
    const transaction = db.transaction(['MyObjectStore'], 'readwrite');
    const objectStore = transaction.objectStore('MyObjectStore');

    const id = data.length ? data[data.length - 1].id + 1 : 1;

    const newData = { id, name: editFormData.name, email: editFormData.email };

    const request = objectStore.add(newData);

    request.onsuccess = () => {
      fetchData(db);
      setEditFormData({ id: null, name: '', email: '' });
    };

    request.onerror = (event) => {
      console.error('Add request error:', event.target.errorCode);
    };
  };

  const updateData = () => {
    const transaction = db.transaction(['MyObjectStore'], 'readwrite');
    const objectStore = transaction.objectStore('MyObjectStore');
    const request = objectStore.put(editFormData);

    request.onsuccess = () => {
      fetchData(db);
      setEditFormData({ id: null, name: '', email: '' });
      setIsEditing(false);
    };

    request.onerror = (event) => {
      console.error('Update request error:', event.target.errorCode);
    };
  };

  const handleEditData = (item) => {
    setEditFormData({
      id: item.id,
      name: item.name,
      email: item.email
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

  const cancelEdit = () => {
    setEditFormData({ id: null, name: '', email: '' });
    setIsEditing(false);
  };

  const deleteData = (id) => {
    const transaction = db.transaction(['MyObjectStore'], 'readwrite');
    const objectStore = transaction.objectStore('MyObjectStore');
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      fetchData(db);
      setEditFormData({ id: null, name: '', email: '' });
      setIsEditing(false);
    };

    request.onerror = (event) => {
      console.error('Delete request error:', event.target.errorCode);
    };
  };

  /*
  const filteredDataXYZ = data.filter(item =>
    item.name.toLowerCase().includes(editFormData.name.toLowerCase())
  );
 */
  const filteredData = data.filter(item => {
    const isIncluded = item.name.toLowerCase().includes(editFormData.name.toLowerCase());
    console.log(`Item ${item.id} (${item.name}): ${isIncluded ? 'included' : 'excluded'}`);
    return isIncluded;
});



  return (
    <Container>
      <h1>IndexedDB React Component</h1>
      <Form>
        <Input
          type="text"
          placeholder="Enter Name"
          value={editFormData.name}
          onChange={handleInputChange}
          name="name"
        />
        <Button onClick={addData}>Add Data</Button>
      </Form>
      {isEditing && (
        <EditFormContainer>
          <EditForm onSubmit={(e) => { e.preventDefault(); updateData(); }}>
            <EditInput
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
            <EditInput
              type="email"
              name="email"
              value={editFormData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
            <EditButton type="submit">Save</EditButton>
            <CancelButton type="button" onClick={cancelEdit}>Cancel</CancelButton>
            <DeleteButton onClick={() => deleteData(editFormData.id)}>Delete</DeleteButton>
          </EditForm>
        </EditFormContainer>
      )}
      <DataList>
        {filteredData.map((item) => (
          <DataItem key={item.id}>
            <div>
              <DataText>ID: {item.id}</DataText>
              <DataText>Name: {item.name}</DataText>
              <DataText>Email: {item.email}</DataText>
            </div>
            <div>
              <EditButton onClick={() => handleEditData(item)}>Edit</EditButton>
              <DeleteButton onClick={() => deleteData(item.id)}>Delete</DeleteButton>
            </div>
          </DataItem>
        ))}
      </DataList>
    </Container>
  );
};

export default IndexedDBComponent;
