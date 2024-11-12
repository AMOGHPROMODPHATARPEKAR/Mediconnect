import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ChatBot = () => {
  const MODEL_NAME = 'gemini-1.0-pro';
  const API_KEY = GEMINI_API_KEY;
  const GENERATION_CONFIG = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
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

      setChat(newChat);

      try {
        const initialQuery = `
          Your name is MediConnectBot. You are a multilingual medical assistant that can communicate in various languages based on the user's input language.
          When answering questions, ensure your response matches the input language.
        `;
        await newChat.sendMessage(initialQuery);
      } catch (error) {
        console.error('Error sending initial query:', error.message);
      }
    };

    initChat();
  }, []);

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
        const response = result.response.text();
        const botMessage = { text: response, type: 'received' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);

        // Trigger speech synthesis for the bot's response
        handleGenerateSpeech(response);
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
  
        // Get the audio URL from the response
        const audioUrl = 'http://127.0.0.1:5000' + response.data.audioUrl;
        // const audioUrl = response.data.audioUrl;
       
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

  return (
    <Container maxWidth="sm" sx={{ my: 20 }}>
      <Typography variant="h4" gutterBottom>
        MediConnectBot
      </Typography>
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
    </Container>
  );
};

export default ChatBot;
