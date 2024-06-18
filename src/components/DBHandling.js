import React, { useState, useEffect } from 'react';

const IndexedDBComponent = () => {
    
  const [db, setDb] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const request = indexedDB.open('MyDatabase', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore('MyObjectStore', { keyPath: 'id' });
      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('email', 'email', { unique: true });
    };

    request.onsuccess = (event) => {
      setDb(event.target.result);
    };

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
    };
  }, []);

  const addData = (data) => {
    const transaction = db.transaction(['MyObjectStore'], 'readwrite');
    const objectStore = transaction.objectStore('MyObjectStore');
    const request = objectStore.add(data);

    request.onsuccess = () => {
      console.log('Data added to the database');
    };

    request.onerror = (event) => {
      console.error('Add request error:', event.target.errorCode);
    };
  };

  const getData = (key) => {
    const transaction = db.transaction(['MyObjectStore']);
    const objectStore = transaction.objectStore('MyObjectStore');
    const request = objectStore.get(key);

    request.onsuccess = (event) => {
      if (request.result) {
        setData(request.result);
      } else {
        console.log('No data found for the key');
      }
    };

    request.onerror = (event) => {
      console.error('Get request error:', event.target.errorCode);
    };
  };

  const updateData = (data) => {
    const transaction = db.transaction(['MyObjectStore'], 'readwrite');
    const objectStore = transaction.objectStore('MyObjectStore');
    const request = objectStore.put(data);

    request.onsuccess = () => {
      console.log('Data updated in the database');
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
      console.log('Data deleted from the database');
    };

    request.onerror = (event) => {
      console.error('Delete request error:', event.target.errorCode);
    };
  };

  return (
    <div>
      <h1>IndexedDB React Component</h1>
      <button onClick={() => addData({ id: 1, name: 'John Doe', email: 'john.doe@example.com' })}>Add Data</button>
      <button onClick={() => getData(1)}>Get Data</button>
      <button onClick={() => updateData({ id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' })}>Update Data</button>
      <button onClick={() => deleteData(1)}>Delete Data</button>
      {data && (
        <div>
          <h2>Retrieved Data:</h2>
          <p>ID: {data.id}</p>
          <p>Name: {data.name}</p>
          <p>Email: {data.email}</p>
        </div>
      )}
    </div>
  );
};

export default IndexedDBComponent;
