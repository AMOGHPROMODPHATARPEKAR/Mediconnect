import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Paper, List, ListItem, ListItemText, Select,
  MenuItem,
  FormControl,
  InputLabel } from '@mui/material';
import OpenAI from 'openai';
import axios from 'axios';

const LANGUAGES = {
  'en': { name: 'English', code: 'en-US' },
  'hi': { name: 'हिंदी', code: 'hi-IN' },
  'kn': { name: 'ಕನ್ನಡ', code: 'kn-IN' },
  'fr': { name: 'Français', code: 'fr-FR' },
  'te': { name: 'తెలుగు', code: 'te-IN' },
  'ta': { name: 'தமிழ்', code: 'ta-IN' }
};

const getSystemMessage = (lang) => ({
  role: "system",
  content: `You are MediConnectBot, a multilingual medical assistant. 
  Always respond in ${LANGUAGES[lang].name}.
  When a user describes symptoms:
  1. Identify symptoms and translate them to English internally
  2. Respond STRICTLY in this JSON format:
  {
    "response": "Response in ${LANGUAGES[lang].name}",
    "flag": true,
    "symptoms": "Comma-separated list of symptoms in English for internal processing"
  }
  
  If the user mentions fewer than 2 symptoms, respond with a request for more symptoms for better accuracy. Include any already identified symptoms in your response.
  
  If no symptoms are detected, respond normally in ${LANGUAGES[lang].name} with JSON flag=false.
  Always prioritize accurate symptom identification while maintaining natural conversation in the selected language.`
});

const INTERFACE_TEXT = {
  'en': {
    title: 'MediConnectBot',
    messageLabel: 'Type your message...',
    sendButton: 'Send',
    voiceButton: 'Voice',
    listeningText: 'Listening...',
    languageSelect: 'Select Language',
    predictedSpecialists: 'Predicted Specialists',
    doctorDetails: {
      name: 'Name',
      specialization: 'Specialization',
      location: 'Location',
      ticketPrice: 'Ticket Price',
      rating: 'Average Rating'
    }
  },
  'hi': {
    title: 'मेडीकनेक्ट बॉट',
    messageLabel: 'अपना संदेश लिखें...',
    sendButton: 'भेजें',
    voiceButton: 'आवाज़',
    listeningText: 'सुन रहा हूं...',
    languageSelect: 'भाषा चुनें',
    predictedSpecialists: 'अनुमानित विशेषज्ञ',
    doctorDetails: {
      name: 'नाम',
      specialization: 'विशेषज्ञता',
      location: 'स्थान',
      ticketPrice: 'टिकट मूल्य',
      rating: 'औसत रेटिंग'
    }
  },
  'kn': {
    title: 'ಮೆಡಿಕನೆಕ್ಟ್ ಬಾಟ್',
    messageLabel: 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...',
    sendButton: 'ಕಳುಹಿಸಿ',
    voiceButton: 'ಧ್ವನಿ',
    listeningText: 'ಆಲಿಸುತ್ತಿದೆ...',
    languageSelect: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    predictedSpecialists: 'ಊಹಿಸಿದ ತಜ್ಞರು',
    doctorDetails: {
      name: 'ಹೆಸರು',
      specialization: 'ವಿಶೇಷತೆ',
      location: 'ಸ್ಥಳ',
      ticketPrice: 'ಟಿಕೆಟ್ ದರ',
      rating: 'ಸರಾಸರಿ ರೇಟಿಂಗ್'
    }
  },
  'te': {
    title: 'మెడికనెక్ట్ బాట్',
    messageLabel: 'మీ సందేశాన్ని టైప్ చేయండి...',
    sendButton: 'పంపించండి',
    voiceButton: 'ధ్వని',
    listeningText: 'వినేస్తున్నాను...',
    languageSelect: 'భాషను ఎంచుకోండి',
    predictedSpecialists: 'అంచనా నిపుణులు',
    doctorDetails: {
      name: 'పేరు',
      specialization: 'ప్రత్యేకత',
      location: 'ప్రాంతం',
      ticketPrice: 'టికెట్ ధర',
      rating: 'సగటు రేటింగ్'
    }
  },
  'ta': {
    title: 'மெடிகனெக்ட் போட்',
    messageLabel: 'உங்கள் செய்தியை டைப் செய்யவும்...',
    sendButton: 'அனுப்பு',
    voiceButton: 'குரல்',
    listeningText: 'கேட்கின்றேன்...',
    languageSelect: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    predictedSpecialists: 'முன்னறியப்பட்ட நிபுணர்கள்',
    doctorDetails: {
      name: 'பெயர்',
      specialization: 'துறை',
      location: 'இடம்',
      ticketPrice: 'டிக்கெட் விலை',
      rating: 'சராசரி மதிப்பீடு'
    }
  },
  'fr': {
    title: 'MediConnectBot',
    messageLabel: 'Tapez votre message...',
    sendButton: 'Envoyer',
    voiceButton: 'Voix',
    listeningText: 'Écoute...',
    languageSelect: 'Choisir la langue',
    predictedSpecialists: 'Spécialistes Prévus',
    doctorDetails: {
      name: 'Nom',
      specialization: 'Spécialité',
      location: 'Lieu',
      ticketPrice: 'Prix du billet',
      rating: 'Note moyenne'
    }
  }
};

