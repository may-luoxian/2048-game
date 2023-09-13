import PropTypes from "prop-types";

function GameHeader({ score }) {
  return (
    <header>
      <h1>2048</h1>
      <p>
        分数：<span id="score">{score}</span>
      </p>
    </header>
  );
}

GameHeader.propTypes = {
  score: PropTypes.number
};

export default GameHeader;
