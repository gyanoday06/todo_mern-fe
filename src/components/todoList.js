import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { baseURL } from '../utils/constant';

const TodoList = (props) => {
  const [isChecked, setIsChecked] = useState(props.isChecked);
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false); // Added state for expansion
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
  
    axios
      .put(`${baseURL}/update/${props.id}`, { toDo: editedText, isChecked: !isChecked })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
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
        // Update local state and UI
        setIsEditing(false);
        props.setUpdateUI((prevState) => !prevState);
      })
      .catch((err) => console.log(err));
  };

  const handleDropdownClick = () => {
    setExpanded(!expanded);
  };

  const unexpanded_text = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }
  const expanded_text = {
    overflow: 'none',
    whiteSpace: 'wrap',
  }

  return (
    <div className={`toDo ${isChecked ? 'checked' : ''} ${isEditing ? 'editing' : ''} ${expanded ? 'expanded' : ''}`}>
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
          <textarea
            ref={inputRef}
            className='editing-field'
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        ) : (
          <p htmlFor={`checkbox-${props.id}`} onClick={(e) => e.stopPropagation()} style={expanded ? expanded_text : unexpanded_text}>
            {props.text}
          </p>
        )}
      </div>
      {/* Right Icons */}
      <div className='right-icons'>
        <span className="material-symbols-outlined" onClick={handleDropdownClick} style={expanded ? {margin: '0 -10px 15px 1px'} : {margin: '0'}}>
          {expanded ? 'expand_less' : 'expand_more'}
        </span>
        {expanded && (
          <div className='rightex--icons'>
            {isEditing ? (
              <i className="fa-solid fa-check" onClick={handleUpdateClick}></i>
            ) : (
              <i className="fa-solid fa-pen-to-square" onClick={handleEditClick}></i>
            )}
            <i className="fa-solid fa-remove" onClick={deleteTodo} style={{marginLeft: '0.6rem'}}></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;