// // content_script.js

// window.onload = () => {
//     console.log("Content Script Loaded...");
  
//     // Send a message to the background script to get the active tab's URL
//     chrome.runtime.sendMessage({ action: 'getActiveTabURL' }, (response) => {
//       const activeTabURL = response?.url;
//       if (activeTabURL) {
//         console.log('Active tab URL:', activeTabURL);
//       } else {
//         console.log('No active tab URL found.');
//       }
//     });
  
//     // Example of creating a chatbot icon in the bottom right corner
//     if (window.location.hostname === "www.google.com" && window.location.pathname === "/search") {
//       console.log("Google Search page detected. Skipping chatbot icon creation.");
//       return;
//     }
  
//     // Create the chatbot icon in the bottom right corner
//     const icon = document.createElement('div');
//     icon.style.position = 'fixed';
//     icon.style.bottom = '20px';
//     icon.style.right = '20px';
//     icon.style.width = '50px';
//     icon.style.height = '50px';
//     icon.style.backgroundColor = '#008CBA';
//     icon.style.borderRadius = '50%';
//     icon.style.display = 'flex';
//     icon.style.justifyContent = 'center';
//     icon.style.alignItems = 'center';
//     icon.style.cursor = 'pointer';
//     icon.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
//     icon.textContent = "💬";  // You can replace this with an image icon
  
//     document.body.appendChild(icon);
  
//     // Add an event listener to open the chatbot when the icon is clicked
//     icon.addEventListener('click', () => {
//       console.log("Icon clicked, opening the chatbot...");
//       openChatbot();
//     });
//   };
  
//   // Function to display the chatbot
//   function openChatbot() {
//     const chatbot = document.createElement('div');
//     chatbot.id = 'chatbot';
//     chatbot.style.position = 'fixed';
//     chatbot.style.bottom = '80px';
//     chatbot.style.right = '20px';
//     chatbot.style.width = '300px';
//     chatbot.style.height = '400px';
//     chatbot.style.backgroundColor = '#fff';
//     chatbot.style.border = '1px solid #ddd';
//     chatbot.style.zIndex = '9999';
//     chatbot.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
//     document.body.appendChild(chatbot);
  
//     // Add some content to simulate a chatbot UI
//     chatbot.innerHTML = `
//         <h3>Chatbot</h3>
//         <p>Hello! How can I assist you today?</p>
//         <input type="text" placeholder="Type here..." />
//     `;
//   }

// const API_BASE_URL = "http://127.0.0.1:8000";

// // Chatbot UI elements
// let chatContainer;
// let chatToggleButton;
// let chatWindow;
// let chatHeader;
// let chatBody;
// let chatFooter;
// let inputField;
// let sendButton;
// let messages = [];
// let convoId = '';
// let loading = false;

// // Function to toggle the chatbot window visibility
// const toggleChatbot = () => {
//   if (chatWindow.style.display === 'none') {
//     chatWindow.style.display = 'block';
//   } else {
//     chatWindow.style.display = 'none';
//   }
// };

// // Function to send a new message
// const sendMessage = async () => {
//   const input = inputField.value.trim();
//   if (input && !loading) {
//     messages.push({ text: input, isUser: true });
//     updateChat();
//     inputField.value = '';
//     loading = true;
//     const response = await generateAnswer(input);
//     messages.push({ text: response, isUser: false });
//     updateChat();
//     loading = false;
//   }
// };

// // Function to update the chat UI
// const updateChat = () => {
//   chatBody.innerHTML = '';
//   messages.forEach(msg => {
//     const messageDiv = document.createElement('div');
//     messageDiv.style.padding = '10px';
//     messageDiv.style.borderRadius = '10px';
//     messageDiv.style.maxWidth = '70%';
//     messageDiv.style.marginBottom = '10px';
//     messageDiv.style.backgroundColor = msg.isUser ? '#6c63ff' : '#f1f1f1';
//     messageDiv.style.color = msg.isUser ? 'white' : 'black';
//     messageDiv.style.textAlign = msg.isUser ? 'right' : 'left';
//     messageDiv.innerText = msg.text;
//     chatBody.appendChild(messageDiv);
//   });

//   // Scroll to the bottom
//   chatBody.scrollTop = chatBody.scrollHeight;
// };

// // Function to create a conversation and get the convoId
// const createConversation = async () => {
//   const response = await fetch(`${API_BASE_URL}/create_convo`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ user_id: '1', website_url: "https://blog.google/technology/ai/google-palm-2-ai-large-language-model/" })
//   });
//   const data = await response.json();
//   convoId = data.convo_id;
// };

