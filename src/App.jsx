import React, { useState } from "react";
import "./App.css"; 
import logo from './sit.jpeg'; 
import personLogo from './abc.png'; 

const questionDatabase = { /* Your questionDatabase code */ };

function App() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [answerTypes, setAnswerTypes] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [modules, setModules] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [specifications, setSpecifications] = useState("");

  const subjectOptions = Object.keys(questionDatabase);
  const difficultyOptions = ["Easy", "Medium", "Hard"];
  const moduleOptions = [1, 2, 3, 4, 5];

  const handleAnswerTypeChange = (e) => {
    const { value, checked } = e.target;
    setAnswerTypes((prev) => 
      checked ? [...prev, value] : prev.filter((type) => type !== value)
    );
  };

  const handleModulesChange = (e) => {
    const { value, checked } = e.target;
    setModules((prev) => 
      checked ? [...prev, parseInt(value)] : prev.filter((module) => module !== parseInt(value))
    );
  };

  const addSubject = () => {
    if (selectedSubject && answerTypes.length > 0 && difficulty && modules.length > 0) {
      const subjectCode = `${selectedSubject.slice(0, 3).toUpperCase()}${Math.floor(Math.random() * 100) + 1}`;
      setSubjects([...subjects, { subject: selectedSubject, code: subjectCode, types: answerTypes, difficulty, modules }]);
      setSelectedSubject("");
      setAnswerTypes([]);
      setDifficulty("");
      setModules([]);
    } else {
      alert("Please select all fields: Subject, Answer Type(s), Difficulty, and Number of Modules.");
    }
  };

  const clearSubjects = () => {
    if (window.confirm("Are you sure you want to clear all subjects?")) {
      setSubjects([]);
    }
  };

  const generateQuestionPaper = () => {
    let questions = subjects.reduce((acc, item) => {
      item.types.forEach((type) => {
        const relevantQuestions = questionDatabase[item.subject].filter((q) => q.type === type);
        acc = acc.concat(relevantQuestions);
      });
      return acc;
    }, []);
    if (questions.length === 0) {
      alert("No questions available for the selected subjects and types.");
      return;
    }
    const questionPaper = questions.map((q, index) => `${index + 1}. ${q.question} (${q.type})`).join("\n");
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<pre>' + questionPaper + '</pre>');
    printWindow.document.close();
    printWindow.print();
  };

  const handleLogin = () => {
    if (username === "abc" && password === "123") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const generatePaper = async () => {
    try {
      const response = await fetch('http://localhost:5000/generate-paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ specifications }),
      });
      const data = await response.json();
      console.log(data.generated_paper); // Use the generated paper as needed
    } catch (error) {
      console.error('Error generating paper:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h2>Welcome to QP GEN!</h2>
        <img src={personLogo} alt="Person Logo" className="person-logo" />
        <p><mark>Enter correct username and password</mark></p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="login-btn">Login</button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1><em>Siddaganga Institute of Technology</em></h1>
      </header>
      <div className="container">
        <center><img src={logo} alt="Question Paper Logo" className="logo" /></center>
        <h2><center>QP GEN</center></h2><br/>
        <div className="input-section">
          {/* Rest of the input sections */}
          <button onClick={generateQuestionPaper} className="generate-btn">Generate Question Paper</button>
        </div>
        <div className="specifications-section">
          <input
            type="text"
            value={specifications}
            onChange={(e) => setSpecifications(e.target.value)}
            placeholder="Enter paper specifications"
          />
          <button onClick={generatePaper}>Generate Paper</button>
        </div>
      </div>
    </div>
  );
}

export default App;
