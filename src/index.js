import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//     render() {
//       return (
//         <button
//           className="square"
//           onClick={() => {this.props.onClick()}}
//         >
//           {this.props.value}
//         </button>
//       );
//     }
//   }

  function Square(props) {
    return(
      <button className="square" onClick = {props.onClick}>
        {props.value}
      </button>
    )
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)}  
        />
      )
    }

    render() {
      // Declaramos la variable vacía
      let squares = [];

      // Primer bucle que crea las tres filas
      for (let i = 0; i < 3; ++i) {
        let row = [];

        // para cada fila, este bucle crea las tres columnas
        for (let j = 0; j < 3; ++j) {
          row.push(this.renderSquare(i *3 +j));
        }
        squares.push(<div key={i} className="board-row">{row}</div>);
      }

      return (
        <div>{squares}</div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          position: [0,0],
          player: 'x',
        }],
        stepNumber: 0,
        xIsNext: true,
        orderASC: true,
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const position = [parseInt(i%3), parseInt(i/3)];

      if (calculateWinner(squares) || squares[i]) {
        return;
      }  
      squares[i] = this.state.xIsNext ? 'x' : 'o';
      this.setState({
        history: history.concat([{
          squares: squares,
          position: position,
          player: this.state.xIsNext ? 'x' : 'o',
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    switchButton() {
      this.state.orderASC === true ? this.setState({orderASC: false}) :  this.setState({orderASC: true});
    }

    setStyle (move, winner, currentPlayer, stepNumber) {
      let styles = {}
      let firstStyle;
      let secondStyle;
      console.log(currentPlayer);
      if(stepNumber === move){
        firstStyle = {
          fontWeight: 'bold',
        }
      } else {
        firstStyle = {
          fontWeight: 'normal',
        }
      }
      styles = Object.assign(styles,firstStyle)
      if (currentPlayer === winner){
        
        secondStyle = {
          color: 'red',
        }
      } else {
        secondStyle = {
          color: 'black',
        }
      }
      styles = Object.assign(styles,secondStyle)

      return styles
    }
    
    render() {
      let history = this.state.history;
      let history2;
      if(! this.state.orderASC) {
        history2 = [...history].reverse();
      } else {
        history2 = [...history];
      }
      const stepNumber = this.state.stepNumber;
      const current = history[stepNumber];
      const winner = calculateWinner(current.squares);
      const length = history.length;
      const moves = history2.map((step, move) => {
        if(! this.state.orderASC) {
          move = Math.abs(move + 1 - length);
        }
        console.log(step);
        const sytle = this.setStyle(move, winner, step.player, stepNumber);
        const desc = move ?
          'Go to move #' + move + ' click in position (column,row): ' + step.position :
          'Go to game start';

          
        return (
          <li key={move}>
            <button
              className = {this.state.xIsNext ? 'o' : 'x'}
              style={sytle}
              onClick={() => this.jumpTo(move)}>{desc}
            </button>
          </li>
        );
      });

      let status;
      if(winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'x' : 'o');
      }
      let buttonText = 'Switch order';
      let button =
      <button onClick={(i) => this.switchButton(i)}>
          {buttonText}
      </button>

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            {button}
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  