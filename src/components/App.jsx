import { useState, useEffect } from 'react'
import './App.css'
import ActionEntry from './Entry.jsx'

function ApiCall(e) {
  e.preventDefault();
  
  //debugging
  console.log("ApiCall called")
}

function App() {
  return (
    <>
      <h1 className = "title">Karma Kalculator</h1>
      <p className = "motto">We strive for excellence</p>
      <ActionEntry action = {ApiCall}/>
    </>
  )
}

export default App
