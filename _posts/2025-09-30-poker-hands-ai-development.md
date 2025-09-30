---
layout: single
title: "From Intent to App: A Deep Dive into My AI-Driven Development Workflow"
date: 2025-09-30
tags:
  - AI
  - Development
  - Poker
  - JavaScript
  - Firebase
  - MCP
excerpt: "Building a poker hand tracking app entirely through AI collaboration - a detailed journey through Intent-Driven Development and the future of agent-native applications."
header:
  teaser: /assets/images/poker-hands/main-interface.jpeg
---

# From Intent to App: A Deep Dive into My AI-Driven Development Workflow

For any poker player who takes the game seriously, the journey is one of continuous learning. It’s a game of incomplete information, where long-term success is built not on single hands, but on a foundation of solid decisions. The desire to improve is constant, and that improvement begins with measurement. How do you know if you’re making better decisions? How do you spot the patterns in your play, find your leaks, and build the self-awareness to stay confident through the inevitable swings of variance?[^29] This is where technology can be a game-changer. The joy of poker isn't just in winning; it's in the intellectual challenge, the psychological battle, and the deep satisfaction of mastering a complex skill.[^31]

This was the catalyst for an experiment. I wanted to build a simple tool for myself and my friends—a "pokerHandCapture" web app. The concept was straightforward: a lightweight, single-page app to log chip stack sizes during a game session using natural language. No complex forms, no heavy software, just a quick and easy way to capture the data needed for later analysis.[^33] But the product itself was secondary. The real experiment was in the

_process_. Could I build this application almost entirely by "talking" to an AI agent? And could I do it by embracing simplicity, building a fast, responsive frontend with vanilla HTML and JavaScript, deliberately avoiding the "noise" and complexity of modern web frameworks?[^34]

This article is the story of that journey. It’s a detailed breakdown of the powerful workflow that emerged—a pattern I’ve come to call "Intent-Driven Development." I’m going to share the complete prompt history, the technical roadblocks, and the strategic decisions that shaped the final product. My goal is to provide a replicable, real-world blueprint for anyone looking to harness AI as a true partner in the craft of building software that is both useful and a joy to use.[^26]

## Part 1: The Architect's Blueprint - Setting the Stage for the AI

The most effective AI-assisted development begins not with a prompt to write code, but with a human-centric "session zero" where the architecture, constraints, and project goals are clearly articulated.[^1] An AI agent, no matter how advanced, performs best when it has context—when it understands the "why" before it's asked to generate the "what".[^2] My journey with pokerHandCapture began here, with me acting as the architect, briefing my new AI collaborator on the project we were about to undertake.

My very first prompt wasn't about functions or classes; it was about defining the project's soul:

`{"text":"Create a markdown file for this project. pokerHandCapture. A web app where you can record a game session only using LLM agents. This is available as a gem/mcp server as well..."}`

This initial command served two critical functions. First, it established the project's vision and scope in a README file. This act of documentation is foundational. It forces clarity of thought and provides a single source of truth that both human and AI can refer back to.[^3] Second, and more subtly, it planted the seeds of a crucial, forward-thinking architectural decision. The phrase "available as a gem/mcp server as well" was not a throwaway line. It was a declaration of strategic intent that would become the project's North Star, signaling that we weren't just building a standalone web app, but a reusable, interoperable

_tool_ designed for an AI-native ecosystem.

With the vision set, the next step was to define the technical guardrails.

`{"text":"Let's init this project using a javaScript based tooling to keep the project maintainable by other teammates. For database we would be linking to firebase. We also have gemeni APIs Keys to interact with a LLM agent."}`

This prompt is a classic example of providing clear, targeted instructions.[^3] By specifying the stack—JavaScript, Firebase for the database, and Google's Gemini for LLM interactions—I was constraining the universe of possible solutions. This prevents the AI from making arbitrary choices and ensures the generated code aligns with the project's technical requirements. Crucially, this prompt intentionally omits any mention of a frontend framework like React or Vue. For a simple, single-page application focused on a core task, the overhead of a large framework felt unnecessary. The goal was to build a lightweight and fast interface directly with HTML and vanilla JavaScript, ensuring full control and a deeper connection to the web's fundamental technologies.[^34]

## Part 2: The Digital Assembly Line - Iterative Backend Construction

