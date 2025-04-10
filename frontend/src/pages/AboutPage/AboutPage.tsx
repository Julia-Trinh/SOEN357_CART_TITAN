import React from 'react';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-container">
      <h1>About Dashing Divas</h1>
      <p>Your Smarter way to Shop & Cook</p>

      <section>
        <p>Tired of wasting food and overspending on groceries? Our Smart Grocery Recipe App helps you:</p>
        <ul>
          <li>Save money by planning meals around weekly store sales</li>
          <li>Reduce waste by transforming leftovers into delicious meals</li>
          <li>Eat smarter with personalized recipes for your diet & budget</li>
        </ul>
      </section>

      <section>
        <h2>How It Works</h2>
        <ol>
          <li>Sales-Driven Recipes: Get meal ideas based on discounted items at your local stores.</li>
          <li>Leftover Helper: Tell us what's in your fridge, and we'll suggest recipes to use it up.</li>
          <li>Smart Shopping Lists: Auto-generate optimized grocery lists to buy only what you need.</li>
          <li>Diet-Friendly: Gluten-free? Vegan? We tailor recommendations to your needs.</li>
        </ol>
      </section>

      <section>
  <h2>Our Team</h2>
  <ul className="team-list">
    <li className="team-member">
      <span className="name">Bourdour Bannouri</span>
      <span className="title">The Leftover Whisperer (Master of turning yesterday's dinner into today's feast.)</span>
    </li>
    <li className="team-member">
      <span className="name">Cristina Trofimov</span>
      <span className="title">The Deal Detective (Always on the hunt for the best bargains and hidden treasures!)</span>
    </li>
    <li className="team-member">
      <span className="name">Julia Trinh</span>
      <span className="title">The Pantry Guru (Knows what's lurking in your pantry better than you do!)</span>
    </li>
    <li className="team-member">
      <span className="name">Nao Lalancette</span>
      <span className="title">Fridge-forager Extraordinaire (Turns whatever's in the fridge into gourmet magic.)</span>
    </li>
  </ul>
        <p>We're a group of passionate foodies, committed to making meal planning easier and more affordable for everyone.</p>
      </section>

    </div>
  );
}

export default AboutPage;