// // Function to generate an answer from the bot
// const generateAnswer = async (query) => {
//   const response = await fetch(`${API_BASE_URL}/generate_answer/${convoId}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ query })
//   });
//   const data = await response.json();
//   return data.message;
// };

// // Create the chatbot UI and append it to the body
// const createChatbotUI = () => {
//   chatContainer = document.createElement('div');
//   chatContainer.style.position = 'fixed';
//   chatContainer.style.bottom = '20px';
//   chatContainer.style.right = '20px';
//   chatContainer.style.zIndex = '1000';
//   chatContainer.style.display = 'flex';
//   chatContainer.style.flexDirection = 'column';
//   chatContainer.style.alignItems = 'flex-end';

//   // Create the toggle button
//   chatToggleButton = document.createElement('button');
//   chatToggleButton.innerText = 'Chat';
//   chatToggleButton.style.backgroundColor = '#6c63ff';
//   chatToggleButton.style.color = 'white';
//   chatToggleButton.style.border = 'none';
//   chatToggleButton.style.borderRadius = '50%';
//   chatToggleButton.style.padding = '15px';
//   chatToggleButton.style.fontSize = '18px';
//   chatToggleButton.style.cursor = 'pointer';
//   chatToggleButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
//   chatToggleButton.addEventListener('click', () => {
//     toggleChatbot();
//     if (!convoId) createConversation();  // Initialize conversation if not already created
//   });

//   chatContainer.appendChild(chatToggleButton);

//   // Create the chat window
//   chatWindow = document.createElement('div');
//   chatWindow.style.background = 'white';
//   chatWindow.style.width = '350px';
//   chatWindow.style.height = '500px';
//   chatWindow.style.borderRadius = '15px';
//   chatWindow.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2)';
//   chatWindow.style.display = 'none';  // Hidden by default

//   // Create the chat header
//   chatHeader = document.createElement('div');
//   chatHeader.style.backgroundColor = '#6c63ff';
//   chatHeader.style.color = 'white';
//   chatHeader.style.padding = '15px';
//   chatHeader.style.fontWeight = 'bold';
//   chatHeader.innerText = 'Annie Smith';

//   chatWindow.appendChild(chatHeader);

//   // Create the chat body
//   chatBody = document.createElement('div');
//   chatBody.style.flex = '1';
//   chatBody.style.padding = '15px';
//   chatBody.style.overflowY = 'auto';
//   chatBody.style.display = 'flex';
//   chatBody.style.flexDirection = 'column';

//   chatWindow.appendChild(chatBody);

//   // Create the chat footer
//   chatFooter = document.createElement('div');
//   chatFooter.style.display = 'flex';
//   chatFooter.style.alignItems = 'center';
//   chatFooter.style.padding = '10px';
//   chatFooter.style.background = '#f9f9f9';
//   chatFooter.style.borderTop = '1px solid #ddd';

//   // Create the input field
//   inputField = document.createElement('input');
//   inputField.type = 'text';
//   inputField.placeholder = 'Type a message...';
//   inputField.style.flex = '1';
//   inputField.style.padding = '10px';
//   inputField.style.border = '1px solid #ddd';
//   inputField.style.borderRadius = '20px';
//   inputField.addEventListener('keydown', (event) => {
//     if (event.key === 'Enter') {
//       sendMessage();
//     }
//   });

//   chatFooter.appendChild(inputField);

//   // Create the send button
//   sendButton = document.createElement('button');
//   sendButton.style.backgroundColor = '#6c63ff';
//   sendButton.style.color = 'white';
//   sendButton.style.border = 'none';
//   sendButton.style.padding = '10px';
//   sendButton.style.borderRadius = '50%';
//   sendButton.style.cursor = 'pointer';
//   sendButton.innerHTML = '<i class="fa fa-paper-plane"></i>';
//   sendButton.addEventListener('click', sendMessage);

//   chatFooter.appendChild(sendButton);

//   chatWindow.appendChild(chatFooter);

//   chatContainer.appendChild(chatWindow);

//   document.body.appendChild(chatContainer);
// };

// // Initialize chatbot UI on page load
// createChatbotUI();


// const API_BASE_URL = "http://127.0.0.1:8000";

// // Chatbot UI elements
// let chatContainer;
// let chatToggleButton;
// let chatWindow;
// let chatHeader;
// let chatBody;
// let chatFooter;
// let inputField;
// let sendButton;
// let messages = [];
// let convoId = '';
// let loading = false;

// // Function to toggle the chatbot window visibility
// const toggleChatbot = () => {
//   if (chatWindow.classList.contains('hidden')) {
//     chatWindow.classList.remove('hidden');
//   } else {
//     chatWindow.classList.add('hidden');
//   }
// };

