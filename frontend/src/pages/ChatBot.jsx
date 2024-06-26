import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { useEffect } from 'react';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// console.log(GEMINI_API_KEY)


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

      // Send initial query to the bot without displaying its reply
      try {
        const initialQuery = "your name is MediConnectBot you only anwser medical,hospital,diseases and related queries. Whether you need information on symptoms, treatments, or healthcare facilities, just asks. Make sure When asked to suggest doctor give the Different type of Doctors like surgeon, physician,general based on the disease given do not give the doctor name";
        await newChat.sendMessage(initialQuery);
      } catch (error) {
        console.error('Error sending initial query:', error.message);
      }
    };

    initChat();
  }, []); // Empty dependency array ensures this effect runs only once

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
      } catch (error) {
        console.error('An error occurred:', error.message);
      }
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
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ marginLeft: '10px' }}>
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default ChatBot;