With the architectural blueprint in place, the process shifted from high-level planning to implementation. This phase felt like running a digital assembly line, where I would define a piece of work and the AI would construct it. The workflow naturally fell into a "Navigator-Driver" pattern, a concept often discussed in human pair programming.[^4] I acted as the navigator, charting the course, defining the API contracts, and planning the next turn. The AI was the driver, its "hands on the keyboard," translating my intent into functional code.

The sequence of prompts clearly illustrates this dynamic. I began by defining the high-level API contract, thinking about it from the perspective of an agent that would eventually consume it.

`{"text":"Let's build and expose the APIs and the MCP server together... Target set of actions to be exposed: * Update current Session Name... * Update current Profile Information... * Add new Data Recordning..."}`

This prompt didn't ask for implementation details. It defined the "what"—the set of capabilities the server should offer. Once this was established, I could zoom in and delegate a specific, scoped-down task to the AI driver.

`{"text":"Let's implement the controller we will use for /api/session. This controller would do the needful to interpret the req to do the needfull"}`

And then, breaking it down further, delegating the data layer implementation for that specific controller:

`{"text":"sessionModule functions implementation using firestore for session management."}`

This process of deconstruction is vital. Breaking a large, complex task into smaller, manageable steps makes it easier for the AI to deliver quality outputs and for the human to review and validate them.[^2]

This phase was also characterized by a tight iterative loop, a cornerstone of effective AI-assisted development.[^3] I didn't expect perfection on the first pass. Instead, I prompted for a feature, reviewed the output, and immediately followed up with refinements. For instance, after the initial session logic was generated, I clarified the business rules with a subsequent prompt:

`{"text":"A few updates to how the session management flows: * A user is added to the session. * A user is only part of a single session at a given moment..."}`

This "Build, Review, Improve—Repeat" cycle was the engine of progress. It allowed for rapid, incremental development while ensuring the evolving codebase stayed aligned with my intent.

A critical step in this verification process was enforcing quality through testing. The prompt `"Let's create unit tests for each of the functions in session.js..."` was not an afterthought. It served multiple purposes. First, it validated that the AI-generated code worked as expected. Second, it created living documentation for the API's behavior. And third, it provided a safety net for future changes.[^1] By using explicit tests, I was guiding the AI toward producing predictable, style-compliant, and robust code.[^2]

The backend that emerged from this process wasn't just a set of REST endpoints; it was a manifest of capabilities, a collection of tools ready to be wielded by an AI agent. This agent-centric view, born from the initial decision to build an MCP server, shaped the entire backend architecture.

### `pokerHandCapture` MCP Server Tool Manifest

|Tool Name|Example Intent|API Endpoint|Description|
|---|---|---|---|
|`updateOrCreateSession`|"Set current session to 'Friday Game'"|`/api/session`|Creates a new session or sets an existing one as active for the user.|
|`updateProfile`|"Set my name to 'Kaaro'"|`/api/player`|Updates the current user's profile information.|
|`addDataRecording`|"Current stack is 21500"|`/api/data`|Adds a new timestamped data record for the active user and session.|
|`amendDataRecording`|"Update the entry at 10:30 PM to 25000"|`/api/data`|Amends a specific data record identified by filters.|
|`removeDataRecording`|"Remove this entry"|`/api/data`|Marks a specific data record as removed.|
|`getSessionReport`|"Show me the charts for all players"|`/api/report`|Generates data for visualizing player stack sizes over time.|

This table distills the backend development narrative into a clear summary of the application's core functions, framed from the perspective of the AI agent that will ultimately use them.

## Part 3: The Gauntlet - A Realistic Look at AI-Assisted Debugging

No development story is complete without a journey through the gauntlet of debugging, and this project was no exception. The idea that an AI co-pilot eliminates bugs is a dangerous myth.[^1] My prompt history tells a more authentic story—one of collaboration, diagnosis, and architectural evolution in the face of failure.

It started with the dreaded, non-specific error that every developer knows:

`{"text":"I am getting 500 for all API calls..."}`

The AI is not a mind reader. My first step wasn't to ask "fix it," but to follow a classic, human-driven debugging strategy: increase visibility.

`{"text":"Let's add logs to better understand the flow and look for the fixes"}`

This is a crucial point in the human-AI collaboration. The human's role is to diagnose the problem domain ("I have a bug and I can't see what's happening") and propose a strategy ("let's add logging"). The AI's role is to execute that strategy.

