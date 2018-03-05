import React, { Component } from 'react';
import T from 'prop-types'
import shallow from 'shallowequal'

function TodosCount ({ count }) {
  return count;
}

function Inject (Wrapped) {
  class Injector extends Component {
    render() {
      return <Wrapped {...this.props} deleteTodo={this.context.deleteTodo}/>
    }
  }

  Injector.contextTypes = {
    deleteTodo: T.func.isRequired,
  }

  return Injector
}

function InjectComplete (Wrapped) {
  class Injector extends Component {
    render() {
      return <Wrapped {...this.props} toggleTodo={this.context.toggleTodo}/>
    }
  }

  Injector.contextTypes = {
    toggleTodo: T.func.isRequired,
  }

  return Injector
}

function Todo ({ todo, deleteTodo, toggleTodo }) {
  return (
    <div>
      <span style={{color: todo.completed ? 'red' : 'black'}} >{todo.text}</span>
      { deleteTodo && <span onClick={deleteTodo(todo.id)}> Delete </span> }
      { toggleTodo && <span onClick={toggleTodo(todo.id)}> Toggle </span> }
    </div>
  )
}

const DeletableTodo = Inject(Todo)
const CompletableTodo = InjectComplete(Todo)

class DeletableTodos extends Component {
  render() {
    return this.props.todos.map((todo) => {
      return <DeletableTodo key={todo.id} todo={todo} />
    })
  }
}

class CompletableTodos extends Component {
  render() {
    return this.props.todos.map((todo) => {
      return <CompletableTodo key={todo.id} todo={todo} />
    })
  }
}

class App extends Component {
  state = {
    todos: [
      {text: 'tes', id: 0},
      {text: 'rwerewr', id: 1},
    ]
  }
  getChildContext() {
    return {
      deleteTodo: this.deleteTodo,
      toggleTodo: this.toggleTodo,
    }
  }
  deleteTodo = (id) => {
    return () => {
      this.setState({
        todos: this.state.todos.filter(todo => id !== todo.id)
      })
    }
  }
  toggleTodo = id => () => {
    this.setState({
      todos: this.state.todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed
          }
        }
        return todo
      })
    })
  }
  render() {
    return (
      <div>
        <DeletableTodos todos={this.state.todos} />
        <CompletableTodos todos={this.state.todos} />
        <TodosCount count={this.state.todos.length}/>
      </div>
    );
  }
}

App.childContextTypes = {
  deleteTodo: T.func,
  toggleTodo: T.func,
}

export default App;
