import React, { useState, useEffect, useRef } from 'react';
import { interact, saveTranscript } from '../../api/voiceflow';
import './ChatBot.css';

const ChatBot = ({ apiKey, projectId, versionId, theme = {} }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [buttons, setButtons] = useState([]);
    const [sessionId, setSessionId] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        setSessionId(`user-${Date.now()}`);
    }, []);

    useEffect(() => {
        let mounted = true;
        
        if (isOpen && messages.length === 0 && sessionId) {
            (async () => {
                if (mounted) {
                    console.log('🎬 Starting initial conversation');
                    const result = await interact(sessionId, { type: 'launch' }, apiKey);
                    if (result) {
                        console.log('📩 Initial response:', result);
                        if (result.messages.length > 0) {
                            setMessages(result.messages.map(msg => ({ 
                                type: 'bot', 
                                content: msg 
                            })));
                        }
                        if (result.buttons.length > 0) {
                            setButtons(result.buttons);
                        }
                        if (result.images.length > 0) {
                            setMessages(prev => [
                                ...prev,
                                ...result.images.map(img => ({ 
                                    type: 'bot', 
                                    content: img,
                                    isImage: true 
                                }))
                            ]);
                        }
                    }
                }
            })();
        }

        return () => {
            mounted = false;
        };
    }, [isOpen, messages.length, sessionId, apiKey]);

    const handleInteract = async (request) => {
        console.log('🤖 Handling interaction:', { sessionId, request });
        const result = await interact(sessionId, request, apiKey);
        if (!result) return false;

        console.log('👾 Processing interaction result:', result);

        if (result.messages.length > 0) {
            setMessages(prev => [
                ...prev,
                ...result.messages.map(msg => ({ type: 'bot', content: msg }))
            ]);
        }

        if (result.images.length > 0) {
            setMessages(prev => [
                ...prev,
                ...result.images.map(img => ({ 
                    type: 'bot', 
                    content: img,
                    isImage: true 
                }))
            ]);
        }

        if (result.buttons.length > 0) {
            setButtons(result.buttons);
        } else {
            setButtons([]);
        }

        return !result.isEnded;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        
        const userInput = input.trim();
        console.log('📤 User input:', userInput);
        
        setInput('');
        const userMessage = { type: 'user', content: userInput };
        setMessages(prev => [...prev, userMessage]);
        
        await handleInteract({ type: 'text', payload: userInput });
        await saveTranscript(sessionId, userMessage, { apiKey, projectId, versionId });
    };

    const handleButtonClick = async (button) => {
        console.log('🔘 Button clicked:', button);
        
        const userMessage = { type: 'user', content: button.name };
        setMessages(prev => [...prev, userMessage]);
        
        await handleInteract(button.request);
        
        await saveTranscript(sessionId, userMessage, { apiKey, projectId, versionId });
        setButtons([]);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    // Apply custom theme if provided
    const customStyles = {
        '--primary-color': theme.primaryColor || '#007bff',
        '--text-color': theme.textColor || '#333',
        '--background-color': theme.backgroundColor || '#fff',
        // ... other theme variables
    };

    return (
        <div className="chatbot-wrapper" style={customStyles}>
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>Chat Assistant</h3>
                        <button className="close-button" onClick={toggleChat}>×</button>
                    </div>
                    <div className="messages-container">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.type}`}>
                                {message.isImage ? (
                                    <img 
                                        src={message.content} 
                                        alt="Bot shared content" 
                                        className="message-image"
                                    />
                                ) : (
                                    message.content
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    {buttons.length > 0 && (
                        <div className="buttons-container">
                            {buttons.map((button, index) => (
                                <button 
                                    key={index}
                                    onClick={() => handleButtonClick(button)}
                                    className="choice-button"
                                >
                                    {button.name}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="input-form">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="chat-input"
                        />
                        <button type="submit" className="send-button">Send</button>
                    </form>
                </div>
            )}
            
            <button 
                className={`chat-bubble ${isOpen ? 'active' : ''}`} 
                onClick={toggleChat}
            >
                <svg 
                    viewBox="0 0 24 24" 
                    width="24" 
                    height="24" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    {isOpen ? (
                        <path d="M18 6L6 18M6 6l12 12"/>
                    ) : (
                        <>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            <line x1="9" y1="10" x2="15" y2="10"/>
                            <line x1="9" y1="14" x2="15" y2="14"/>
                        </>
                    )}
                </svg>
            </button>
        </div>
    );
};

export default ChatBot;
