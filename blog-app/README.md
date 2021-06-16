# App Overview
A simple blog application developed with microservices approach. You can add posts and comments to posts. Application will moderate the comments i.e. if you add `kill` word in comment then your comment will be rejected. Application will show comment status `awaiting moderation` if moderation service is down and when the moderation service is up it will process the pending comments.

### App User Interface

![UI](https://github.com/bhanu-code-repo/microservices-with-nodejs-and-react/blob/main/blog-app/document/blog-app-user-interface.jpg)

### App Block Diagram

![UI](https://github.com/bhanu-code-repo/microservices-with-nodejs-and-react/blob/main/blog-app/document/blog-app-architecture.jpg)

### Tech Stack
* Front-end : React
* Back-end: Node & Express
* Data store: In-Memory

### Configure components
Open each component in command line terminal and run `npm install` command

### Run components
Open each component in command line terminal and run `npm start` command

### Note
This project uses babel however if you don't want to use it then change the way i have imported packages i.e. use `const express = require('express')` instead of `import express from 'express'.`
