import { useEffect, useState, createRef } from "react";
import "./App.css";
import Game2048 from "./views/game2048";
import GameHeader from "./views/gameHeader";
import { GameStyle, GameHeaderStyle, MengBan } from "./views/gameStyle";
import { uuid } from "./utils";
import { cloneDeep } from "lodash-es";

function App() {
  let [score, setScore] = useState(0);
  let [gameState, setGameState] = useState("init"); // init, playing, gameover
  let [board, setBoard] = useState([]);
  let game2048Ref = createRef();
  /**
   * 开始游戏
   * 1、初始化
   */
  function startGame() {
    init();
  }

  /**
   * 1、初始化分数
   * 2、隐藏gameover
   * 3、初始化格子数组
   * 4、初始化判定合并数组
   */
  function init() {
    setScore(0);
    setGameState("playing");
    let initBoard = new Array();
    for (let i = 0; i < 4; i++) {
      initBoard[i] = new Array();
      for (let j = 0; j < 4; j++) {
        initBoard[i][j] = {
          id: uuid(),
          number: 0,
        };
      }
    }
    // let initBoard = [
    //   [
    //     { id: uuid(), number: 2 },
    //     { id: uuid(), number: 4 },
    //     { id: uuid(), number: 2 },
    //     { id: uuid(), number: 8 },
    //   ],
    //   [
    //     { id: uuid(), number: 64 },
    //     { id: uuid(), number: 32 },
    //     { id: uuid(), number: 8 },
    //     { id: uuid(), number: 4 },
    //   ],
    //   [
    //     { id: uuid(), number: 0 },
    //     { id: uuid(), number: 16 },
    //     { id: uuid(), number: 1024 },
    //     { id: uuid(), number: 2048 },
    //   ],
    //   [
    //     { id: uuid(), number: 4 },
    //     { id: uuid(), number: 32 },
    //     { id: uuid(), number: 8 },
    //     { id: uuid(), number: 4 },
    //   ],
    // ];
    generateTwoNumber(initBoard);
    setBoard(initBoard);
  }

  /**
   * 随机位置生成2个数字2或4的格子
   * 1、随机选择空白位置
   * 2、生成2或4
   */
  function generateTwoNumber(board) {
    let vacancys = nospace(board);
    if (vacancys.length < 2) {
      return false;
    }
    for (let i = 0; i < 2; i++) {
      let index = parseInt(Math.random() * vacancys.length);
      let vacancy = vacancys.splice(index, 1)[0];
      if (Math.random() < 0.5) {
        board[vacancy[0]][vacancy[1]].number = 2;
      } else {
        board[vacancy[0]][vacancy[1]].number = 4;
      }
    }
  }

  /**
   * 随机位置生成1个数字2或4的格子
   */
  function generateOneNumber(board) {
    let vacancys = nospace(board);
    console.log(vacancys);
    if (vacancys.length >= 1) {
      let index = parseInt(Math.random() * vacancys.length);
      let vacancy = vacancys.splice(index, 1)[0];
      if (Math.random() < 0.5) {
        board[vacancy[0]][vacancy[1]].number = 2;
      } else {
        board[vacancy[0]][vacancy[1]].number = 4;
      }
    }
  }

  // 返回空位的横纵坐标
  function nospace(board) {
    let vacancy = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].number === 0) {
          vacancy.push([i, j]);
        }
      }
    }
    return vacancy;
  }

  // 处理键盘事件
  function onKeyDown(event) {
    if (gameState !== "playing") {
      return;
    }
    let isMoveSuccess = false;
    switch (event.keyCode) {
      // 上 w
      case 38:
      case 87:
        isMoveSuccess = keyUp();
        break;
      // 下 s
      case 40:
      case 83:
        isMoveSuccess = keyDown();
        break;
      case 37:
      case 65:
        isMoveSuccess = keyLeft();
        break;
      case 39:
      case 68:
        isMoveSuccess = keyRight();
        break;
      default:
        break;
    }
    if (isMoveSuccess) {
      setBoard((board) => {
        generateOneNumber(board);
        gameOver(board);
        return board;
      });
    }
  }

  /**
   * 向上移动
   * 1、判断是否有元素能够向上移动
   * 2、从上到下依次处理每个符合条件的元素
   *    处理条件：它上方是否存在为0的元素且中间没有障碍物
   * 3、若满足条件，则将该元素坐标替换为0元素所在坐标
   */
  function keyUp() {
    if (!canMoveUp(board)) {
      return false;
    }
    let cloneBoard = cloneDeep(board);
    let added = createEmptyAdded();
    for (let i = 1; i < cloneBoard.length; i++) {
      for (let j = 0; j < cloneBoard[i].length; j++) {
        if (cloneBoard[i][j].number !== 0) {
          for (let k = 0; k < i; k++) {
            if (
              cloneBoard[k][j].number === 0 &&
              !hasVerticalObstacle(j, k, i, cloneBoard)
            ) {
              // showMoveAnimate(i, j, k, j);
              cloneBoard[k][j].number = cloneBoard[i][j].number;
              cloneBoard[i][j].number = 0;
            } else if (
              cloneBoard[k][j].number === cloneBoard[i][j].number &&
              !hasVerticalObstacle(j, k, i, cloneBoard)
            ) {
              // showMoveAnimate(i, j, k, j);
              if (added[k][j] != 0) {
                cloneBoard[k + 1][j].number = cloneBoard[i][j].number;
                cloneBoard[i][j].number = 0;
              } else {
                cloneBoard[k][j].number =
                  cloneBoard[k][j].number + cloneBoard[i][j].number;
                cloneBoard[i][j].number = 0;
                added[k][j] = 1;
                setScore((score) => {
                  score += cloneBoard[k][j].number;
                  return score;
                });
              }
            }
          }
        }
      }
    }
    setBoard(cloneBoard);
    return true;
  }

  function keyDown() {
    if (!canMoveDown(board)) {
      return false;
    }
    let cloneBoard = cloneDeep(board);
    let added = createEmptyAdded();
    for (let i = cloneBoard.length - 2; i >= 0; i--) {
      for (let j = 0; j < cloneBoard[i].length; j++) {
        if (cloneBoard[i][j].number !== 0) {
          for (let k = cloneBoard.length - 1; k > i; k--) {
            if (
              cloneBoard[k][j].number === 0 &&
              !hasVerticalObstacle(j, i, k, cloneBoard)
            ) {
              // showMoveAnimate(i, j, k, j);
              cloneBoard[k][j].number = cloneBoard[i][j].number;
              cloneBoard[i][j].number = 0;
            } else if (
              cloneBoard[k][j].number === cloneBoard[i][j].number &&
              !hasVerticalObstacle(j, i, k, cloneBoard)
            ) {
              // showMoveAnimate(i, j, k, j);
              if (added[k][j] != 0) {
                cloneBoard[k - 1][j].number = cloneBoard[i][j].number;
                cloneBoard[i][j].number = 0;
              } else {
                cloneBoard[k][j].number =
                  cloneBoard[k][j].number + cloneBoard[i][j].number;
                cloneBoard[i][j].number = 0;
                added[k][j] = 1;
                setScore((score) => {
                  score += cloneBoard[k][j].number;
                  return score;
                });
              }
            }
          }
        }
      }
    }
    setBoard(cloneBoard);
    return true;
  }

  function keyLeft() {
    if (!canMoveLeft(board)) {
      return false;
    }
    let cloneBoard = cloneDeep(board);
    let added = createEmptyAdded();
    for (let i = 0; i < cloneBoard.length; i++) {
      for (let j = 1; j < cloneBoard[i].length; j++) {
        if (cloneBoard[i][j].number !== 0) {
          for (let k = 0; k < j; k++) {
            if (
              cloneBoard[i][k].number === 0 &&
              !hasHorizontalObstacle(i, k, j, cloneBoard)
            ) {
              // showMoveAnimate(i, j, k, j);
              cloneBoard[i][k].number = cloneBoard[i][j].number;
              cloneBoard[i][j].number = 0;
            } else if (
              cloneBoard[i][k].number === cloneBoard[i][j].number &&
              !hasHorizontalObstacle(i, k, j, cloneBoard)
            ) {
              // showMoveAnimate(i, j, k, j);
              if (added[i][k] != 0) {
                cloneBoard[i][k + 1].number = cloneBoard[i][j].number;
                cloneBoard[i][j].number = 0;
              } else {
                cloneBoard[i][k].number =
                  cloneBoard[i][k].number + cloneBoard[i][j].number;
                cloneBoard[i][j].number = 0;
                added[i][k] = 1;
                setScore((score) => {
                  score += cloneBoard[i][k].number;
                  return score;
                });
              }
            }
          }
        }
      }
    }
    setBoard(cloneBoard);
    return true;
  }

  function keyRight() {
    if (!canMoveRight(board)) {
      return false;
    }
    let cloneBoard = cloneDeep(board);
    let added = createEmptyAdded();
    for (let i = 0; i < cloneBoard.length; i++) {
      for (let j = cloneBoard[i].length - 2; j >= 0; j--) {
        if (cloneBoard[i][j].number !== 0) {
          for (let k = cloneBoard[i].length - 1; k > j; k--) {
            if (
              cloneBoard[i][k].number === 0 &&
              !hasHorizontalObstacle(i, j, k, cloneBoard)
            ) {
              // showMoveAnimate(i, j, k, j);
              cloneBoard[i][k].number = cloneBoard[i][j].number;
              cloneBoard[i][j].number = 0;
            } else if (
              cloneBoard[i][k].number === cloneBoard[i][j].number &&
              !hasHorizontalObstacle(i, j, k, cloneBoard)
            ) {
              // showMoveAnimate(i, j, k, j);
              if (added[i][k] != 0) {
                cloneBoard[i][k - 1].number = cloneBoard[i][j].number;
                cloneBoard[i][j].number = 0;
              } else {
                cloneBoard[i][k].number =
                  cloneBoard[i][k].number + cloneBoard[i][j].number;
                cloneBoard[i][j].number = 0;
                added[i][k] = 1;
                setScore((score) => {
                  score += cloneBoard[i][k].number;
                  return score;
                });
              }
            }
          }
        }
      }
    }
    setBoard(cloneBoard);
    return true;
  }

  /**
   * 判断是否有元素能够向上移动
   * 条件1：非x轴坐标为0的元素，值不为0的元素
   * 条件2：该元素上方元素为0，或者上方元素与该元素相等
   */
  function canMoveUp(board) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j].number !== 0 && i !== 0) {
          if (
            board[i - 1][j].number === 0 ||
            board[i - 1][j].number === board[i][j].number
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function canMoveDown(board) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j].number !== 0 && i !== 3) {
          if (
            board[i + 1][j].number === 0 ||
            board[i + 1][j].number === board[i][j].number
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function canMoveRight(board) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j].number !== 0 && j !== 3) {
          if (
            board[i][j + 1].number === 0 ||
            board[i][j + 1].number === board[i][j].number
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function canMoveLeft(board) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j].number !== 0 && j !== 0) {
          if (
            board[i][j - 1].number === 0 ||
            board[i][j - 1].number === board[i][j].number
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * 判断向前元素到目标元素间是否存在障碍物（垂直方向）
   */
  function hasVerticalObstacle(col, row1, row2, board) {
    for (let i = row1 + 1; i < row2; i++) {
      if (board[i][col].number !== 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * 判断向前元素到目标元素间是否存在障碍物（水平方向）
   */
  function hasHorizontalObstacle(row, col1, col2, board) {
    for (let i = col1 + 1; i < col2; i++) {
      if (board[row][i].number !== 0) {
        return true;
      }
    }
    return false;
  }

  // 生成一个4*4，值为0的空数组
  function createEmptyAdded() {
    let added = new Array();
    for (let i = 0; i < 4; i++) {
      added[i] = new Array();
      for (let j = 0; j < 4; j++) {
        added[i][j] = 0;
      }
    }
    return added;
  }

  // function showMoveAnimate(fromx, fromy, tox, toy) {
  //   // let toTop = game2048Ref.current.getPosX(tox);
  //   // let toLeft = game2048Ref.current.getPosY(toy);
  //   // let fromTop = game2048Ref.current.getPosX(fromx);
  //   // let fromLeft = game2048Ref.current.getPosY(fromy);
  //   let goalGridCell = document.getElementsByClassName(
  //     `grid-cell-${tox}-${toy}`
  //   )[0];
  //   let toTop = goalGridCell.offsetTop;
  //   let toLeft = goalGridCell.offsetLeft;
  //   let gridCell = document.getElementsByClassName(
  //     `grid-cell-${fromx}-${fromy}`
  //   )[0];
  //   let fromTop = gridCell.offsetTop;
  //   let fromLeft = gridCell.offsetLeft;
  //   console.log(fromTop, fromLeft, toTop, toLeft);

  //   let tranLeft = toLeft - fromLeft + "px";
  //   let tranTop = toTop - fromTop + "px";

  //   gridCell.animate(
  //     [
  //       {
  //         transform: `translate(0px, 0px)`,
  //       },
  //       { transform: `translate(${tranLeft}, ${tranTop})`, opacity: 0 },
  //     ],
  //     {
  //       duration: 240,
  //       iterations: 1,
  //     }
  //   );
  // }

  function gameOver(board) {
    if (
      !canMoveUp(board) &&
      !canMoveDown(board) &&
      !canMoveLeft(board) &&
      !canMoveRight(board)
    ) {
      setGameState("gameover");
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  return (
    <>
      <MengBan>
        {gameState === "init" ? (
          <div className="mengban">
            <a id="startGameBtn" onClick={startGame}>
              New Game
            </a>
          </div>
        ) : null}

        <GameHeaderStyle>
          <GameHeader score={score}></GameHeader>
        </GameHeaderStyle>
        <GameStyle>
          <Game2048
            onRef={game2048Ref}
            gameState={gameState}
            board={board}
          ></Game2048>
        </GameStyle>
      </MengBan>
    </>
  );
}

export default App;
