// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from "react";

// data
import { wordsList } from "./data/words";

// components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id:1, name: "start"},
  {id:2, name:"game"},
  {id:3, name:"end"}
];

const guessesQty = 3; 

function App() {
  const [gameStage, setGameState] = useState(stages[0].name);
  const [words] = useState(wordsList);
  
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetter] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] =useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickedWordAndCategory = useCallback(() => {
    // pegando uma categoria aleatória 
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    
    // pegando uma palavra aleatória
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category };
  }, [words]);

  // começando o jogo
  const startGame = useCallback(() => {
    // limpando todas letras
    clearLetterStates();

    // escolhendo palavra e categoria
    const {word, category} = pickedWordAndCategory();

    // creando um array de letras
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((letras) => letras.toLowerCase());

    // preenchendo os states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameState(stages[1].name);
  }, [pickedWordAndCategory]);

  // entrada de letras
  const verifyLetter = (letter) => {
    const letterLowerCase = letter.toLowerCase();

    // checando se a letra ja foi utilizada
    if (
      guessedLetters.includes(letterLowerCase) || 
      wrongLetters.includes(letterLowerCase)
    ) {
      return;
    }

    // acrescenta letra acertada ou remove uma chance
    if (letters.includes(letterLowerCase)) {
      setGuessedLetter((actualGuessedLetters) => [
        ...actualGuessedLetters, letterLowerCase,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, letterLowerCase,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetter([]);
    setWrongLetters([]);
  };

  // checando se as tentativas acabaram
  useEffect(() => {
    if (guesses <= 0) {
      //resetando todos states
      clearLetterStates();

      setGameState(stages[2].name);
    }
  }, [guesses]);

  // checando vitória no jogo
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // condição da vitória
    if (guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      // adiciona pontuação
      setScore((actualScore) => (actualScore += 100));

      // reinicia o jogo com nova palavra
      startGame();
    }
  }, [guessedLetters, letters, startGame, gameStage]);

  // reiniciando o jogo
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);  

    setGameState(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && 
        <Game 
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
