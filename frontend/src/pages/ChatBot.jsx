import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// console.log(GEMINI_API_KEY)
const ChatBot = () => {
  const MODEL_NAME = 'gemini-1.0-pro';
  const API_KEY = GEMINI_API_KEY;
  const GENERATION_CONFIG = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1024,
  };
  const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // Initialize chat and send initial message when the component mounts
  useEffect(() => {
    const initChat = async () => {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const newChat = model.startChat({
        generationConfig: GENERATION_CONFIG,
        safetySettings: SAFETY_SETTINGS,
        history: [],
      });
      console.log("efetchsjd")
      setChat(newChat);

      try {
        const initialQuery = `
        Your name is MediConnectBot. You are a multilingual medical assistant capable of communicating in various languages based on the user's input.
        
        If you detect any medical symptoms in the user's message, translate those symptoms into English and return a JSON response formatted as follows:
        {
          "response": "List of identified symptoms",
          "flag": true
        }
        
        If no symptoms are detected, respond with a usual message response , and do not return JSON format. 
        
        Ensure that you follow these formats based on symptom detection.
      `;
      


        await newChat.sendMessage(initialQuery);
      } catch (error) {
        console.error('Error sending initial query:', error.message);
      }
    };

    initChat();
  }, []);

  const [doctors, setDoctors] = useState([]);


  const handleSendMessage = async () => {
    if (newMessage.trim() && chat) {
      const userMessage = { text: newMessage, type: 'sent' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage('');
  
      try {
        const result = await chat.sendMessage(newMessage);
        if (result.error) {
          console.error('AI Error:', result.error.message);
          return;
        }
  
        let responseText = result.response.text();
        let response;
        let flag=false;
        console.log(responseText)
        try {
          // Attempt to parse the response as JSON
          response = JSON.parse(responseText);
          responseText = response.response;  // Use the JSON "response" field
           
          flag = true
        } catch {
          // If parsing fails, handle it as a regular response
          console.log("Received regular response:", responseText);
          
          flag =false 
        }
        
        if (flag) {
          try {
            const diseaseResponse = await axios.post('http://127.0.0.1:5000/predict-disease', {
              symptoms: responseText,
            });
            const disease = diseaseResponse.data.disease;
            responseText += `\nPredicted Disease: ${disease}`;

            const token = localStorage.getItem('token');
            console.log("toe",token)

            const doctorsResponse = await axios.post(
              `/api/v1/doctor/specialist`,
              { disease }, // Send disease in the request body
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Include the token
                },
              }
            );
            
            const doctors = doctorsResponse.data; // Assuming the response is an array of doctors
        
            // Save doctor details to state
            setDoctors(doctors.doctors);

          } catch (error) {
            console.error('Error predicting disease:', error);
          }
        }
        
        const botMessage = { text: responseText, type: 'received' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
  
        // Trigger speech synthesis for the bot's response
        handleGenerateSpeech(responseText);
      } catch (error) {
        console.error('An error occurred:', error.message);
      }
    }
  };
  
  

  const handleGenerateSpeech = async (message) => {
    if (message.trim()) {
      try {
        // Send the text to Flask backend to generate speech
        const response = await axios.post('http://127.0.0.1:5000/generate-speech', {
          text: message,
        });
  
        // Get the audio URL from the response and add a timestamp to avoid caching
        const audioUrl = `http://127.0.0.1:5000${response.data.audioUrl}?t=${new Date().getTime()}`;
  
        // Check if the audio URL is valid
        if (audioUrl) {
          const audio = new Audio(audioUrl);
          audio.play().catch((error) => {
            console.error('Error playing audio:', error);
          });
        } else {
          console.error('Invalid audio URL:', audioUrl);
        }
      } catch (error) {
        console.error('Error generating speech:', error);
      }
    }
  };
  

  // Initialize SpeechRecognition for voice input
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const voiceInput = event.results[0][0].transcript;
      setNewMessage(voiceInput);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const handleVoiceInput = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const navigate = useNavigate();

  const handleDoctorClick = (id) => {
    navigate(`/doctors/${id}`);
  };

console.log("Doc",doctors)
  return (
    <Container maxWidth="sm" sx={{ my: 20 }}>
      {/* Chat Header */}
      <Typography variant="h4" gutterBottom>
        MediConnectBot
      </Typography>

      {/* Chat Messages */}
      <Paper sx={{ height: '400px', overflowY: 'auto', padding: '10px', backgroundColor: 'rgba(173, 216, 230, 0.3)' }}>
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{ display: 'flex', justifyContent: message.type === 'sent' ? 'flex-end' : 'flex-start' }}
            >
              <Box
                sx={{
                  bgcolor: message.type === 'sent' ? 'primary.main' : 'grey.300',
                  color: message.type === 'sent' ? 'primary.contrastText' : 'black',
                  borderRadius: 2,
                  p: 1,
                  maxWidth: '75%',
                  wordBreak: 'break-word',
                }}
              >
                <ListItemText primary={message.text} />
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Input and Actions */}
      <Box display="flex" mt={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          multiline
          rows={2}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ marginLeft: '10px' }}>
          Send
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleVoiceInput}
          sx={{ marginLeft: '10px' }}
          disabled={!SpeechRecognition || isListening}
        >
          {isListening ? 'Listening...' : 'Voice'}
        </Button>
      </Box>

      {/* Predicted Specialists */}
      {doctors.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Predicted Specialists
          </Typography>
          {doctors.map((doctor, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{ padding: 2, marginBottom: 2, bgcolor: 'rgba(255, 248, 220, 0.7)' ,cursor: 'pointer'}}
              onClick={() => handleDoctorClick(doctor._id)}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <img
                  src={doctor.photo || 'https://via.placeholder.com/150'}
                  alt={doctor.name}
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    <strong>Name:</strong> {doctor.name}
                  </Typography>
                  <Typography variant="subtitle2">
                    <strong>Specialization:</strong> {doctor.specialization}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Location:</strong> {doctor.location}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Ticket Price:</strong> ₹{doctor.ticketPrice}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Average Rating:</strong> {doctor.averageRating}⭐
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Container>

  );
};

export default ChatBot;
