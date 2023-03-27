import styled from 'styled-components';
import React from "react";

const BIRD_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

function App() {
  const [birdPosition, setBirdPosition] = React.useState(250);
  const [gameHasStarted, setGameHasStarted] = React.useState(false);
  const [obstacleHeight, setObstacleHeight] = React.useState(200);
  const [obstacleLeft, setObstacleLeft] = React.useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = React.useState(-2);

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  React.useEffect(() => {
    let timeId;

    if (gameHasStarted && birdPosition < GAME_HEIGHT - BIRD_SIZE) {
      timeId = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + GRAVITY)
      }, 24);
    }

    return () => {
      clearInterval(timeId)
    }
  }, [birdPosition, gameHasStarted]);

  React.useEffect(() => {
    let obstacleId;

    if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 6);
      }, 24);

      return () => {
        clearInterval(obstacleId);
      };

    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)));
    };
    setScore(score => score + 1)
  }, [gameHasStarted, obstacleLeft]);

  React.useEffect(() => {
    const hasCollideWithTopObstacle = birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCollideWithBottomObstacle = birdPosition <= 500 && birdPosition >= 500 - obstacleHeight;

    if(obstacleLeft >= 0 &&
        obstacleLeft <= OBSTACLE_WIDTH &&
        (hasCollideWithTopObstacle || hasCollideWithBottomObstacle)) {
      setGameHasStarted(false)
    }

  }, [birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft]);

  const handleClick = () => {
    let newbirdPosition = birdPosition - JUMP_HEIGHT;

    if (!gameHasStarted) {
      setGameHasStarted(true)
      setScore(score => 0)

    } else if (newbirdPosition < 0) {
      setBirdPosition(0)
    } else {
      setBirdPosition(newbirdPosition);
    }
  }

  return (
      <Div onClick={handleClick}>
        <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
          <Obstacle
              top={0}
              width={OBSTACLE_WIDTH}
              height={obstacleHeight}
              left={obstacleLeft}/>
          <Obstacle
              top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
              width={OBSTACLE_WIDTH}
              height={bottomObstacleHeight}
              left={obstacleLeft}/>
          <Bird size={BIRD_SIZE} top={birdPosition}/>
        </GameBox>
        <span> {score} </span>
      </Div>
  );
}

export default App;

const Bird = styled.div`
  position: absolute;
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span{
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: blue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  top: ${(props) => props.top}px;
  background-color: green;;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  left: ${(props) => props.left}px;
`;