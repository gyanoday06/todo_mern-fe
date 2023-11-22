import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { baseURL } from '../utils/constant';

const TodoList = (props) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(props.text);

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(editedText.length, editedText.length);
    }
  }, [isEditing, editedText.length]);

  const deleteTodo = () => {
    axios
      .delete(`${baseURL}/delete/${props.id}`)
      .then((res) => {
        console.log(res.data);
        props.setupdateUI((prevState) => !prevState);
      })
      .catch((err) => console.log(err));
  };

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = () => {
    // Update the backend with the edited text
    axios
      .put(`${baseURL}/update/${props.id}`, { toDo: editedText })
      .then((res) => {
        console.log(res.data);
        props.setupdateUI((prevState) => !prevState);
        setIsEditing(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={`toDo ${isChecked ? 'checked' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="form-check d-flex left">
        <input
          className="form-check-input checkbox"
          type="checkbox"
          value=""
          id={`checkbox-${props.id}`}
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        {isEditing ? (
          <input
            ref={inputRef}
            className='editing-field'
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        ) : (
          <p htmlFor={`checkbox-${props.id}`} onClick={(e) => e.stopPropagation()}>
            {props.text}
          </p>
        )}
      </div>
      <div>
        {isEditing ? (
          <i className="fa-solid fa-check" onClick={handleUpdateClick}></i>
        ) : (
          <i className="fa-solid fa-pen-to-square" onClick={handleEditClick}></i>
        )}
        <i className="fa-solid fa-remove" onClick={deleteTodo}></i>
      </div>
    </div>
  );
};

export default TodoList;
