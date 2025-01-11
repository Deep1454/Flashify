# Flashify-frontend

[![React Native](https://img.shields.io/badge/React%20Native-0.72+-blue)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-49.0.0-brightgreen)](https://expo.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🚀 Features

- Feature 1: Create Flashcards in folders manually.
- Feature 2: Create Flashcards using ai based on topic or text.
- Feature 3: Interact with the flashcards using ai.

---

## 📂 Project Structure

```plaintext
📦 Flashify-frontend
├── app               # Entry point of the application
├── / assets          # Images, fonts, and other static assets
├── / components      # Reusable UI components
├── / screens         # Application screens
├── / navigation      # Navigation setup
├── / services        # Centralized styling (optional)
├── .env              # Entry point of the application
├── .gitignore        # Entry point of the application
├── index.js          # Entry point of the application
├── App.js            # Entry point of the application
├── app.json          # Expo project configuration
├── package.json      # Project dependencies and scripts
└── README.md         # Project documentation

```

## 🛠️ Installation

### Prerequisites

Ensure you have the following installed on your system:

- Node.js 16 or higher
- npm or yarn
- Expo CLI (npm install -g expo-cli)

### Setup Instructions

#### Clone the repository:

```bash
git clone https://github.com/ZaveriAum/Flashify-frontend.git
cd Flashify-frontend
```

#### Install the required dependencies:

```bash
npm install
# or
yarn install
```

#### Create a .env & babel.config.js file : from the given example.babel.config.js and example.env

```bash
expo start
# or
npm start
```

#### To connec to backend visit -> https://github.com/ZaveriAum/Flashify-backend.git and follow instructions from the README file. and Run the application with

```bash
flask run --host=0.0.0.0 --port=5000
```

#### and change the IPv4 in services base url in frontend .env -> API_URL=your.IPv4.address