// // Function to send a new message
// const sendMessage = async () => {
//   const input = inputField.value.trim();
//   if (input && !loading) {
//     messages.push({ text: input, isUser: true });
//     updateChat();
//     inputField.value = '';
//     loading = true;
//     const response = await generateAnswer(input);
//     messages.push({ text: response, isUser: false });
//     updateChat();
//     loading = false;
//   }
// };

// // Function to update the chat UI
// const updateChat = () => {
//   chatBody.innerHTML = '';
//   messages.forEach(msg => {
//     const messageDiv = document.createElement('div');
//     messageDiv.className = msg.isUser ? 'user-message' : 'bot-message';
//     messageDiv.innerText = msg.text;
//     chatBody.appendChild(messageDiv);
//   });

//   // Scroll to the bottom
//   chatBody.scrollTop = chatBody.scrollHeight;
// };

// // Function to create a conversation and get the convoId
// const createConversation = async () => {
//   const response = await fetch(`${API_BASE_URL}/create_convo`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ user_id: '1', website_url: "https://blog.google/technology/ai/google-palm-2-ai-large-language-model/" })
//   });
//   const data = await response.json();
//   convoId = data.convo_id;
// };

// // Function to generate an answer from the bot
// const generateAnswer = async (query) => {
//   const response = await fetch(`${API_BASE_URL}/generate_answer/${convoId}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ query })
//   });
//   const data = await response.json();
//   return data.message;
// };

// // Create the chatbot UI and append it to the body
// const createChatbotUI = () => {
//   chatContainer = document.createElement('div');
//   chatContainer.className = 'chat-container';

//   // Create the toggle button
//   chatToggleButton = document.createElement('button');
//   chatToggleButton.className = 'chat-toggle-button';
//   chatToggleButton.innerText = 'Chat';
//   chatToggleButton.addEventListener('click', () => {
//     toggleChatbot();
//     if (!convoId) createConversation();  // Initialize conversation if not already created
//   });
//   chatContainer.appendChild(chatToggleButton);

//   // Create the chat window
//   chatWindow = document.createElement('div');
//   chatWindow.className = 'chat-window hidden';

//   // Create the chat header
//   chatHeader = document.createElement('div');
//   chatHeader.className = 'chat-header';
//   chatHeader.innerText = 'Annie Smith';
//   chatWindow.appendChild(chatHeader);

//   // Create the chat body
//   chatBody = document.createElement('div');
//   chatBody.className = 'chat-body';
//   chatWindow.appendChild(chatBody);

//   // Create the chat footer
//   chatFooter = document.createElement('div');
//   chatFooter.className = 'chat-footer';

//   // Create the input field
//   inputField = document.createElement('input');
//   inputField.type = 'text';
//   inputField.className = 'chat-input';
//   inputField.placeholder = 'Type a message...';
//   inputField.addEventListener('keydown', (event) => {
//     if (event.key === 'Enter') {
//       sendMessage();
//     }
//   });
//   chatFooter.appendChild(inputField);

//   // Create the send button
//   sendButton = document.createElement('button');
//   sendButton.className = 'send-button';
//   sendButton.innerHTML = '<i class="fa fa-paper-plane"></i>';
//   sendButton.addEventListener('click', sendMessage);
//   chatFooter.appendChild(sendButton);

//   chatWindow.appendChild(chatFooter);
//   chatContainer.appendChild(chatWindow);

//   document.body.appendChild(chatContainer);
// };

// // Initialize chatbot UI on page load
// createChatbotUI();


// src/contentScript/contentScript.js
// content.js
import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot instead of ReactDOM
import Chatbot from "./Chatbot.jsx";
import "./contentScript.css";

// Create a container for the chatbot extension
const chatbotContainer = document.createElement("div");
chatbotContainer.id = "chatbot-extension-container";
document.body.appendChild(chatbotContainer);

// Use createRoot to render the component
const root = createRoot(chatbotContainer);  // Create a root for the container
root.render(<Chatbot />);  // Render the Chatbot component




// This will add the chatbot to the page when the extension is loaded
// const createChatbotButton = () => {
//     const button = document.createElement('button');
//     button.style.position = 'fixed';
//     button.style.bottom = '20px';
//     button.style.right = '20px';
//     button.style.zIndex = '1000';
//     button.style.padding = '15px';
//     button.style.backgroundColor = '#6c63ff';
//     button.style.border = 'none';
//     button.style.borderRadius = '50%';
//     button.style.color = 'white';
//     button.style.fontSize = '18px';
//     button.style.cursor = 'pointer';
//     button.textContent = 'Chat';
  
