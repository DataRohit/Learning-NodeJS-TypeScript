# Learning Node.js & TypeScript 🚀

Welcome to the **Learning Node.js & TypeScript** repository! This project is a step-by-step educational journey designed to take you from the very basics of Node.js to building complex, real-time web applications using TypeScript.

## 📚 Table of Contents

1.  **[Node.js Basics](./01.nodeBasics)** - Introduction to Node.js, global objects, and environment setup.
2.  **[Module System](./02.moduleSystem)** - CommonJS vs. ES Modules and how to structure code.
3.  **[NPM & Lodash](./03.npmLodash)** - Managing dependencies and using the NPM ecosystem.
4.  **[Path Module](./04.pathModule)** - Handling file paths across different operating systems.
5.  **[File System (FS)](./05.fileSystem)** - Performing CRUD operations on the local file system.
6.  **[HTTP Module](./06.httpModule)** - Building a low-level web server from scratch.
7.  **[Callbacks](./07.callbacks)** - Understanding the foundation of asynchronous programming.
8.  **[Promises](./08.promises)** - Mastering modern asynchronous patterns.
9.  **[Async/Await](./09.asyncAwait)** - Simplified asynchronous logic with `try/catch` error handling.
10. **[Events](./10.events)** - Building event-driven architectures with `EventEmitter`.
11. **[Express.js](./11.express)** - Rapid web development with the Express framework.
12. **[EJS Templating](./12.ejs)** - Generating dynamic HTML on the server side.
13. **[MongoDB & Mongoose](./13.mongodb)** - NoSQL database integration and data modeling.
14. **[Anonymous Chat App](./14.anonymous-chat)** - **Capstone Project**: A real-time, anonymous chat application using Socket.io and MongoDB.
15. **[Node.js Concepts](./15.nodeConcepts)** - Deep dive into core Node.js concepts like Buffers, the Event Loop, and Streams.

---

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Real-time**: Socket.io
- **View Engine**: EJS
- **Utilities**: Chalk (CLI styling), Nanoid (Unique IDs), Dotenv (Environment Variables)

---

## 🚀 Getting Started

To get started with any of the modules, follow these steps:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed (LTS recommended)
- [MongoDB](https://www.mongodb.com/) installed or an Atlas URI.
- [pnpm](https://pnpm.io/) or `npm` installed.

### 2. Installation
Clone the repository and install dependencies for the desired module:

```bash
git clone https://github.com/your-username/Learning-NodeJS-TypeScript.git
cd Learning-NodeJS-TypeScript
cd <folder-name> # Example: cd 14.anonymous-chat
pnpm install
```

### 3. Environment Setup
For modules requiring a database (like 13 and 14), create a `.env` file in the folder:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

### 4. Running the Code
Start the development server:

```bash
pnpm run dev
```

---

## 🌟 Key Project: Anonymous Chat
The final project in this repository (`14.anonymous-chat`) features:
- **Temporary Sessions**: Chat rooms that expire after a set duration.
- **Anonymous Identity**: Users are assigned unique anonymous IDs via cookies.
- **Real-time Communication**: Instant messaging powered by Socket.io.
- **Data Persistence**: Messages and sessions stored in MongoDB.

---

## 📜 License
This project is licensed under the [MIT License](./license).
