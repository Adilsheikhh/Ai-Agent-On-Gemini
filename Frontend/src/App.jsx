'use client';

import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import { Copy, CheckCheck, Moon, Sun } from "lucide-react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [showResponse, setShowResponse] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    prism.highlightAll();
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.body.className = savedTheme;

    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning! ☀️");
    } else if (hour < 18) {
      setGreeting("Good Afternoon! 🌤️");
    } else {
      setGreeting("Good Evening! 🌙");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  async function handleSubmit() {
    if (!input.trim()) return;
    setShowResponse(false); // Hide response before fetching
    try {
      const response = await axios.post("http://localhost:5000/ai/get-review", { code: input });
      setResponse(response.data);
      setShowResponse(true); // Show response after fetching
    } catch (error) {
      setResponse("⚠️ An error occurred while sending the request.");
      setShowResponse(true);
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">ZORO AI</div>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      {/* Greeting Message */}
      <div className="greeting-message">{greeting}</div>

      {/* Main Layout */}
      <div className="main-container">
        {/* Code Editor Section */}
        <div className="editor-container">
          <Editor
            value={input}
            onValueChange={setInput}
            highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
            padding={12}
            className="code-editor"
            placeholder="Ask anything Here ..."
          />
          <button onClick={handleSubmit} className="submit-button">Submit</button>
        </div>

        {/* Response Section */}
        {showResponse && (
          <div className="response-container show">
            <div className="response-header">
              <h2>Response</h2>
              <button onClick={handleCopy} className="copy-button">
                {copied ? <CheckCheck size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <div className="response-content">
              <Markdown rehypePlugins={[rehypeHighlight]}>{response}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