The logs quickly pinpointed the root cause, a subtle but critical parsing error that became a major pivot point for the project's architecture.

`{"text":"The transcript logs: 'Voice input: Current stack 10,000.' The newStack size when parsing is going only as 10. Can we improve the parsing logic. We can use Gemeni API to parse the transcript to get the required payload and action."}`

This prompt reveals so much about the nature of AI-assisted development. The initial implementation, likely a simple regex or string split, was brittle. It failed on a common real-world input containing a comma. My response wasn't to ask the AI to write a more complex regex. Instead, I made a strategic decision to offload the entire problem of natural language understanding to a specialized tool: the Gemini LLM. This was essential to preserving the joy of using the app; a poker player needs to be able to speak naturally without worrying about formatting.[^29]

This wasn't just a bug fix; it was an architectural evolution. The plan was to take the unstructured user input (e.g., "Current stack at 21500") and use the Gemini API to transform it into a structured JSON object that our backend could easily understand, something like `$${"action": "stack_update", "payload": {"stackSize": 21500}}$$`. This approach leverages a powerful pattern known as function calling, where an LLM is used to determine the user's intent and extract the necessary parameters to call a specific tool or function.[^7] By providing the LLM with a clear output schema, you can achieve highly reliable structured data extraction from messy, natural language inputs.[^9]

At this moment, the application became truly "agent-native." The initial problem of a simple parsing bug directly led to an elegant architecture where one AI agent (Gemini, handling the natural language interface) would generate a structured request to be consumed by our backend, which was designed from day one to act as another agent's tool server (the MCP server). The debugging process with an AI is not a passive experience of receiving fixes. It's an active, collaborative dialogue where the human's deep understanding of architecture and problem domains guides the AI's powerful implementation capabilities toward a more robust and sophisticated solution.[^3]

## Part 4: Crafting the Interface - Overcoming Frontend Friction

With a robust, agent-native backend in place, the focus shifted to the user interface. The philosophy from the start was to keep it simple, fast, and free of unnecessary dependencies. For a focused tool like this, a heavy JavaScript framework would be overkill, adding complexity and slowing down load times without providing significant benefits.[^35] The decision was to build a single-page application using only vanilla HTML, CSS, and JavaScript. This approach offers complete control, reinforces fundamental web development skills, and results in a lightweight, performant final product.[^34]

Of course, building without a framework doesn't mean building without challenges. It simply changes the nature of the problems you solve. Instead of wrestling with framework-specific lifecycle methods or state management libraries, you engage directly with the core technologies of the web. My prompt history illustrates this perfectly through the Chart.js conundrum.

The journey began with a simple request to create the UI:

`{"text":"Let's start also creating a small HTML (web app) that would be used by the users to interact with this platform. The app should be super simple..."}`

The initial implementation quickly ran into a wall when it came time to visualize the data. This led to a cascade of prompts that tell a classic story of frontend data wrangling.

It started with a configuration error: `{"text":"For chart.js to work in index.html, we need to provide it with a date adapter. It is throwing error: 'Check that a complete date adapter is provided.' "}`. This was followed by another: `{"text":"We are now seeing error saying 'locale must contain localize property'}"`.

These errors pointed to a fundamental requirement of using time-series data in Chart.js: it needs an external date library and a corresponding adapter to correctly interpret and format dates.[^13] But even after adding the adapter, the core problem remained. The data coming from Firestore was in a format that Chart.js couldn't natively understand.

`{"text":"In html is not able to parse the date properly from the firestore record to plot it on chart. Here is a sample object of the entry: {\"timestamp\": {\"_seconds\": 1753891529, \"_nanoseconds\": 586000000}}..."}`

This is the crux of the issue. The Firestore `Timestamp` object is a proprietary format, not a standard JavaScript `Date` object.[^15] To make this work, a multi-step data transformation was required on the client side:

[^5]: The Firestore `Timestamp` object must first be converted into a standard JavaScript `Date` object using its built-in `.toDate()` method.[^16]
    
[^5]: Chart.js's time scale internally uses milliseconds since the UNIX epoch (January 1, 1970).[^13] The JavaScript
    
    `Date` object can provide this value.
    
[^5]: This numeric timestamp can then be fed into Chart.js, which, with the proper date adapter installed, can now correctly plot the data point on the time-series axis.[^17]
    

