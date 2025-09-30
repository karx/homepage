---
name: kaaroHands
title: "Poker Hand Capture - AI-Driven Session Tracking"
categories:
  - Project
  - Personal
status: Deployed
type: Web Application
layout: projecto
excerpt: "AI-powered poker session tracking with natural language input and real-time visualization"
features:
  - title: Natural Language Input
    fontawesome_icon_name: microphone
  - title: Real-time Visualization
    fontawesome_icon_name: chart-line
  - title: AI-Powered Parsing
    fontawesome_icon_name: brain
  - title: MCP Server Ready
    fontawesome_icon_name: plug
  - title: Multi-player Sessions
    fontawesome_icon_name: users
  - title: One-Click Deploy
    fontawesome_icon_name: rocket
  - title: Firebase Backend
    fontawesome_icon_name: database
  - title: Responsive Design
    fontawesome_icon_name: mobile-alt
feature_image: /assets/images/poker-hands/main-interface.jpeg
header: 
    overlay_image: /assets/images/poker-hands/main-interface.jpeg
    teaser: /assets/images/poker-hands/main-interface.jpeg
    overlay_filter: 0.7
tags:
  - JavaScript
  - Firebase
  - Gemini API
  - MCP
  - AI
  - Poker
  - Chart.js
  - Natural Language Processing
---

An innovative poker session tracking application built entirely through AI-assisted development, showcasing the future of human-AI collaboration in software engineering.

## 🎯 Project Overview

kaaroHands revolutionizes poker session tracking by combining natural language processing with real-time data visualization. Players can simply speak their stack updates naturally - "Current stack 21,500" or "Stack at 18k" - and the AI intelligently parses this into structured data for analysis.

Built as both a web application and an MCP (Model Context Protocol) server, this project demonstrates "Intent-Driven Development" - a methodology where human intent guides AI implementation to create sophisticated, agent-native applications.

## 🏗️ Technical Architecture

### Core Technologies
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **AI Integration**: Google Gemini API
- **Visualization**: Chart.js with time-series support
- **Deployment**: Gitpod, Netlify-ready

### Design Philosophy
- **Lightweight**: No heavy frameworks, pure web fundamentals
- **Agent-Native**: Built as MCP server for AI integration
- **Real-time**: Live data synchronization across sessions
- **Responsive**: Works seamlessly on all devices

## 🤖 AI Integration Deep Dive

The heart of kaaroHands lies in its sophisticated natural language processing:

```javascript
// Input: "Current stack is 21,500"
// Output: {"action": "stack_update", "payload": {"stackSize": 21500}}
```

### Gemini API Integration
- **Function Calling**: Structured data extraction from casual speech
- **Context Awareness**: Understands poker terminology and context
- **Error Handling**: Graceful fallbacks for ambiguous input
- **Real-time Processing**: Instant parsing and validation

## 📊 Screenshots Gallery

### Main Interface
![Main Interface](/assets/images/poker-hands/main-interface.jpeg)
*Clean, intuitive interface for session setup and player management*

### Data Visualization
![Data Visualization](/assets/images/poker-hands/data-visualization.jpeg)
*Real-time Chart.js visualization showing stack progression over time*

### Natural Language Processing
![Natural Language Input](/assets/images/poker-hands/natural-language-input.jpeg)
*AI-powered input processing that understands natural speech patterns*

## 🚀 Try It Yourself

Experience the power of AI-driven development firsthand:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/karx/kaaroHands)

### Quick Setup
1. Click the Gitpod button above
2. Wait for environment initialization (2-3 minutes)
3. Add your Gemini API key to `.env`
4. Run `npm start`
5. Start tracking your poker sessions!

## 🔮 MCP Server Architecture

kaaroHands is built as a Model Context Protocol server, making it ready for the AI-native future:

### Available Tools
- `updateOrCreateSession` - Session management
- `updateProfile` - Player profile updates
- `addDataRecording` - Stack size logging
- `getSessionReport` - Data visualization
- `amendDataRecording` - Edit historical data
- `removeDataRecording` - Remove entries

### Agent Integration
Other AI agents can discover and use these capabilities programmatically, enabling complex automated workflows and integrations.

## 📖 Development Story

This project showcases "Intent-Driven Development" - a revolutionary approach to AI-assisted software engineering. Read the complete story of how this application was built through structured human-AI collaboration:

**[Read the Full Development Story →](/2025/09/30/poker-hands-ai-development/)**

The blog post covers:
- The 5-phase Intent-Driven Development cycle
- Real debugging sessions with AI
- Architectural decisions and trade-offs
- The future of agent-native applications

## 💻 Source Code & Resources

### GitHub Repository
**[View Source Code →](https://github.com/karx/kaaroHands)**

The repository includes:
- Complete source code with documentation
- Unit tests for all modules
- Environment setup instructions
- API testing documentation
- Security guidelines

### Key Features
- **Comprehensive Documentation**: Setup guides and API docs
- **Security First**: Best practices for API key management
- **Testing Suite**: Unit tests for reliability
- **Development Ready**: Easy local and cloud setup

## 🎮 Use Cases

### For Poker Players
- Track stack progression during live games
- Analyze session performance over time
- Share session data with study groups
- Voice-activated logging during play

### For Developers
- Learn AI-assisted development techniques
- Study MCP server implementation
- Explore natural language processing
- Understand agent-native architecture

### For AI Researchers
- Examine human-AI collaboration patterns
- Study function calling implementations
- Analyze structured data extraction
- Research agent interoperability

## 🌟 What Makes It Special

1. **AI-First Design**: Built from the ground up for AI interaction
2. **Natural Interface**: Speak naturally, no rigid commands
3. **Real-time Sync**: Live updates across all connected clients
4. **Future-Proof**: MCP server ready for emerging AI ecosystems
5. **Educational**: Complete development story documented
6. **Open Source**: Full transparency and community contribution

---

*kaaroHands represents more than just a poker tracking app—it's a blueprint for the future of human-AI collaboration in software development.*