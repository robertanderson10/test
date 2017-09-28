
class TurtleGame extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
         board: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
         size: 5,
         inputValue: ''
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({inputValue: event.target.value});
    }
  
    place(){
      alert('place command selected');
    }

    move(){
      alert('move command selected');
    }

    left(){
      // rotate the turtle graphic to the left
      this.state.rotateCss = 'transform: rotate(90deg)';
    }

    right(){
      // rotate the turtle graphic to the right
      this.state.rotateCss = 'transform: rotate(180deg)';
    }

    report(){
      console.log('The turtle position is:');
    }

    handleSubmit(event) {

      // this is where the logic happens to process the commands
      let command = this.state.inputValue.toLowerCase();
     
      if(command !== undefined && command !== ''){
        if(command.indexOf('place')>-1){
          this.place();
        } else if(command.indexOf('move')>-1){
          this.move();
        } else if(command.indexOf('left')>-1){
          this.left();
        } else if(command.indexOf('right')>-1){
          this.right();
        } else if(command.indexOf('report')>-1){
          this.report();
        } else {
          alert('Please type a command');
          return;
        }
      }

      event.preventDefault();

    }

    newGame(size) {
      let board = new Array(size * size);
      for (let i = 0; i < size * size; ++i) board[i] = i;
      this.updateBoard(board, size);
      this.setState({ size: size });
    }

    updateBoard(board, size) {
      this.setState({ board: board });
    }
    
    render() {

      return (
        <div className='turtle-grid text-center'>
          <div className="row text-center">
            <h1>Turtle in the Pond</h1>
          </div>
          
          <form onSubmit={this.handleSubmit}>
            <input className="command-input" placeholder="Enter command"
              value={this.state.inputValue} onChange={this.handleChange}></input>
            <input className="turtle-button" type="submit" value="GO" />
          </form>

          {
            this.state && this.state.board ? 
              <Board size={this.state.size}
               board={this.state.board}
               updateBoard={this.updateBoard.bind(this)}/>
              : null
          }
        </div>
      );
    }
  }
  
  class Board extends React.Component {
    componentWillMount() {
      this.findClickables(this.props.board, this.props.size);
    }
    componentWillReceiveProps(nextProps) {
      this.findClickables(nextProps.board, nextProps.size);
    }
    shouldComponentUpdate(nextProps) {
      const curr = this.props.board.join('');
      const next = nextProps.board.join('');
      return curr !== next;
    }
   
    // ensure that the turtle can only move to the adjacent tile if clicked
    findClickables(board, size) {
      const zeroIndex = board.indexOf(0);
      const zeroCoordinate = this.getCoordFromIndex(zeroIndex, size);
      const possibleTopIdx = zeroCoordinate.row > 0 ? this.getIndexFromCoord(zeroCoordinate.row - 1, zeroCoordinate.column, size) : null;
      const possiblRightIdx = zeroCoordinate.column < size ? this.getIndexFromCoord(zeroCoordinate.row, zeroCoordinate.column + 1, size) : null;
      const possiblBottomIdx = zeroCoordinate.row < size ? this.getIndexFromCoord(zeroCoordinate.row + 1, zeroCoordinate.column, size) : null;
      const possibleLeftIdx = zeroCoordinate.column > 0 ? this.getIndexFromCoord(zeroCoordinate.row, zeroCoordinate.column - 1, size) : null;
  
      this.setState({ 
        zero: zeroIndex, 
        possibleTopIdx: possibleTopIdx, 
        possiblRightIdx: possiblRightIdx,
        possiblBottomIdx: possiblBottomIdx,
        possibleLeftIdx: possibleLeftIdx,
        rotateCss: ''
      });
    }
    getCoordFromIndex(idx, size) {
      return {row: Math.floor(idx / size) + 1, column: (idx % size) + 1};
    }
    getIndexFromCoord(row, col, size) {
      return (size * (row - 1)) + col - 1; 
    }
    cellClickHandler(index) {
      if (index === this.state.possibleTopIdx || index === this.state.possiblRightIdx || 
          index === this.state.possiblBottomIdx || index === this.state.possibleLeftIdx) this.nextBoard(index);
    }
    keyPressHandler(index) {
      if (index === this.state.possibleTopIdx || index === this.state.possiblRightIdx || 
          index === this.state.possiblBottomIdx || index === this.state.possibleLeftIdx)
          this.nextBoard(index + 1);
    }
    nextBoard(index, direction) {
      const board = this.props.board.slice();
      const temp = board[index];
      board[index] = board[this.state.zero];
      board[this.state.zero] = temp;
      this.props.updateBoard(board);
    }

    render() {
      const squares = this.props.board.map((val, index) => {
        if ((index + 1) % this.props.size === 0) {
          return (
            <span>
              {<Cell value={val}
               clickHandler={this.cellClickHandler.bind(this, index)} 
               keyPressHandler={this.keyPressHandler.bind(this, index)}/>}
              <br />
            </span>
          );
        }
        return <Cell value={val} clickHandler={this.cellClickHandler.bind(this, index)}
          keyPressHandler={this.keyPressHandler.bind(this, index)} />;
      });
      return (
        <div className='board'> 
          {squares}
        </div>
      );
    }
  }
  
  class Cell extends React.Component {
    render() {
      const turtleCell = this.props.value === 0 ? 'square turtle-square' : 'square';
      const turtleStyle = this.props.rotateCss;
      return (
        <span style={turtleStyle} className={turtleCell}
         onClick={() => this.props.clickHandler()}
         onKeyPress={() => this.props.keyPressHandler()}></span>
      );
    }
  }
  
  ReactDOM.render(<TurtleGame />, document.getElementById('turtleApp'));