This detailed, multi-step process is a perfect example of where a human developer's specific domain knowledge is indispensable. While I used the AI to implement the code for the conversion, the diagnosis of the problem and the knowledge of the required transformation steps came from human experience.

The friction didn't stop with data formatting. The next series of prompts focused on ensuring the visual integrity of the chart, a task that requires a keen eye for detail.

`{"text":"The data we are fetching to power the charts is not filtering out the entries marked as deleted 'isRemoved'. Also if a record is ammended. We do not plot the older value in the chart."}`

And a follow-up to handle edge cases:

`{"text":"Need to also ensure that null values or missing key is also considered as false"}`

These prompts show the meticulous refinement process needed to build a polished user experience. The AI can generate the initial chart, but the human is the one who notices that deleted items are still being plotted or that amended records are creating duplicates. The developer's role here shifts from architect to a meticulous quality assurance engineer and data-wrangler, ensuring the final output is not just functional, but correct and intuitive for the end-user.

## Part 5: The Emergent Pattern - A Framework for "Intent-Driven Development"

Reflecting on the entire journey, from the initial architectural sketch to the final frontend polish, a distinct and powerful pattern emerged. It wasn't a process of simply asking an AI to "build an app." It was a structured, cyclical dialogue, a partnership where human intent guided AI implementation. I’ve formalized this workflow into a framework I call "Intent-Driven Development" (IDD). It’s a practical, repeatable model for collaborating with AI agents that elevates the developer's role and leads to higher-quality outcomes.

The Intent-Driven Development (IDD) cycle consists of five distinct phases:

[^5]: **Architect (Human):** The cycle begins with human-centric planning. The developer defines the project's high-level vision, core features, target audience, and, crucially, the technical and architectural constraints. This is the "macro-intent" that sets the entire project's direction. This phase corresponds to the initial prompts defining the README and technology stack.[^1]
    
[^5]: **Deconstruct & Prompt (Human):** The developer breaks down the macro-intent into a single, actionable, natural-language task. This "micro-intent" is then formulated into a clear, context-rich prompt for the AI agent. A good prompt is specific, provides constraints, and clearly defines the desired outcome (e.g., "Implement the controller for `/api/session` using Express.js and connect it to the Firestore session module").[^3]
    
[^5]: **Implement (AI):** The AI agent takes the micro-intent and generates the necessary code. In this phase, the AI acts as the "driver," handling the rote task of writing boilerplate, implementing algorithms, and connecting components according to the human's specification.[^18]
    
[^5]: **Verify (Human & AI):** This is a critical feedback loop. The human first reviews the AI-generated code for logic, correctness, and adherence to project standards. This human oversight is non-negotiable.[^1] Then, the human leverages the AI again, prompting it to generate unit tests, integration tests, or documentation for the newly created code. This creates an automated verification layer that solidifies quality and guards against future regressions.[^2]
    
[^5]: **Refine & Iterate (Human & AI):** Based on the verification step, the human identifies bugs, missing edge cases, or new requirements. These observations are then formulated into a new "micro-intent" prompt (e.g., "A few updates to how the session management flows..." or "The data is not filtering out removed entries"). This new prompt kicks off the cycle again, leading to continuous, incremental improvement.
    

This IDD framework is not revolutionary in its components—it mirrors many agile and iterative development principles. Its power lies in how it adapts these principles for the new paradigm of human-AI collaboration. It explicitly acknowledges the strengths and weaknesses of both partners. The human excels at strategic thinking, architectural design, and nuanced problem diagnosis. The AI excels at rapid implementation and handling repetitive tasks like writing tests or boilerplate. The IDD cycle provides the structure for this synergy, ensuring that development is a purposeful, intent-led process, rather than a series of disconnected, ad-hoc requests.

## Part 6: The Strategic Endgame - Why Building as an MCP Server is the Future

Let's return to that seemingly small detail from my very first prompt: the decision to make the application available as a "gem/mcp server." This wasn't just a technical choice; it was a strategic one that fundamentally changed the nature and future potential of the project. To understand why, we need to demystify the Model Context Protocol (MCP).

