import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
if (window.location.protocol !== 'chrome-extension:' && document.contentType.startsWith("text/")) {
  const FakeNewsDetectorMainMenuButton = document.createElement("div")
  FakeNewsDetectorMainMenuButton.id = "FakeNewsDetectorMainMenuButton"
  document.body.appendChild(FakeNewsDetectorMainMenuButton)
  const root = ReactDOM.createRoot(FakeNewsDetectorMainMenuButton);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}
