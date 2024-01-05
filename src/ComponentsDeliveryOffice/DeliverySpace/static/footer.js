import React from 'react'
import  './footer.css'

export default function Footer() {
  return (
  
<footer id="contact">
  <ul>
    <div id="icon-container">
      <a href="#">
        <div className="iconP">
          <li><i className="fab fa-twitter"></i></li>
        </div>
      </a>
      <a href="#">
        <div className="iconP">
          <li><i className="fab fa-instagram"></i></li>
        </div>
      </a>
      <a href="#">
        <div className="iconP">
          <li><i className="fab fa-facebook-f"></i></li>
        </div>
      </a>
      <a href="#">
        <div className="iconP">
          <li><i className="far fa-envelope"></i></li>
        </div>
      </a>
      <a href="#">
        <div className="iconP">
          <li><i className="fab fa-free-code-camp"></i></li>
        </div>
      </a>
    </div>
  </ul>
  <p>&copy; 2020-2021, TechTak</p>
</footer>
  )
}