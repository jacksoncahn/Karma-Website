# Karmalyze

## Overview

**Karmalyze** is an interactive platform that evaluates user-provided actions and generates a "karma score" based on their ethical impact. By using OpenAI and Firebase, Karmalyze provides users with insightful feedback on the morality of their actions, helping them reflect on their decisions.

## Features

- **User Authentication**: Uses Firebase for secure Google sign-in to manage user sessions and data.
- **Action Evaluation**: Calls OpenAI's API to assess user actions and generate a karma score ranging from -1000 to +1000, accompanied by an explanatory comment.
- **Dynamic Data Updates**: Real-time updates to the karma score and action history using Firebase Firestore.
- **Responsive Design**: Adapts to different screen sizes for seamless user experiences across devices.
- **Media Integration**: Engages users with loading animations, sound effects, and a visually appealing interface.

## Files

### `App.js`
- The main component that handles:
  - User authentication state.
  - Fetching and displaying user data (e.g., karma history and totals).
  - Handling user inputs and interfacing with OpenAI API.
  - Managing loading states and audio feedback.

### `auth.js`
- Includes `SignIn` and `SignOut` components for managing user authentication with Firebase.

### `openAI.js`
- Contains the `callChatGPT` function:
  - Interfaces with OpenAI's API to evaluate user actions and return a comment and karma score.
  - Saves the response to Firebase Firestore if valid.

### `fetchUserData.js`
- Implements the `fetchData` function to retrieve user data from Firebase Firestore.

### `Entry.jsx`
- The input component where users can submit actions for evaluation.

### `App.css`
- Defines the styling and responsive behavior of the application, including:
  - A clean layout with intuitive navigation.
  - Animation for the rotating loading image.
  - Styling adjustments for different screen sizes using media queries.

### Media Files
- `loading.png`: The rotating image displayed while the evaluation is in progress.
- `loading-sound.mp3`: The sound played when a user submits an action.

### GitHub Link
- https://github.com/jacksoncahn/Karma-Website

### Firebase Hosting Link
- https://karmalyze-app.web.app/
