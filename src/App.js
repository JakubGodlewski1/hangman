import './App.css';
import { v4 } from 'uuid';
import {useEffect,  useState} from "react";
const randomWords = require("random-words")

const App = () => {
    const [randomWord, setRandomWord] = useState(null)
    const [wrong, setWrong] = useState(0)
    const [correct, setCorrect] = useState(0)
    const [inputValues, setInputValues] = useState([])
    const [gameStatus, setGameStatus] = useState(null)
    const [usedLetters, setUsedLetters] = useState([])

    const resetGame = () => {
        setRandomWord([...randomWords()])
        setWrong(0)
        setCorrect(0)
        setInputValues([])
        setGameStatus(null)
        setUsedLetters([])
    }

//handle game status -won or lost
    useEffect(()=>{
        if (randomWord){
            if (wrong === 10){
                setGameStatus("LOST")
            }

            if (inputValues.length > 0 && !inputValues.includes(null)){
                setGameStatus("WON")
            }
        }
    },[wrong, correct, randomWord])

    //set inputValue state length to the length of the current random Word
    useEffect(()=>{
        if (randomWord){
            setInputValues(Array(randomWord.length).fill(null))
        }
    },[randomWord])

    //create random word
    useEffect(()=>{
        const randomWord = [...randomWords()]
        setRandomWord(randomWord)
    },[])

    //add event listener to window
    useEffect(()=>{
        const handleGame = (e)=>{
            //only allow letters
            if (
                e.charCode > 96 && e.charCode < 123
                && !usedLetters.includes(e.key)

            ){
                setUsedLetters(prevState => [...prevState, e.key])
                //if user is correct
                if (randomWord.includes(e.key)){
                    setCorrect(prev => prev+1)

                    //update all inputs containing correct letter
                    const lettersIndexes = []
                    randomWord.forEach((letter, i)=>{
                        if (letter === e.key){
                            lettersIndexes.push(i)
                        }
                    })

                    lettersIndexes.forEach((value)=>{
                        setInputValues((prev)=>{
                            return prev.map((letter, i)=>{
                                if (i===value){
                                    return e.key
                                }else return letter
                            })
                        })
                    })
                    //if user is wrong
                }else setWrong(prev => prev+1)
            }
        }
        if (randomWord && !gameStatus){
         window.addEventListener("keypress", handleGame)
        }
        return ()=> window.removeEventListener("keypress", handleGame)
    },[randomWord, usedLetters, gameStatus])

    return (
        <div className="App">
            {gameStatus && <div
                className="game-status">
                You {gameStatus} <br/> The word: {randomWord}<button onClick={resetGame}>start again</button>
            </div>}
            <div className="used-letters">
            <span>Used letters:</span>
            {usedLetters && usedLetters.map((letter)=>{
                return <span key={letter}>&nbsp;{letter}</span>
            })}
            </div>
            {/*hangman stick*/}
            <div className="hangman">
                {Array(10).fill(null).map((el, i)=>{
                    if (i < wrong){
                        return <div key={i} className={`stick-${i+1}`}></div>
                    } else return  null
                })}
            </div>

            {/*create x inputs*/}
            <div className="inputs">
                {randomWord && randomWord.map((el, i)=>{
                    return <input
                        defaultValue={inputValues[i]}
                        type="text"
                        className="input"
                        key={v4()}
                    />
                })}
            </div>
        </div>
    );
};

export default App;