In simple terms, MCP is an open standard designed to be a universal connector for AI.[^20] Think of it like a USB-C port for AI applications.[^22] Before USB-C, every device had its own proprietary charger and data cable, creating a tangled mess of incompatibility. Similarly, before MCP, every AI model needed a custom, one-off integration to connect to an external tool or data source. MCP provides a standardized way for AI models to discover and interact with these external resources, whether it's a database, a file system, or a third-party API.[^23] The protocol defines a clear architecture of a

**Host** (the AI assistant, like Cursor or Claude), a **Client** (a connector within the host), and a **Server** (an interface built for a target application, like our poker app).[^21]

By building `pokerHandCapture` as an MCP server, I was doing more than creating a web application. I was creating a composable, agent-addressable "tool" that could be plugged into a larger, interoperable AI ecosystem.[^20] The backend API we so carefully constructed—with its clear actions like

`updateSession` and `addDataRecording`—was no longer just for serving our simple HTML frontend. It was now a set of capabilities that any MCP-compatible AI agent could discover and invoke programmatically.[^25] The application was no longer just for human users; it was for AI users, too.

This reveals a profound potential shift in what it means to "build an app." The journey of this project demonstrates this evolution perfectly. I built a UI, but the most elegant and powerful part of the final architecture is the backend API, which is now perfectly suited to be called by another AI. The ultimate value of `pokerHandCapture` might not be its simple webpage. Imagine a more sophisticated AI agent that could watch a live-streamed poker game, use computer vision to track chip stacks, and then call my MCP server's tools to log the data automatically. In this future, my application becomes a vital component in a more complex, automated workflow.

This suggests a future where developer focus may shift away from building monolithic UIs and toward creating high-quality, well-documented, and secure "tools" exposed via protocols like MCP. The value we create will be measured not just by the user-facing interfaces we build, but by the power and reusability of the agent-facing capabilities we provide.

## Conclusion: Reflections from the AI Cockpit

This journey, from a single line of intent to a fully functional, agent-native application, has been more revealing than I could have imagined. It confirmed that the reality of AI pair programming is far more nuanced and collaborative than the simplistic demos suggest. The emergent "Intent-Driven Development" pattern provides a tangible framework for this collaboration, one that respects the irreplaceable role of the human architect while harnessing the incredible implementation speed of the AI agent.

This process fundamentally changes the nature of the developer's work. The job is elevated. Less time is spent on the syntax of a `for` loop or the boilerplate of an API endpoint, and more time is spent on the things that truly matter: architectural integrity, systems thinking, clear communication of intent, meticulous quality review, and long-term strategic vision.[^18] There's a unique joy in building a tool that scratches your own itch—one that directly enhances a personal passion like poker by making data collection and analysis seamless. 29 It also reinforces the importance of choosing the right tool for the job; the decision to build a lightweight frontend with vanilla JavaScript, forgoing a heavy framework, resulted in a faster, more focused application that was a pleasure to develop.[^34]

My hope is that by sharing this detailed, transparent account—the successes, the frustrating bugs, and the emergent workflows—I can encourage others in the developer community to embark on their own AI-assisted projects.[^26] The learning curve is real, but the potential to augment our creativity and productivity is immense. Don't be afraid to start small, to document your journey, and to share what you learn with the rest of us. Self-promotion and community sharing are not acts of vanity; they are vital for our collective and personal growth.[^26]

So, to anyone who is curious but hesitant, I'll pass on the advice that has served so many of us well: hit "Publish" and go with the flow![^26]

## Screenshots & Demo

The final application showcases a clean, minimal interface that prioritizes functionality over flashy design. Here's what the user experience looks like:

### Main Interface

![Main poker hand capture interface](/assets/images/poker-hands/main-interface.jpeg)
*The main interface showing session setup and data entry functionality*

The landing page presents users with a simple session setup where they can name their poker session and begin tracking immediately.

### Data Visualization

![Chart.js visualization showing stack progression](/assets/images/poker-hands/data-visualization.jpeg)
*Chart.js integration displaying stack size changes over time with proper time-series handling*

The Chart.js integration provides clear visual feedback on stack progression throughout a session, with proper time-series handling for Firestore timestamps.

### Natural Language Input

![Natural language input processing example](/assets/images/poker-hands/natural-language-input.jpeg)
*Example of natural language input being processed by the Gemini API*

Users can input data naturally - "Current stack 21,500" or "Stack at 18k" - and the Gemini API intelligently parses this into structured data.

## Try It Yourself: One-Click Gitpod Deployment

