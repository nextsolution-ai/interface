// No need to import React/ReactDOM since they're global
import './styles';
import ChatBot from './components/ChatBot/ChatBot';

class VoiceflowChatWidget {
  constructor(config = {}) {
    if (typeof window === 'undefined' || !window.React || !window.ReactDOM) {
      throw new Error('React and ReactDOM must be loaded before initializing the chat widget');
    }

    this.config = {
      apiKey: config.apiKey,
      projectId: config.projectId,
      versionId: config.versionId,
      theme: config.theme || {}
    };
  }

  init() {
    try {
      // Create container div if it doesn't exist
      let container = document.getElementById('voiceflow-chat');
      if (!container) {
        container = document.createElement('div');
        container.id = 'voiceflow-chat';
        document.body.appendChild(container);
      }

      // Initialize React
      const root = window.ReactDOMClient.createRoot(container);
      root.render(
        window.React.createElement(ChatBot, {
          apiKey: this.config.apiKey,
          projectId: this.config.projectId,
          versionId: this.config.versionId,
          theme: this.config.theme
        })
      );
    } catch (error) {
      console.error('Failed to initialize chat widget:', error);
      throw error;
    }
  }
}

// Export the class directly
export default VoiceflowChatWidget; 