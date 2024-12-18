'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { MapPin, DollarSign } from 'lucide-react'
import ReactMarkdown from "react-markdown"

const handleDownload = (content: string) => {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "itinerary.txt"; // File name to download
  a.click();
  URL.revokeObjectURL(url); // Clean up the URL
};

// API token from environment variable
const API_TOKEN = process.env.NEXT_PUBLIC_GEMINI_API_TOKEN as string;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_TOKEN}`;


export default function WanderPlan() {
  const [from, setFrom] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')
  const [interests, setInterests] = useState('')
  const [comments, setComments] = useState('')
  const [itinerary, setItinerary] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * Function to call the Gemini API to generate a travel itinerary.
   * @param {string} from - Starting location of the trip.
   * @param {string} destination - Travel destination.
   * @param {string} startDate - Start date of the trip.
   * @param {string} endDate - End date of the trip.
   * @param {string} budget - Budget for the trip.
   * @param {string} interests - Interests, comma-separated.
   * @param {string} comments - Additional comments or preferences.
   * @returns {Promise<string>} - The generated itinerary or an error message.
   */
  const generateItinerary = async (from:any, destination:any, startDate:any, endDate:any, budget:any, interests:any, comments:any) => {
    const raw = JSON.stringify({
      "contents": [
        {
          "parts": [
            {
              "text": `Create a travel itinerary for a trip. The traveler will depart from ${from} and go to ${destination}. The trip will begin ${startDate} and end on ${endDate}. The traveler has a budget of ${budget} and is interested in ${interests}. Additional comments from the traveler include: ${comments}. Write in beautiful markdown format and make it pretty. Add bullet points make sure to add next line spaces as well. Dont make it look congested. Add blank lines in between divider. Mention how much money each day can be spend on what all things in the budget. `
            }
          ]
        }
      ]
    });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
            // Use the environment variable here
        },
        body: raw
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const itinerary = data.candidates[0].content.parts[0].text
      if (!itinerary) {
        throw new Error("Itinerary data is missing from the response.");
      }

      return itinerary;
    } catch (error:any) {
      console.error("Error generating itinerary:", error);
      return `There was an error generating the itinerary: ${error.message}. Please try again later.`;
    }
  };

  const handleGenerate = async () => {
    setLoading(true)
    const generatedItinerary = await generateItinerary(from, destination, startDate, endDate, budget, interests, comments)
    setItinerary(generatedItinerary)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl w-full mx-auto flex-grow"
      >
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <MapPin className="h-12 w-12 text-teal-600" />
            <h1 className="text-5xl font-extrabold text-gray-800 ml-4">WanderPlan</h1>
          </div>
          <p className="text-xl text-gray-600 font-medium">Your AI-powered travel companion</p>
        </div>
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="md:flex">
            {/* Input Section */}
            <div className="md:w-1/2 p-8 bg-gradient-to-br from-gray-50 to-blue-50">
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">Plan Your Adventure</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="from" className="text-gray-700">From</Label>
                  <Input
                    id="from"
                    placeholder="Enter your starting point"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="destination" className="text-gray-700">Destination</Label>
                  <Input
                    id="destination"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="startDate" className="text-gray-700">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="endDate" className="text-gray-700">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="budget" className="text-gray-700">Budget</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="budget"
                      type="number"
                      placeholder="Enter your budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="interests" className="text-gray-700">Interests (comma-separated)</Label>
                  <Input
                    id="interests"
                    placeholder="e.g., history, food, nature"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="comments" className="text-gray-700">Additional Comments</Label>
                  <Textarea
                    id="comments"
                    placeholder="Any special requests or preferences?"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleGenerate} 
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Itinerary"}
                </Button>
              </div>
            </div>
            
            {/* Itinerary Section */}
            <div className="md:w-1/2 p-8 border-t md:border-t-0 md:border-l">
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">Your Itinerary</h2>
              {itinerary ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
            
                  <div className="w-full h-[calc(100vh-300px)] bg-gray-50 rounded-lg p-6 text-gray-800 overflow-y-auto">
                  <ReactMarkdown
  components={{
    ul: ({ children }) => (
      <ul style={{ 
        paddingLeft: "1.5rem", 
        marginBottom: "1rem", 
        listStyleType: "disc", 
        color: "#2D3748" // Dark Gray for list text
      }}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol style={{ 
        paddingLeft: "1.5rem", 
        marginBottom: "1rem", 
        listStyleType: "decimal", 
        color: "#2D3748" // Dark Gray for numbered list
      }}>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li style={{ 
        marginBottom: "0.5rem", 
        lineHeight: "1.6", 
        color: "#4A5568" // Slightly lighter gray
      }}>
        {children}
      </li>
    ),
    p: ({ children }) => (
      <p style={{ 
        marginBottom: "1rem", 
        lineHeight: "1.6", 
        textAlign: "justify", 
        color: "#4A5568" // Slightly lighter gray for paragraphs
      }}>
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong style={{ 
        fontWeight: "700", 
        color: "#319795" // Orange for strong emphasis
      }}>
        {children}
      </strong>
    ),

    h1: ({ children }) => (
      <h1 style={{
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#319795", // Teal Blue
        margin: "1.5rem 0 1rem",
        lineHeight: "1.3",
        textAlign: "left",
        textShadow: "0 1px 1px rgba(0,0,0,0.1)", // Subtle depth effect
      }}>
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <h2 style={{
        fontSize: "1.75rem",
        fontWeight: "bold",
        color: "#2B6CB0", // Blue for subheadings
        margin: "1rem 0 0.75rem",
        lineHeight: "1.4",
        borderBottom: "2px solid #E2E8F0", // Subtle bottom border
        paddingBottom: "0.5rem",
      }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#3182CE", // Bright blue for subheadings
        margin: "1rem 0 0.75rem"
      }}>
        {children}
      </h3>
    ),
    hr: () => (
      <hr style={{ 
        margin: "1.5rem 0", 
        borderTop: "2px solid #CBD5E0" // Light gray for dividers
      }} />
    ),
    blockquote: ({ children }) => (
      <blockquote style={{
        borderLeft: "4px solid #63B3ED", // Light blue border
        paddingLeft: "1rem",
        margin: "1rem 0",
        color: "#718096", // Muted gray for blockquote text
        fontStyle: "italic"
      }}>
        {children}
      </blockquote>
    )
  }}
>
  {itinerary}
</ReactMarkdown>

<div style={{ marginTop: "1.5rem", textAlign: "center" }}>
  <Button 
    onClick={() => handleDownload(itinerary)} 
    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
  >
    Download Itinerary
  </Button>
</div>



</div>
                </motion.div>
              ) : (
                <p className="text-gray-600 italic">Your generated itinerary will appear here.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <footer className="mt-12 text-center text-gray-600">
        <p>&copy; 2024 WanderPlan. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-teal-600 transition-colors duration-300">About</a>
          <a href="#" className="hover:text-teal-600 transition-colors duration-300">Privacy</a>
          <a href="#" className="hover:text-teal-600 transition-colors duration-300">Terms</a>
          <a href="#" className="hover:text-teal-600 transition-colors duration-300">Contact</a>
        </div>
      </footer>
    </div>
  )
}