Want to experience this AI-driven development workflow firsthand? You can spin up the entire project in a cloud development environment with a single click:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/karx/kaaroHands)

### What You'll Get

When you open the project in Gitpod, you'll have:

[^5]: **Pre-configured Environment**: Node.js, npm, and all dependencies automatically installed
[^5]: **Development Server**: Ready to run with `npm start`
[^5]: **Live Preview**: Instant access to the running application
[^5]: **Full IDE**: VS Code in the browser with all extensions
[^5]: **Terminal Access**: Complete development environment

### Quick Setup in Gitpod

[^5]: Click the Gitpod button above
[^5]: Wait for the environment to initialize (2-3 minutes)
[^5]: Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
[^5]: Add your Gemini API key to `.env`:
   ```bash
   # Get your key from https://aistudio.google.com/
   GEMINI_API_KEY=your_api_key_here
   ```
[^5]: Start the development server:
   ```bash
   npm start
   ```
[^5]: Open the preview URL to see the app running

### Local Development Alternative

If you prefer local development:

```bash
# Clone the repository
git clone https://github.com/karx/kaaroHands.git
cd kaaroHands

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm start
```

### Project Structure

The codebase demonstrates the clean architecture that emerged from the AI collaboration:

```
kaaroHands/
├── src/
│   ├── index.js          # Express server entry point
│   ├── controllers/      # API route handlers
│   ├── modules/          # Business logic (session, player, data)
│   └── public/           # Frontend assets (HTML, CSS, JS)
├── tests/                # Unit tests for all modules
├── .env.example          # Environment template
└── README.md             # Comprehensive setup guide
```

## The MCP Server Advantage

One of the most forward-thinking aspects of this project is its dual nature as both a web application and an MCP (Model Context Protocol) server. This means:

- **Agent Integration**: Other AI agents can discover and use the poker tracking capabilities
- **Composable Architecture**: The backend APIs are designed for programmatic access
- **Future-Proof**: Ready for the emerging ecosystem of AI-native applications

The MCP server exposes these core tools:
- `updateOrCreateSession` - Session management
- `updateProfile` - Player profile updates  
- `addDataRecording` - Stack size logging
- `getSessionReport` - Data visualization

## Technical Highlights

### AI-Powered Natural Language Processing
The integration with Google's Gemini API transforms casual speech into structured data:

```javascript
// Input: "Current stack is 21,500"
// Output: {"action": "stack_update", "payload": {"stackSize": 21500}}
```

### Vanilla JavaScript Frontend
Deliberately avoiding heavy frameworks resulted in:
- **Fast Load Times**: Minimal JavaScript bundle
- **Direct Control**: No abstraction layers
- **Learning Value**: Pure web fundamentals

### Firebase Integration
Seamless cloud storage with:
- **Real-time Updates**: Live session synchronization
- **Scalable Architecture**: Ready for multiple users
- **Timestamp Handling**: Proper time-series data management

---

*This project represents more than just a poker tracking app—it's a blueprint for the future of human-AI collaboration in software development. The complete source code and documentation are available on [GitHub](https://github.com/karx/kaaroHands).*

## References

