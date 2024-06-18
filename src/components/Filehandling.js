import React, { useState } from 'react';

const HandleFile = () => {
  const [data, setData] = useState(null);


  
  const handleFileChange = (event) => {
  
    const file = event.target.files[0];
    console.log(event.target);
    alert(event.target); //TEMP
    if (file) {
    
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          setData(json);

          console.log(e.target); //TEMP
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
   

  };


  const updateJsonData = (newData) => {
    setData(newData);
  };

  const saveToFile = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated_file.json';
    a.click();
    URL.revokeObjectURL(url);
    alert(url);
  };

  const handleUpdate = () => {
    const newData = { ...data, updated: true }; // Muokkaa tätä haluamallasi tavalla
    updateJsonData(newData);
  };

  const handleSave = () => {
    if (data) {
      saveToFile(data);
    }
  };

  return (
    <div>
      <h1>Load and Update JSON File</h1>

      <input type="file" accept=".json" onChange={handleFileChange} />
      
      {data ? (
        <div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <button onClick={handleUpdate}>Update JSON</button>
          <button onClick={handleSave}>Save JSON</button>
        </div>
      ) : (
        <p>No data loaded</p>
      )}

    </div>
  );
};

export default HandleFile;
