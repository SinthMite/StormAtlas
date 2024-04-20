import React from "react";
import './AboutPage.css'
const AboutPage = () => {
    return (
        <div className="aboutUsContainer">
            <h1>About Us</h1>
            <p>Welcome to our website dedicated to providing comprehensive information about natural disasters, weather phenomena, and related topics.</p>
            <h2>Our Mission</h2>
            <p>Our mission is to empower individuals and communities with knowledge and resources to better understand, prepare for, and respond to natural disasters. We aim to raise awareness about the impact of extreme weather events and help mitigate their effects through education and information dissemination.</p>
            <h2>What We Offer</h2>
            <p>At our website, you'll find a wide range of resources and tools, including:</p>
            <ul>
                <li>Real-time weather data and forecasts for various regions</li>
                <li>Informational articles and guides about different types of natural disasters</li>
                <li>Interactive maps displaying current and historical disaster occurrences</li>
                <li>Charts and graphs illustrating trends and patterns in weather phenomena</li>
                <li>Emergency preparedness tips and advice for staying safe during disasters</li>
            </ul>
            <h2>Our Team</h2>
            <p>We are a dedicated team of meteorologists, scientists, and disaster management experts passionate about making a positive impact in the field of disaster preparedness and response. Our diverse backgrounds and expertise allow us to provide reliable and up-to-date information to our audience.</p>
            <h2>Contact Us</h2>
            <p>If you have any questions, feedback, or suggestions, we'd love to hear from you! Please feel free to contact us at <a href="mailto:info@naturaldisasterinfo.com">info@naturaldisasterinfo.com</a>.</p>
        </div>
    );
}

export default AboutPage;