[^1]: AI-Assisted Software Development: The Ultimate Practical Guide, accessed on August 5, 2025, [https://devoxsoftware.com/blog/ai-assisted-software-development-the-ultimate-practical-guide/](https://devoxsoftware.com/blog/ai-assisted-software-development-the-ultimate-practical-guide/)

[^2]: 5 Best Practices for AI-Assisted Development and Vibe Coding - CodeRide, accessed on August 5, 2025, [https://coderide.ai/blog/5-best-practices-for-ai-assisted-development-and-vibe-coding](https://coderide.ai/blog/5-best-practices-for-ai-assisted-development-and-vibe-coding)

[^3]: Best Practices for Using AI in Software Development 2025 - Leanware, accessed on August 5, 2025, [https://www.leanware.co/insights/best-practices-ai-software-development](https://www.leanware.co/insights/best-practices-ai-software-development)

[^4]: What is Pair Programming? Benefits & How It Works - Qodo, accessed on August 5, 2025, [https://www.qodo.ai/glossary/pair-programming/](https://www.qodo.ai/glossary/pair-programming/)

[^5]: Why pair programming? : r/learnprogramming - Reddit, accessed on August 5, 2025, [https://www.reddit.com/r/learnprogramming/comments/1ezkhiu/why_pair_programming/](https://www.reddit.com/r/learnprogramming/comments/1ezkhiu/why_pair_programming/)

[^6]: 15 Best AI Coding Assistant Tools in 2025 - Qodo, accessed on August 5, 2025, [https://www.qodo.ai/blog/best-ai-coding-assistant-tools/](https://www.qodo.ai/blog/best-ai-coding-assistant-tools/)

[^7]: Function calling with the Gemini API | Google AI for Developers, accessed on August 5, 2025, [https://ai.google.dev/gemini-api/docs/function-calling](https://ai.google.dev/gemini-api/docs/function-calling)

[^8]: The Gemini API and the Internet of Things - Google Developers Blog, accessed on August 5, 2025, [https://developers.googleblog.com/en/the-gemini-api-and-the-internet-of-things/](https://developers.googleblog.com/en/the-gemini-api-and-the-internet-of-things/)

[^9]: Generate structured output (like JSON and enums) using the Gemini API | Firebase AI Logic, accessed on August 5, 2025, [https://firebase.google.com/docs/ai-logic/generate-structured-output](https://firebase.google.com/docs/ai-logic/generate-structured-output)

[^10]: Enhancing JSON Output with Large Language Models: A Comprehensive Guide - Medium, accessed on August 5, 2025, [https://medium.com/@dinber19/enhancing-json-output-with-large-language-models-a-comprehensive-guide-f1935aa724fb](https://medium.com/@dinber19/enhancing-json-output-with-large-language-models-a-comprehensive-guide-f1935aa724fb)

[^11]: Using the LLM Mesh to parse and output JSON objects - Dataiku Developer Guide, accessed on August 5, 2025, [https://developer.dataiku.com/latest/tutorials/genai/agents-and-tools/json-output/index.html](https://developer.dataiku.com/latest/tutorials/genai/agents-and-tools/json-output/index.html)

[^12]: AI Agent Best Practices: 12 Lessons from AI Pair Programming for Developers | Forge Code, accessed on August 5, 2025, [https://forgecode.dev/blog/ai-agent-best-practices/](https://forgecode.dev/blog/ai-agent-best-practices/)

[^13]: Time Cartesian Axis - Chart.js, accessed on August 5, 2025, [https://www.chartjs.org/docs/latest/axes/cartesian/time.html](https://www.chartjs.org/docs/latest/axes/cartesian/time.html)

[^14]: How to use timescales and how to enter dates and time in Chart JS - YouTube, accessed on August 5, 2025, [https://www.youtube.com/watch?v=H1y66SPBlRI](https://www.youtube.com/watch?v=H1y66SPBlRI)

[^15]: How To Convert Firestore Timestamp To JavaScript Date - YouTube, accessed on August 5, 2025, [https://www.youtube.com/watch?v=SHrp7cLXr9s](https://www.youtube.com/watch?v=SHrp7cLXr9s)

[^16]: Timestamp | JavaScript SDK | Firebase JavaScript API reference - Google, accessed on August 5, 2025, [https://firebase.google.com/docs/reference/js/v8/firebase.firestore.Timestamp](https://firebase.google.com/docs/reference/js/v8/firebase.firestore.Timestamp)

[^17]: chart.js - Adding a Date adapter for Time Cartesian axis from a cdn - Stack Overflow, accessed on August 5, 2025, [https://stackoverflow.com/questions/68453600/adding-a-date-adapter-for-time-cartesian-axis-from-a-cdn](https://stackoverflow.com/questions/68453600/adding-a-date-adapter-for-time-cartesian-axis-from-a-cdn)

[^18]: Pair Programming with AI Coding Agents: Is It Beneficial? - Zencoder, accessed on August 5, 2025, [https://zencoder.ai/blog/best-practices-for-pair-programming-with-ai-coding-agents](https://zencoder.ai/blog/best-practices-for-pair-programming-with-ai-coding-agents)

[^19]: Benefits of Pair Programming with Generative AI - Infosys Blogs, accessed on August 5, 2025, [https://blogs.infosys.com/digital-experience/emerging-technologies/pair-programming-and-benefits.html](https://blogs.infosys.com/digital-experience/emerging-technologies/pair-programming-and-benefits.html)

[^20]: Introducing the Model Context Protocol - Anthropic, accessed on August 5, 2025, [https://www.anthropic.com/news/model-context-protocol](https://www.anthropic.com/news/model-context-protocol)

[^21]: What is an MCP Server? Why Developers Should Care - Akuity, accessed on August 5, 2025, [https://akuity.io/blog/what-is-an-mcp-server](https://akuity.io/blog/what-is-an-mcp-server)

[^22]: Introduction - Model Context Protocol, accessed on August 5, 2025, [https://modelcontextprotocol.io/introduction](https://modelcontextprotocol.io/introduction)

[^23]: Use MCP servers in VS Code, accessed on August 5, 2025, [https://code.visualstudio.com/docs/copilot/chat/mcp-servers](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)

[^24]: MCP Explained: The New Standard Connecting AI to Everything | by Edwin Lisowski, accessed on August 5, 2025, [https://medium.com/@elisowski/mcp-explained-the-new-standard-connecting-ai-to-everything-79c5a1c98288](https://medium.com/@elisowski/mcp-explained-the-new-standard-connecting-ai-to-everything-79c5a1c98288)

[^25]: code.visualstudio.com, accessed on August 5, 2025, [https://code.visualstudio.com/docs/copilot/chat/mcp-servers#:~:text=MCP%20servers%20provide%20one%20or,discovery%2C%20invocation%2C%20and%20response%20handling](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#:~:text=MCP%20servers%20provide%20one%20or,discovery%2C%20invocation%2C%20and%20response%20handling)

[^26]: #51 - My developer blogging journey so far - Shreyas Patil's Blog, accessed on August 5, 2025, [https://blog.shreyaspatil.dev/51-my-developer-blogging-journey-so-far](https://blog.shreyaspatil.dev/51-my-developer-blogging-journey-so-far)

[^27]: Writing a development blog: how I did it and what I learned - Guillermo de la Puente, accessed on August 5, 2025, [https://guillermodlpa.com/blog/writing-a-development-blog-how-I-did-it-what-I-learned](https://guillermodlpa.com/blog/writing-a-development-blog-how-I-did-it-what-I-learned)

[^28]: Blogging Your Learn to Code Journey - DEV Community, accessed on August 5, 2025, [https://dev.to/integerman/blogging-your-learn-to-code-journey-3kjd](https://dev.to/integerman/blogging-your-learn-to-code-journey-3kjd)

[^29]: How to Track your Progress in Poker | Iredell Free News, accessed on August 5, 2025, [https://www.iredellfreenews.com/lifestyles/2025/how-to-track-your-progress-in-poker/](https://www.iredellfreenews.com/lifestyles/2025/how-to-track-your-progress-in-poker/)

[^30]: How to track your poker progress (and why you definitely should ..., accessed on August 5, 2025, [https://www.pokerstars.com/poker/learn/news/how-to-track-your-poker-results-and-why-you-definitely-should/](https://www.pokerstars.com/poker/learn/news/how-to-track-your-poker-results-and-why-you-definitely-should/)

[^31]: Poker Psychology | Expert Tips on Tells, Table Talk & More - PokerListings, accessed on August 5, 2025, [https://www.pokerlistings.com/poker-strategies/psychology](https://www.pokerlistings.com/poker-strategies/psychology)

[^32]: Positive Psychology for Poker: Theories and Tools Every Poker Player Should Know, accessed on August 5, 2025, [https://plomastermind.com/poker-psychology/](https://plomastermind.com/poker-psychology/)

[^33]: How Can a Poker Player Track Their Results Effectively?, accessed on August 5, 2025, [https://www.thehendonmob.com/how-can-a-poker-player-track-their-results-effectively/](https://www.thehendonmob.com/how-can-a-poker-player-track-their-results-effectively/)

[^34]: Building a JavaScript App Without Frameworks - Career Guidance ..., accessed on August 5, 2025, [https://www.codeneur.com/building-a-javascript-app-without-frameworks/](https://www.codeneur.com/building-a-javascript-app-without-frameworks/)

[^35]: The Great Debate: Vanilla JS vs Modern Frameworks | by Rahul Nagubandi - Medium, accessed on August 5, 2025, [https://medium.com/@rahulnagubandi/the-great-debate-vanilla-js-vs-modern-frameworks-0768ff83c547](https://medium.com/@rahulnagubandi/the-great-debate-vanilla-js-vs-modern-frameworks-0768ff83c547)
