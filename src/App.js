import { useState } from 'react';
import './App.css';
import Field from './components/Field';
import Header from './components/Header';

function App() {

  const [element, setElement] = useState("Rabbit");

  return (
    <div className="App">
        <Header setElement={setElement}/>
        <Field element={element}/>
    </div>
  );
}

export default App;
