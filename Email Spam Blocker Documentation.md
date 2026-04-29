# Email Spam Blocker Web Application Documentation

### 1\. Overview

The Email Spam Blocker Web App is a front-end prototype built using HTML, CSS, and JavaScript.

It simulates spam detection by scanning email subject lines for common spam keywords such as:

'free', 'offer', 'win', 'prize', 'limited', and 'urgent'. The app provides a simple inbox interface,

classifies emails as Spam or Safe, and displays a dynamic dashboard chart showing the percentage of spam versus safe emails.

### 2\. Project Goals

&#x20;   • - Provide user-friendly interface for email classification

&#x20;   • - Demonstrate basic spam detection logic

&#x20;   • - Visualize classification results with dashboard chart

&#x20;   • - Allow users to add new email subjects

&#x20;   • - Serve as foundation for backend ML integration

### 3\. Format Guide for Toolkit Document

Title \& Objectives

Title: Email Spam Blocker Web Application

Objectives: Build interface, classify emails, provide dashboard overview

#### Quick Summary of Technology

* HTML for structure
* CSS for styling
* JavaScript for logic.

#### System Requirements

&#x20;   • - Modern web browser (e.g., Chrome, Firefox, Edge, Safari)

&#x20;   • - Basic text editor (e.g., VS Code, Sublime Text, Notepad++)

&#x20;   • - Optional: Python backend with Scikit-learn for ML integration

### Installation \& Setup Instructions

&#x20;   • - Create a project folder (e.g., 'spam-blocker')

&#x20;   • - Save the provided HTML file as 'index.html'

&#x20;   • - Open 'index.html' in a web browser

&#x20;   • - Optional: Set up a backend with Python and Scikit-learn for real ML classification

#### Working Examples

&#x20;   • - Win a free iPhone! → Classified as Spam

&#x20;   • - Meeting tomorrow at 10 AM → Classified as Safe

&#x20;   • - Urgent prize claim now! → Classified as Spam

&#x20;   • - Weekly project update → Classified as Safe

#### Prompt Used

Spam keyword list in JavaScript:

const spam Keywords = \["free", "offer", "win", "prize", "limited", "urgent"];

##### Common Issues

&#x20;   • - False positives: Legitimate emails flagged as spam due to keyword presence

&#x20;   • - False negatives: Spam emails not flagged due to missing keywords

&#x20;   • - Chart scaling: Percentages remain at 0% if no emails are added

##### References

&#x20;   • - MDN Web Docs: https://developer.mozilla.org/

&#x20;   • - W3Schools JavaScript: https://www.w3schools.com/js/

&#x20;   • - Spam filtering concepts from keyword-based text classification

### 4\. Flow Diagram

Textual representation of process:



&#x20;         ┌───────────────┐

&#x20;         │   User Input   │

&#x20;         │ (Email Subject)│

&#x20;         └───────┬───────┘

&#x20;                 │

&#x20;                 ▼

&#x20;       ┌─────────────────────┐

&#x20;       │ Classification Logic│

&#x20;       │ (Keyword Matching)  │

&#x20;       └───────┬────────────┘

&#x20;               │

&#x20;    ┌──────────┴───────────┐

&#x20;    │                      │

&#x20;    ▼                      ▼

&#x20;┌─────────┐           ┌─────────┐

&#x20;│  Spam   │           │  Safe   │

&#x20;└────┬────┘           └────┬────┘

&#x20;     │                     │

&#x20;     ▼                     ▼

&#x20;┌───────────────┐   ┌───────────────┐

&#x20;│ Inbox Update  │   │ Dashboard Chart│

&#x20;│ (Add Email)   │   │ (Percentages) │

&#x20;└───────────────┘   └───────────────┘



### 5\. Evaluation Criteria

&#x20;   • - Functionality: Correct classification of emails based on keywords

&#x20;   • - Usability: Intuitive and easy-to-use interface

&#x20;   • - Design: Clean, responsive, and visually appealing layout

&#x20;   • - Interactivity: Dynamic updates to chart and inbox

&#x20;   • - Extensibility: Potential for backend ML model integration