//     button.addEventListener('click', () => {
//       // Open the chatbot when the button is clicked
//       openChatbot();
//     });
  
//     document.body.appendChild(button);
//   };
  
//   // Open the chatbot window
//   const openChatbot = () => {
//     // Check if the chatbot is already open
//     if (document.querySelector('.chatbot-container')) return;
  
//     // Create the chatbot container and window
//     const chatbotContainer = document.createElement('div');
//     chatbotContainer.classList.add('chatbot-container');
//     chatbotContainer.style.position = 'fixed';
//     chatbotContainer.style.bottom = '20px';
//     chatbotContainer.style.right = '20px';
//     chatbotContainer.style.zIndex = '1000';
  
//     const chatbotWindow = document.createElement('div');
//     chatbotWindow.classList.add('chatbot');
//     chatbotWindow.style.width = '300px';
//     chatbotWindow.style.height = '400px';
//     chatbotWindow.style.backgroundColor = 'white';
//     chatbotWindow.style.borderRadius = '8px';
//     chatbotWindow.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
//     chatbotWindow.style.display = 'flex';
//     chatbotWindow.style.flexDirection = 'column';
  
//     // Chat header
//     const header = document.createElement('div');
//     header.style.backgroundColor = '#6c63ff';
//     header.style.color = 'white';
//     header.style.padding = '15px';
//     header.style.display = 'flex';
//     header.style.justifyContent = 'space-between';
//     header.style.alignItems = 'center';
//     header.style.fontSize = '16px';
//     header.style.fontWeight = 'bold';
//     header.innerText = 'Chatbot';
  
//     const closeBtn = document.createElement('span');
//     closeBtn.style.cursor = 'pointer';
//     closeBtn.innerText = 'X';
//     closeBtn.addEventListener('click', () => {
//       chatbotContainer.remove();
//     });
  
//     header.appendChild(closeBtn);
//     chatbotWindow.appendChild(header);
  
//     // Chat messages body
//     const messagesBody = document.createElement('div');
//     messagesBody.classList.add('chatbot-messages');
//     messagesBody.style.flex = '1';
//     messagesBody.style.padding = '10px';
//     messagesBody.style.overflowY = 'auto';
  
//     chatbotWindow.appendChild(messagesBody);
  
//     // Chat input area
//     const inputContainer = document.createElement('div');
//     inputContainer.style.display = 'flex';
//     inputContainer.style.alignItems = 'center';
//     inputContainer.style.padding = '10px';
//     inputContainer.style.backgroundColor = '#f9f9f9';
//     inputContainer.style.borderTop = '1px solid #ddd';
  
//     const inputField = document.createElement('input');
//     inputField.type = 'text';
//     inputField.placeholder = 'Type a message...';
//     inputField.style.flex = '1';
//     inputField.style.padding = '10px';
//     inputField.style.border = '1px solid #ddd';
//     inputField.style.borderRadius = '20px';
//     inputField.style.outline = 'none';
  
//     const sendBtn = document.createElement('button');
//     sendBtn.style.padding = '10px';
//     sendBtn.style.backgroundColor = '#6c63ff';
//     sendBtn.style.color = 'white';
//     sendBtn.style.border = 'none';
//     sendBtn.style.borderRadius = '50%';
//     sendBtn.style.cursor = 'pointer';
//     sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
  
//     inputContainer.appendChild(inputField);
//     inputContainer.appendChild(sendBtn);
//     chatbotWindow.appendChild(inputContainer);
  
//     // Append the chatbot window to the container
//     chatbotContainer.appendChild(chatbotWindow);
  
//     // Append the container to the body
//     document.body.appendChild(chatbotContainer);
  
//     // Send message function
//     sendBtn.addEventListener('click', () => {
//       const userMessage = inputField.value.trim();
//       if (userMessage) {
//         const userMessageDiv = document.createElement('div');
//         userMessageDiv.classList.add('chatbot-message', 'user');
//         userMessageDiv.textContent = userMessage;
//         messagesBody.appendChild(userMessageDiv);
  
//         inputField.value = '';
  
//         // Generate bot response (you would replace this with your actual bot response logic)
//         setTimeout(() => {
//           const botMessageDiv = document.createElement('div');
//           botMessageDiv.classList.add('chatbot-message', 'bot');
//           botMessageDiv.textContent = 'Bot response to: ' + userMessage;
//           messagesBody.appendChild(botMessageDiv);
  
//           // Scroll to the bottom
//           messagesBody.scrollTop = messagesBody.scrollHeight;
//         }, 1000);
//       }
//     });
//   };
  
//   // Run the function to create the chatbot button when the script loads
//   createChatbotButton();
  