import { useReducer, useState } from 'react';
import './App.css';

// 🌟 Initial state of the bank account
const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
  accountNumber: null
};

// 🔢 Function to generate a random 8-digit account number
function generateAccountNumber() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

// 🔁 Reducer function to handle all state transitions
function reducer(state, action) {
  // Restrict all actions if account is inactive, except opening it
  if (!state.isActive && action.type !== "openAccount") return state;

  switch (action.type) {
    case "openAccount":
      return {
        ...state,
        balance: 500, // Minimum deposit
        isActive: true,
        accountNumber: generateAccountNumber()
      };

    case "deposit":
      return {
        ...state,
        balance: state.balance + action.payload
      };

    case "withdraw":
      // Prevent overdraft
      if (state.balance < action.payload) return state;
      return {
        ...state,
        balance: state.balance - action.payload
      };

    case "requestLoan":
      // Only allow loan if there is no active loan
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload,
        balance: state.balance + action.payload
      };

    case "payLoan":
      // Pay back current loan and reduce balance
      return {
        ...state,
        balance: state.balance - state.loan,
        loan: 0
      };

    case "closeAccount":
      // Can only close if no loan and balance is 0
      if (state.loan > 0 || state.balance !== 0) return state;
      return initialState;

    default:
      throw new Error("Unknown action type");
  }
}

// 💻 Main App component
export default function App() {
  // useReducer returns current state and dispatch function
  const [{ balance, loan, isActive, accountNumber }, dispatch] = useReducer(reducer, initialState);
  const [amount, setAmount] = useState("");

  return (
    <div className="App">
      <h1>Puspa Bank Account</h1>

      {isActive && <p>Account Number: {accountNumber}</p>}
      <p><strong>Balance:</strong> ${balance}</p>
      <p><strong>Loan:</strong> ${loan}</p>

      <p>
        <button onClick={() => dispatch({ type: "openAccount" })} disabled={isActive}>
          Open account
        </button>
      </p>
      <p>
        <input
          type="number"
          value={amount}
          min="1"
          onChange={e => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
          disabled={!isActive}
        />
        <button
          onClick={() =>  {dispatch({ type: "deposit", payload: Number(amount) });
          setAmount(""); // Clear input after deposit
        }}
        

        >
          Deposit
        </button>
        <button
          onClick={() => dispatch({ type: "withdraw", payload: amount })}
          disabled={!isActive || amount <= 0}
        >
          Withdraw
        </button>
      </p>
      <p>
        <button onClick={() => dispatch({ type: "requestLoan", payload: 5000 })} disabled={!isActive}>
          Request a loan of 5000
        </button>
      </p>
      <p>
        <button onClick={() => dispatch({ type: "payLoan" })} disabled={!isActive || loan === 0}>
          Pay loan
        </button>
      </p>
      <p>
        <button onClick={() => dispatch({ type: "closeAccount" })} disabled={!isActive}>
          Close account
        </button>
      </p>
    </div>
  );
}