const ChatBot = () => {
  const navigate = useNavigate();
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  
  const [state, setState] = useState({
    messages: [],
    newMessage: '',
    openai: null,
    isListening: false,
    conversationHistory: [],
    doctors: [],
    selectedLanguage: '',
    hasSelectedLanguage: false,
    savedSymptoms: [], // Add state for saved symptoms
    symptomCount: 0    // Track the number of symptoms
  });

  // Initialize speech recognition
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && state.selectedLanguage) {
      const newRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      newRecognition.continuous = false;
      newRecognition.interimResults = false;
      newRecognition.lang = LANGUAGES[state.selectedLanguage].code;
      setRecognition(newRecognition);
    }
  }, [state.selectedLanguage]);

  // Initialize OpenAI client
  useEffect(() => {
    const client = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
    setState(prev => ({ ...prev, openai: client }));
  }, []);

  const handleLanguageSelect = (event) => {
    const lang = event.target.value;
    setState(prev => ({ 
      ...prev, 
      selectedLanguage: lang,
      hasSelectedLanguage: true,
      conversationHistory: [getSystemMessage(lang)],
      savedSymptoms: [],
      symptomCount: 0
    }));
  };

  const sendMessageToOpenAI = useCallback(async (client, message) => {
    try {
      const conversationWithNewMessage = [
        ...state.conversationHistory,
        { role: "user", content: message }
      ];

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: conversationWithNewMessage,
        response_format: { type: "json_object" }
      });

      const responseContent = response.choices[0].message.content;
      
      setState(prev => ({
        ...prev,
        conversationHistory: [
          ...prev.conversationHistory,
          { role: "user", content: message },
          { role: "assistant", content: responseContent }
        ]
      }));

      return responseContent;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }, [state.conversationHistory]);

  const handleGenerateSpeech = useCallback(async (message) => {
    if (!message.trim()) return;

    try {
      const response = await axios.post('http://127.0.0.1:5000/generate-speech', {
        text: message,
        language: state.selectedLanguage
      });
      
      const audioUrl = `http://127.0.0.1:5000${response.data.audioUrl}?t=${Date.now()}`;
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Error generating speech:', error);
    }
  }, [state.selectedLanguage]);

  const fetchDoctorRecommendations = useCallback(async (disease) => {
    try {
      const token = localStorage.getItem('token');
      console.log("token ", token);
      const response = await axios.post(
        `http://localhost:8000/api/v1/doctor/specialist`,
        { disease, lang: state.selectedLanguage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setState(prev => ({ ...prev, doctors: response.data.doctors }));
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  }, [state.selectedLanguage]);

  // Update saved symptoms and check if we have enough for diagnosis
  const processSymptoms = useCallback((newSymptoms) => {
    if (!newSymptoms) return { combinedSymptoms: '', hasEnoughSymptoms: false };
    
    const symptomArray = newSymptoms.split(',').map(s => s.trim()).filter(s => s);
    
    // Update saved symptoms with new unique ones
    const updatedSymptoms = [...state.savedSymptoms];
    
    symptomArray.forEach(symptom => {
      if (!updatedSymptoms.includes(symptom)) {
        updatedSymptoms.push(symptom);
      }
    });
    
    // Update state with new symptoms
    setState(prev => ({
      ...prev,
      savedSymptoms: updatedSymptoms,
      symptomCount: updatedSymptoms.length
    }));
    
    const combinedSymptoms = updatedSymptoms.join(', ');
    const hasEnoughSymptoms = updatedSymptoms.length > 2;
    
    return { combinedSymptoms, hasEnoughSymptoms };
  }, [state.savedSymptoms]);

  const handleSendMessage = async () => {
    if (!state.newMessage.trim() || !state.openai) return;

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, { text: state.newMessage, type: 'sent' }],
      newMessage: ''
    }));

    try {
      const responseText = await sendMessageToOpenAI(state.openai, state.newMessage);
      let parsedResponse;
      
      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = { response: responseText, flag: false };
      }

      console.log(parsedResponse)

      if (parsedResponse.symptoms) {
        const { combinedSymptoms, hasEnoughSymptoms } = processSymptoms(parsedResponse.symptoms);
        console.log(hasEnoughSymptoms)
        if (hasEnoughSymptoms) {
          // We have enough symptoms, proceed with disease prediction
          const diseaseResponse = await axios.post('http://127.0.0.1:5000/predict-disease', {
            symptoms: combinedSymptoms,
          });
          
          const disease = diseaseResponse.data.disease;
          parsedResponse.response += `\nPredicted Disease: ${disease}`;
          
          await fetchDoctorRecommendations(disease);
        } else {
          // Not enough symptoms, response should already ask for more
          // The system message has been updated to handle this case
        }
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, { text: parsedResponse.response, type: 'received' }]
      }));

      await handleGenerateSpeech(parsedResponse.response);
    } catch (error) {
      console.error('Error processing message:', error);
      // Add error handling UI feedback here
    }
  };

  const handleVoiceInput = () => {
    if (!recognition || state.isListening) return;

    setState(prev => ({ ...prev, isListening: true }));
    recognition.start();
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      const voiceInput = event.results[0][0].transcript;
      setState(prev => ({ 
        ...prev, 
        newMessage: prev.newMessage ? `${prev.newMessage} ${voiceInput}` : voiceInput,
        isListening: false 
      }));
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };
  }, [recognition]);

  const handleDoctorClick = (id) => {
    navigate(`/doctors/${id}`);
  };

  if (!state.hasSelectedLanguage) {
    return (
      <Container maxWidth="sm" sx={{ my: 20 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Welcome to MediConnectBot
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Your Language</InputLabel>
            <Select
              value={state.selectedLanguage}
              onChange={handleLanguageSelect}
              label="Select Your Language"
            >
              {Object.entries(LANGUAGES).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Container>
    );
  }

  const texts = INTERFACE_TEXT[state.selectedLanguage];

  return (
    <Container maxWidth="sm" sx={{ my: 20 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          {texts.title}
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            value={state.selectedLanguage}
            onChange={handleLanguageSelect}
            size="small"
          >
            {Object.entries(LANGUAGES).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ 
        height: '400px', 
        overflowY: 'auto', 
        padding: '10px', 
        backgroundColor: 'rgba(173, 216, 230, 0.3)' 
      }}>
        <List>
          {state.messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{ 
                display: 'flex', 
                justifyContent: message.type === 'sent' ? 'flex-end' : 'flex-start' 
              }}
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
          label={texts.messageLabel}
          value={state.newMessage}
          onChange={(e) => setState(prev => ({ ...prev, newMessage: e.target.value }))}
          multiline
          rows={2}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSendMessage} 
          sx={{ marginLeft: '10px' }}
        >
          {texts.sendButton}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleVoiceInput}
          sx={{ marginLeft: '10px' }}
          disabled={!recognition || state.isListening}
        >
          {state.isListening ? texts.listeningText : texts.voiceButton}
        </Button>
      </Box>

      {state.savedSymptoms.length > 0 && (
        <Box mt={2} p={2} sx={{ bgcolor: 'rgba(220, 255, 220, 0.3)', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Symptoms identified: {state.savedSymptoms.join(', ')}
          </Typography>
        </Box>
      )}

      {state.doctors.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            {texts.predictedSpecialists}
          </Typography>
          {state.doctors.map((doctor, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{ 
                padding: 2, 
                marginBottom: 2, 
                bgcolor: 'rgba(255, 248, 220, 0.7)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
              onClick={() => handleDoctorClick(doctor._id)}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <img
                  src={doctor.photo || 'https://via.placeholder.com/150'}
                  alt={doctor.name}
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    <strong>{texts.doctorDetails.name}:</strong> {doctor.name}
                  </Typography>
                  <Typography variant="subtitle2">
                    <strong>{texts.doctorDetails.specialization}:</strong> {doctor.specialization}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{texts.doctorDetails.location}:</strong> {doctor.location}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{texts.doctorDetails.ticketPrice}:</strong> ₹{doctor.ticketPrice}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{texts.doctorDetails.rating}:</strong> {doctor.averageRating}⭐
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