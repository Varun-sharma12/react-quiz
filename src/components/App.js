import { useEffect, useReducer } from "react";
// import DateCounter from "./DateCounter";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
// import { act } from "react-dom/test-utils";
const initialState = {
  questions: [],
  // Various possibilities of status is [loading, error, ready, active, finished]
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, answer: null, index: state.index + 1 };
      case "finish":
        return {...state, status: 'finished'}
    default:
      throw new Error("action is unknown");
  }
}

function App() {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numQuestions = questions.length;
  const totalPoints = questions.reduce((acc, current) =>  acc + current.points, 0);
  //UseEffect to fetch the data initally.
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      {/* calling the header component */}
      <Header />
      {/* Calling the main component */}
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
          <Progress index={index} numQuestions={numQuestions} points={points} totalPoints = {totalPoints} answer={answer}/>
            {" "}
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
        <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index} />
          </>
        )}
        {
    status === 'finished' && <FinishScreen points = {points}  totalPoints = {totalPoints} /> 
        }
        {/* <p>1/15</p>
        <p>Question?</p> */}
      </Main>
    </div>
  );
}

export default App;
