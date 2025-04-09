import React from 'react';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-container">
      <h1>About Budget Bites</h1>

      <section>
        <h2>Our Hackathon Project</h2>
        <p>Welcome to our innovative recipe recommendation app, born from the Concordia Hackathon 2025! We set out to solve a common problem: how to make delicious meals while taking advantage of the best deals in your local grocery stores.</p>
      </section>

      <section>
        <h2>How It Works</h2>
        <p>Our app combines the power of the Spoonacular API and data from flyers from SuperC, Maxi, IGA and Metro. Here's what makes us unique:</p>
        <ul>
          <li>We parse HTML from current grocery flyers to identify the best deals.</li>
          <li>Using the Spoonacular API, we match these deals with delicious recipes.</li>
          <li>The result? Budget-friendly meal ideas that are both tasty and economical!</li>
        </ul>
      </section>

      <section>
        <h2>Our Team</h2>
        <ul>
          <li>Cristina Trofimov</li>
          <li>Delany Pulgarin</li>
          <li>Jackson Amirthalingam</li>
          <li>Oviya Sinnathamby</li>
        </ul>
        <p>We're a group of passionate developers from Concordia University and Polythecnique, committed to making meal planning easier and more affordable for everyone.</p>
      </section>

    </div>
  );
}

export default AboutPage;
