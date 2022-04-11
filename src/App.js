import { useEffect, useState } from 'react';
import './App.css';
import {Form, Button, ListGroup, Spinner} from 'react-bootstrap'
import { getDatabase, ref, child, get } from "firebase/database";



function App(props) {
  const [wordList, setWordList] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [matchedValue, setMatchedValue] = useState([])
  const [loading, setLoading] = useState(true);
  const [searchWord, setSearchWord] = useState('');


  // Component mount get data
  useEffect(() =>{
    getData();
  },[])

  // WHEN SEARCH WORD changes then wait X amount of time to see if there is a match
  useEffect(() => {
    setLoading(true);
    setMatchedCount(0)
    const checkInputDelay = setTimeout(() => {
      console.log(searchWord)
      // CHECK WORD REGEX
      let sortedInput = sortWord(searchWord);
      let numberMatched = 0
      let matchedString = []
      wordList.forEach(word => {
        let sortedDataWord = sortWord(word);
        if(sortedInput == sortedDataWord){
          numberMatched += 1
          matchedString.push(word)
        }
      })
      setMatchedCount(numberMatched)
      setMatchedValue(matchedString)
      setLoading(false);

    }, 1000)

    return () => clearTimeout(checkInputDelay)
  }, [searchWord])


  // GET all the test data
  const getData = () => {
    const dbRef = ref(getDatabase());

    // INITATE DATA
    let data = [];

    get(child(dbRef, `test`)).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        setWordList(snapshot.val())
      } else {
        console.log("No data available");
      }
      setLoading(false)
      console.log("RES DATA", typeof data)
    }).catch((error) => {
      console.error(error);
    });
  }


  // FUNCTION to sort the word into Alpabetical order
  const sortWord = (str) => {
    // str == string

    let stringArray = str.replace(/[^\w]/g, "").toLowerCase().split("");

    let word = stringArray.sort().join("");

    return word
  }


  return (
    <div className="app">

      {/* HEADER NAV */}
      <header className="app__header">
        <h1>ParkChamp Code Challenge</h1>
      </header>

      {/* MAIN CONTENT */}
      <main className='py-4 app__main'>
        {/* INPUT FORM */}
        <Form className="mb-4">
          <Form.Group className="mb-3" controlId="formBasicEmail">

            <Form.Label>Anagram Checker</Form.Label>

            <Form.Control
              autoFocus
              type="text"
              placeholder="Enter word to filter"
              onChange={(e) => setSearchWord(e.target.value)}
            />

            <Form.Text className="text-muted">
              Enter a word to see if there are any anagrams of it in the list below.
            </Form.Text>

          </Form.Group>
        </Form>

        {/* SHOW IF MATCH HOW MANY MATCH */}
        {matchedCount ?
          <p className="success">{matchedCount} anagrams found!</p> 
          :
          searchWord && !loading ? 
            <p className="alert">{matchedCount} anagrams found!</p> 
            :
            null
        }

        {/* LIST OF WORDS */}
        {loading ? 
          <Spinner animation="grow" />
        :
        <ListGroup as="ul" className='mb-3'>
          {wordList.map(word => {
            return(
              <ListGroup.Item active={matchedValue.includes(word)}  as="li">{word}</ListGroup.Item>
              )
            })}
        </ListGroup>
          }
      </main>

      {/* Footer */}
      <footer className="p-3 app__footer">
          <h2 className='author'>Completed by: Nathan Armstrong</h2>
      </footer>
    </div>
  );
}

export default App;
