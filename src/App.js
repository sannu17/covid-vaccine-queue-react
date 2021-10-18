import './App.css';
import Web3 from 'web3';
import React from 'react';
import { TODO_LIST_ADDRESS, TODO_LIST_ABI } from './config'
import TodoList from './TodoList'

function App() {
  const [account, setAccount] = React.useState(null)
  const [todoList, setTodoList] = React.useState([])
  const [taskCount, setTaskCount] = React.useState(0)
  const [tasks, setTasks] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  async function loadBlockchainData() {
    const ethereum = window.ethereum;
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const network = await web3.eth.net.getNetworkType()
    const web3Instance = new Web3(ethereum);
    // const enabledWeb3 = await ethereum.enable();
    const account = await web3Instance.eth.getAccounts();
    const accountAddress = await account[0];
    setAccount(accountAddress)
    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS)
    setTodoList( todoList )
    const taskCount = await todoList.methods.taskCount().call()
    setTaskCount(taskCount)
    const taskList = []
    for (var i = 1; i <= taskCount; i++) {
      const task = await todoList.methods.tasks(i).call()
      taskList.push(task)
      setTasks(taskList)
    }
    setLoading(false)
  }

  function refreshPage(){ 
    window.location.reload(); 
  }

  function createTask(content, uniqueId) {
    setLoading(true)
    todoList.methods.createTask(content, uniqueId).send({from: account})
    .once('receipt', (_receipt) => {
      setLoading(false)
      refreshPage()
    })
  }

  function toggleCompleted(taskId) {
    setLoading(true)
    todoList.methods.toggleCompleted(taskId).send({from: account})
    .once('receipt', (_receipt) => {
      setLoading(false)
      refreshPage()
    })
  }

  React.useEffect(() => {
    loadBlockchainData()
  }, [])
  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="https://github.com/sannu17" target="_blank">Covid-19 Vaccination Registration | People List</a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small><a className="nav-link" href="#"><span id="account"></span></a></small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex justify-content-center">
            {loading ? (
              <div id="loader" className="text-center">
                <p className="text-center">Loading...</p>
              </div>
            ) : (
              <TodoList tasks={tasks} createTask={createTask} toggleCompleted={toggleCompleted}/>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
