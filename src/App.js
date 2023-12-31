// App.js
import React, { useState, useEffect } from 'react';
import axios from "axios"

import { baseURL } from "./utils/constant"

import TodoList from "./components/todoList"

import darkBackground from './assets/dark-background-min.jpg';
import lightBackground from './assets/light-background-min.jpg';

import './App.css';

const App = () => {
  const [mode, setMode] = useState("dark");
  const [todo, setTodo] = useState([]);
  const [input, setInput] = useState("");
  const [updateUI, setUpdateUI] = useState(false);

  function changeMode() {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }

  const backgroundImage = mode === 'dark' ? `url(${darkBackground})` : `url(${lightBackground})`;

  // To fetch the data from MongoDB
  useEffect(() => {
    axios
      .get(`${baseURL}/get`)
      .then((res) => setTodo(res.data))
      .catch((err) => console.log(err));
  }, [updateUI]);

  const saveToDo = () => {
    axios
      .post(`${baseURL}/save`, { toDo: input })
      .then((res) => {
        console.log(res.data);
        setUpdateUI((prevState) => !prevState);
        setInput("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='background' style={{
      backgroundColor: mode === 'dark' ? '#0d0c38' : '#b6e3e5',
      height: '100vh',
      color: '#fff',
      transition: 'background-color 0.4s ease-in-out',
    }}>
      <div className='body' data-mode={mode} style={{
        backgroundImage: backgroundImage,
        zIndex: '11111',
        transition: 'background-image 0.4s ease-in-out',
      }}>

        <main className='webpage' >
          <div className='container'>
            <div className='top'>
              <h1 className='title'>T O D O</h1>
              <span className="material-symbols-outlined" onClick={changeMode}>
                {mode === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </div>
            <div className="input_holder">
              <input
                className='input-field'
                type="text"
                placeholder='Add a Task...'
                value={input}
                onChange={(e) => {
                  if (e.target.value.length <= 200) {
                    setInput(e.target.value);
                  }
                }}
              />
              <button onClick={saveToDo}>Add</button>
            </div>
            <div className="list">
              {
                todo.map(ele => (
                  <TodoList
                    key={ele._id}
                    id={ele._id}
                    text={ele.toDo}
                    isChecked={ele.isChecked}
                    setUpdateUI={setUpdateUI}
                  />
                ))
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
