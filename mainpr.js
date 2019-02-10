'use strict';

let my_tasks = [
  {
    name: 'Бытовые дела',
    text: 'Почистить картошку'
  },
  {
    name: 'Магазин',
    text: 'Купить салфетки' 
  }
];

window.ee = new EventEmitter();

const Proper = React.createClass ({
  propTypes: {
      data: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        text: React.PropTypes.string.isRequired
    })
  },

  render: function() {
    let name = this.props.data.name,
        text = this.props.data.text;
        
    return (
      <div className="proper">
          <p className="task_name">{name}</p>
          <p className="task_text">{text}</p>
      </div>
    );
  }
});

const Task = React.createClass ({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },

   getInitialState: function() {
    return {
      counter: 0
    }
  },

  render: function() {
    let data = this.props.data;
    let main;

     if (data.length > 0) {
      main = data.map(function(item, index) {
      return (
        <div key={index}>
          <Proper data={item} />
        </div>
        )
    })
  }

    return (
      <div className="taskclass">
      {main}
      </div>
      );
  }
});

var Add = React.createClass ({
  getInitialState: function() {
    return {
      nameIsEmpty: true,
      textIsEmpty: true
    };
  },
  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.name).focus();
  },

  onBtnClick: function (e) {
    e.preventDefault();
    let textEl = ReactDOM.findDOMNode(this.refs.text);
    let name = ReactDOM.findDOMNode(this.refs.name).value;
    let text = textEl.value;

    var item = [{
      name: name,
      text: text
    }];

    window.ee.emit('Task.add', item);

    textEl.value = '';
    this.setState({textIsEmpty: true});
  },

   onFieldChange: function(fieldName, e) {
    if (e.target.value.trim().length > 0) {
      this.setState({[''+fieldName]:false})
    } else {
      this.setState({[''+fieldName]:true})
    }
  },

  render: function() {
   let nameIsEmpty = this.state.nameIsEmpty,
       textIsEmpty = this.state.textIsEmpty;
    
    return (
        <form className="add">
          <input
            type='text'
            className='add_name'
            onChange={this.onFieldChange.bind(this, 'nameIsEmpty')}
            placeholder='Название'
            ref='name'
          />
          <textarea
            className='test_input'
            onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
            placeholder='введите значение'
            ref='text'>
          </textarea>
          <button 
            onClick={this.onBtnClick}>Добавить задачу
          </button>
        </form>
    );
  }
});

const App = React.createClass ({
   getInitialState: function() {
    return {
      tasks: my_tasks
    };
  },
  componentDidMount: function() {
      let self = this;
      window.ee.addListener('Task.add', function(item) {
      let nextNews = item.concat(self.state.tasks);
      self.setState({tasks: nextNews});
    });
  },
  componentWillUnmount: function() {
    window.ee.removeListener('Task.add');
  },

  render: function() {
    return (
      <div className="appclass">
        <h3>ЗАДАЧИ</h3>
        <Add />
        <Task data={this.state.tasks} />
      </div>
      );
  }
});

ReactDOM.render (
<App />,
document.getElementById('root')
);

