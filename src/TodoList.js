import './App.css';
import React from 'react';

function TodoList({tasks, createTask, toggleCompleted}) {
    const [errorMessage, setErrorMessage] = React.useState('')
    const [id, setId] = React.useState('')
    const task = React.useRef();
    const uniqueId = React.useRef();

    const handleIdChange = (event) => {
        setId(event.target.value)
        setErrorMessage('')
    }
    const handleTodoListSubmit = (event) => {
        event.preventDefault()
        const idExist = tasks.filter(el => el.uniqueId === uniqueId.current.value)
        if(idExist.length) {
            setErrorMessage('Id should be unique')
        } else {
            setErrorMessage('')
            createTask(task.current.value, uniqueId.current.value)
        }
        
    }
    const handleInputClick = (event) => {
        toggleCompleted(event.target.name)
    }
    return (
        <div id="content">
            <form onSubmit={(event) => handleTodoListSubmit(event)}>
                <span className="userName">Name: </span>
                <input
                    id="newTask"
                    ref={task} 
                    ype="text"
                    className="form-control"
                    placeholder="Add New Name..."
                    style={{marginBottom:'15px'}}
                    required 
                />
                <span className="userName">ID Number: </span>
                <input
                    id="newTask"
                    ref={uniqueId} 
                    ype="text"
                    className="form-control"
                    placeholder="Add Unique Id..."
                    style={{marginBottom:'15px'}}
                    value={id}
                    onChange={(event) => handleIdChange(event)}
                    required 
                />
                <p style={{color:'red'}}>{errorMessage}</p>
                <input type="submit" />
            </form>
            <ul id="taskList" className="list-unstyled">
                {tasks.map((task, key) => {
                    return (
                        <div className="taskTemplate" className="checkbox" key={key}>
                            <label>
                                <input
                                    type="checkbox"
                                    defaultChecked={task.completed}
                                    name={task.id}
                                    onClick={(event) => handleInputClick(event)}
                                    style={{marginRight:'10px'}}
                                />
                                <span className="content" style={{marginRight:'10px'}}>{task.content}</span>
                                <span className="uniqueId">{task.uniqueId}</span>
                            </label>
                        </div>
                    )
                })}
            </ul>
            <ul id="completedTaskList" className="list-unstyled">
            </ul>
        </div>
    );
}

export default TodoList;
