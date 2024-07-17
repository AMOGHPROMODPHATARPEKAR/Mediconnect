import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import useFetchData from '../hooks/useFetchData';
import { BASE_URL } from '../config';
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase.js';
import { format } from 'date-fns';

const Chat = () => {
  const { id } = useParams();
  const { user, role } = useContext(authContext);

  let receiverData;
  role === 'patient'
    ? ({ data: receiverData } = useFetchData(`${BASE_URL}/doctor/${id}`))
    : ({ data: receiverData } = useFetchData(`${BASE_URL}/user/${id}`));

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const messagesRef = collection(db, "messages");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input === '') return;

    await addDoc(messagesRef, {
      text: input,
      createdAt: serverTimestamp(),
      sender: user?._id,
      role: role,
      receiver: receiverData?._id
    });

    setInput('');
  };

  useEffect(() => {
    if (user && receiverData?._id !== undefined) {
      const messagesRef = collection(db, 'messages');
     
      const queryMessages = query(
        messagesRef,
        where('sender', 'in', [user._id, receiverData._id]),
        where('receiver', 'in', [user._id, receiverData._id]),
        orderBy("createdAt")
      );

      const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
        const newMessages = snapshot.docs.map(doc => doc.data());
        setMessages(newMessages);
      });

      return () => unsubscribe(); // Cleanup subscription on unmount
    }
  }, [user, receiverData]);

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>
        <img src={receiverData?.photo} alt="Doctor" style={styles.doctorPhoto} />
        <span style={styles.doctorName}>{receiverData?.name}</span>
      </div>
      <div style={styles.messageContainer} className=' flex flex-col h-[200px]' >
        {messages.map((message, index) => (
          <div key={index} style={message.role === role ? styles.userMessage : styles.doctorMessage}>
            <div>{message.text}</div>
            <div style={styles.timestamp}>
              {message.createdAt?.seconds
                ? format(new Date(message.createdAt.seconds * 1000), 'Pp')
                : 'Sending...'}
            </div>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    width: '400px',
    margin: '50px auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
    height: '500px', // Increased height
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
  },
  doctorPhoto: {
    borderRadius: '50%',
    marginRight: '10px',
    height: '50px',
    width: '50px',
  },
  doctorName: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: '10px',
    overflowY: 'auto',
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    padding: '10px',
    borderRadius: '10px',
    margin: '5px 0',
    maxWidth: '80%',
  },
  doctorMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '10px',
    margin: '5px 0',
    maxWidth: '80%',
    boxShadow: '0 0 2px rgba(0, 0, 0, 0.1)',
  },
  timestamp: {
    fontSize: '10px',
    color: '#999',
    marginTop: '5px',
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    outline: 'none',
    marginRight: '10px',
  },
  sendButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
};

export default Chat;
