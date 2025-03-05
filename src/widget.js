import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatBot from './components/ChatBot/ChatBot';

class VoiceflowChat {
  constructor(config = {}) {
    this.config = {
      apiKey: config.apiKey,
      projectId: config.projectId,
      versionId: config.versionId,
      theme: config.theme || {}
    };
  }

  init() {
    // Create container div if it doesn't exist
    let container = document.getElementById('voiceflow-chat');
    if (!container) {
      container = document.createElement('div');
      container.id = 'voiceflow-chat';
      document.body.appendChild(container);
    }

    // Initialize React
    const root = createRoot(container);
    root.render(
      <ChatBot 
        apiKey={this.config.apiKey}
        projectId={this.config.projectId}
        versionId={this.config.versionId}
        theme={this.config.theme}
      />
    );
  }
}

// Make it available globally
window.VoiceflowChat = VoiceflowChat; 