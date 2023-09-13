import styled from "styled-components";

export const MengBan = styled.div`
  .mengban {
    width: 500px;
    height: 732.5px;
    position: absolute;
    z-index: 5;
    /* background-color: rgba(0, 0, 0, 0.1); */
  }
  #startGameBtn {
    width: 100px;
    padding: 10px;
    background: #8f7a66;
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    border-radius: 10px;
    text-decoration: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }

  #startGameBtn:hover {
    background: #9f8b77;
  }
`;

export const GameStyle = styled.div`
  #grid-container {
    width: 460px;
    height: 460px;
    padding: 20px;
    margin: 40px auto;
    background: #bbada0;
    border-radius: 10px;
    position: relative;
  }

  .grid-cell {
    width: 100px;
    height: 100px;
    border-radius: 6px;
    background: #ccc0b3;
    position: absolute;
  }

  .number-cell {
    width: 100px;
    height: 100px;
    border-radius: 6px;
    line-height: 100px;
    font: Arial, Helvetica, sans-serif;
    font-size: 35px;
    font-weight: bold;
    text-align: center;
    position: absolute;
    transition: all .2s;
  }
  #gameover {
    background-color: black;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 60px;
    position: absolute;
    top: 45%;
    left: 50%;
    width: 250px;
    text-align: center;
    transform: translateX(-50%);
  }
`;

export const GameHeaderStyle = styled.header`
  header {
    display: block;
    margin: 0 auto;
    width: 500px;
    text-align: center;
  }

  header h1 {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 60px;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  header p {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 25px;
    margin: 20px auto;
  }
`;
