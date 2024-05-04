import { useImperativeHandle, useState } from "react";
import { backgroundArr } from "./constant";
export default function Game2048({ gameState, board, onRef }) {
  let [bgArr] = useState(backgroundArr);

  useImperativeHandle(onRef, () => {
    return {
      getPosX,
      getPosY,
    };
  });

  // 根据数组的x，y索引计算节点位置
  function getPosX(x) {
    return 20 + x * 120 + "px";
  }
  function getPosY(y) {
    return 20 + y * 120 + "px";
  }

  // gridCell背景色
  function getNumberBackgroundColor(number) {
    switch (number) {
      case 2:
        return "#eee4da";
      case 4:
        return "#eee4da";
      case 8:
        return "#f26179";
      case 16:
        return "#f59563";
      case 32:
        return "#f67c5f";
      case 64:
        return "#f65e36";
      case 128:
        return "#edcf72";
      case 256:
        return "#edcc61";
      case 512:
        return "#9c0";
      case 1024:
        return "#3365a5";
      case 2048:
        return "#09c";
      case 4096:
        return "#a6bc";
      case 8192:
        return "#93c";
      default:
        return "rgba(255, 255, 255, 0.1)";
    }
  }
  // gridCell数字颜色
  function getNumberColor(number) {
    if (number <= 4) {
      return "#776e65";
    }
    return "white";
  }

  return (
    <>
      <div id="grid-container">
        {bgArr.map((row, y) => {
          return row.map((item, x) => {
            return (
              <div
                key={item.id}
                className={`grid-cell`}
                style={{
                  left: getPosX(x),
                  top: getPosY(y),
                }}
              ></div>
            );
          });
        })}
        {board.map((row, y) => {
          return row.map((item, x) => {
            if (item.number === 0) {
              return (
                <div
                  key={item.id}
                  className={`grid-cell grid-cell-${y}-${x}`}
                  style={{
                    left: getPosX(x),
                    top: getPosY(y),
                    opacity: 0,
                  }}
                ></div>
              );
            } else {
              return (
                <div
                  key={item.id}
                  className={`number-cell grid-cell-${y}-${x}`}
                  style={{
                    left: getPosX(x),
                    top: getPosY(y),
                    backgroundColor: getNumberBackgroundColor(item.number),
                    color: getNumberColor(item.number),
                  }}
                >
                  {item.number}
                </div>
              );
            }
          });
        })}
      </div>
      {gameState === "gameover" ? (
        <div id="gameover">
          <span>GAME OVER</span>
          <a id="startGameBtn">Restart</a>
        </div>
      ) : null}
    </>
  );
}
