import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const getRandomAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const handleVotes = () => {
    const newVote = [...votes];
    newVote[selected] += 1;
    setVotes(newVote);
  };

  const getMostVoted = () => {
    const mostVoted = Math.max(...votes);
    const maxVotedIndex = votes.indexOf(mostVoted);
    return anecdotes[maxVotedIndex];
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <h3>{anecdotes[selected]}</h3>
      <h4>Has: {votes[selected]} Votes.</h4>
      <Button onClick={handleVotes} text="Vote" />{" "}
      <Button onClick={getRandomAnecdote} text="Show Random anecdote" />
      <h1>Anecdote With Most Votes</h1>
      <h3>{getMostVoted()}</h3>
      <h4>With: {Math.max(...votes)} Votes.</h4>
    </div>
  );
};

export default App;
