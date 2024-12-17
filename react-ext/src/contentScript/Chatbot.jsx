// Chatbot.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState({});
  const [conversationId, setConversationId] = useState(null);
  const [authPage, setAuthPage] = useState(false); // Track if we are on the auth page

  const [formData, setFormData] = useState({ email: '', username: '', password: '', action: '' });

  // Toggle chatbot visibility
  const toggleChatbot = () => setIsOpen(!isOpen);

  const toggleAuthPage = (action) => {
    setAuthPage(true);
    setFormData({ ...formData, action });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.action === 'signup') {
      // Call the signup API
      try {
        const response = await axios.post('http://127.0.0.1:8002/signup', {
          email: formData.email,
          username: formData.username,
          password: formData.password,
        });
        alert('Account created successfully!');
        setAuthPage(false);
        setMessages([...messages, { text: 'Welcome! You have signed up successfully.', isUser: false }]);
      } catch (error) {
        alert('Error creating account');
      }
    } else if (formData.action === 'signin') {
      // Call the signin API
      try {
        const response = await axios.post('http://127.0.0.1:8002/signin', {
          email: formData.email,
          password: formData.password,
        });
        alert('Sign in successful!');
        setAuthPage(false);
        setMessages([...messages, { text: 'Welcome back! You have signed in successfully.', isUser: false }]);
      } catch (error) {
        alert('Error signing in');
      }
    }
  };

  const renderAuthForm = () => {
    return (
      <div className="auth-form-container" >
        <div className="auth-form">
          <h3 className="auth-title">{formData.action === 'signup' ? 'Create Account' : 'Sign In'}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="auth-input"
              required
            />
            {formData.action === 'signup' && (
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="auth-input"
                required
              />
            )}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="auth-input"
              required
            />
            
          </form>
          <button type="submit" className="auth-submit-btn">
              {formData.action === 'signup' ? 'Sign Up' : 'Sign In'}
            </button>
          <button className="auth-cancel-btn" onClick={() => setAuthPage(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  };
  

  // Initialize conversation
  useEffect(() => {
    const initializeConversation = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8002/create_convo', {
          user_id: '12345', // Replace with dynamic user_id if available
          website_url: window.location.href,
        });
        setConversationId(response.data.convo_id);
      } catch (error) {
        console.error('Error initializing conversation:', error);
      }
    };

    if (isOpen && !conversationId) {
      initializeConversation();
    }
  }, [isOpen, conversationId]);

  // Fetch conversation session
  const fetchConversation = async () => {
    if (!conversationId) return;

    try {
      const response = await axios.get(`http://127.0.0.1:8002/get_convo/${conversationId}`);
      const { convo } = response.data;
      setMessages(
        convo.map(({ query, response }) => [
          { text: query, isUser: true },
          { text: response, isUser: false },
        ]).flat()
      );
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  // Send a message and get bot response
  const sendMessage = async () => {
    if (input.trim() && conversationId) {
      const userMessage = { text: input, isUser: true };
      setMessages([...messages, userMessage]);
      setInput('');

      try {
        const response = await axios.post(`http://127.0.0.1:8002/generate_answer/${conversationId}`, {
          query: input,
        });
        const botMessage = { text: response.data.message, isUser: false };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error('Error generating bot response:', error);
        setMessages((prev) => [
          ...prev,
          { text: 'Sorry, there was an error processing your request.', isUser: false },
        ]);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && !authPage && (
        <div className="chat-window">
          <div className="chat-header">
            Chatbot
            <FaTimes onClick={toggleChatbot} style={{ cursor: 'pointer' }} />
          </div>
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.isUser ? 'user' : 'bot'}`}
                // style={{overflowX:"auto"}}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={sendMessage}>
              <FaPaperPlane />
            </button>
            <div className="auth-options">
              <button onClick={() => toggleAuthPage('signup')}>Create Account</button>
              <button onClick={() => toggleAuthPage('signin')}>Sign In</button>
            </div>
          </div>
        </div>
      )}
      {isOpen && authPage && renderAuthForm()}
      {!isOpen && !authPage && (
        <button className="chat-toggle-button" onClick={toggleChatbot}>
          Chat
        </button>
      )}
    </div>
  );
};

export default Chatbot;

