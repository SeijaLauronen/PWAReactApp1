import React, { useState, useEffect } from 'react';

const IndexedDBComponent = () => {
  const [db, setDb] = useState(null);
  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState(null);
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

  const getData = (key) => {
    const transaction = db.transaction(['MyObjectStore']);
    const objectStore = transaction.objectStore('MyObjectStore');
    const request = objectStore.get(key);

    request.onsuccess = (event) => {
      if (request.result) {
        setSingleData(request.result);
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

  return (
    <div>
      <h1>IndexedDB React Component</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleAddData}>Add Data</button>
      </div>
      <button onClick={() => getData(1)}>Get Data 1</button>
      <button onClick={() => updateData({ id: 1, name, email })}>Update Data</button>
      <button onClick={() => deleteData(1)}>Delete Data</button>

      <h2>All Data:</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            ID: {item.id}, Name: {item.name}, Email: {item.email}
          </li>
        ))}
      </ul>

      {singleData && (
        <div>
          <h2>Retrieved Data:</h2>
          <p>ID: {singleData.id}</p>
          <p>Name: {singleData.name}</p>
          <p>Email: {singleData.email}</p>
        </div>
      )}
    </div>
  );
};

export default IndexedDBComponent;
