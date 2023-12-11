import './App.css'

import { useCallback, useEffect, useState } from "react";

import { wordsList } from './data/words';

import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';
import StartScreen from './components/StartScreen'

const stages = [
  {id: 1, name: "start"}, 
  {id: 2, name: "game"}, 
  {id: 3, name: "end"}, 
]

function App() {

  const guessesQty = 3

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPicketWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);


  const pickedWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category }
  }, [words])

  const startGame = useCallback(() => {
    clearLetterState()
    const { word, category } = pickedWordAndCategory();

    let wordLetters = word.split('');
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPicketWord(word);
    setPickedCategory(category);
    setLetters(wordLetters)

    setGameStage(stages[1].name)

  }, [pickedWordAndCategory])

  const verifyLetter = (letter) => {
      const normalizeLetter = letter.toLowerCase();

      if(guessedLetters.includes(normalizeLetter) || wrongLetters.includes(normalizeLetter)) {
        return
      } 

      if(letters.includes(normalizeLetter)) {
        setGuessedLetters((actualGuessedLetters) => [
          ...actualGuessedLetters, 
          normalizeLetter,
        ]);
      } else {
        setWrongLetters((actualWrongLetters) => [
          ...actualWrongLetters, 
          normalizeLetter,
        ]);

        setGuesses((actualGuesses) => actualGuesses - 1)
      }

  }

  const clearLetterState = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }; 

  useEffect(() => {
    if(guesses <= 0) {

      clearLetterState()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(() => {

    const uniqueLetters = [... new Set(letters)];

    if(guessedLetters.length === uniqueLetters.length && guessedLetters.length > 1 ) {
      setScore((actualScore) => actualScore += 100);
      startGame();
    }

  }, [guessedLetters, letters, startGame])

  const retry = () => {

    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name)
  }

  return (
    <>
      <div className='App'>
        {gameStage === 'start' && <StartScreen startGame={startGame}/>}
        {gameStage === 'game' && (<GameScreen 
        verifyLetter={verifyLetter} 
        pickedWord={pickedWord} 
        pickedCategory={pickedCategory} 
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
        />
        )}
        {gameStage === 'end' && <EndScreen retry={retry} score={score}/>}
      </div>
      
    </>
  )
}

export default App

