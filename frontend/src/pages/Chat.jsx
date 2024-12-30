import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import useFetchData from '../hooks/useFetchData';
import { BASE_URL } from '../config';
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase.js';
import { format } from 'date-fns';
import { Upload } from 'lucide-react';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';

const Chat = () => {
  const { id } = useParams();
  const { user, role } = useContext(authContext);

  let receiverData;
  role === 'patient'
    ? ({ data: receiverData } = useFetchData(`${BASE_URL}/doctor/${id}`))
    : ({ data: receiverData } = useFetchData(`${BASE_URL}/user/${id}`));

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const messagesRef = collection(db, "messages");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const uploadedData = await uploadToCloudinary(selectedFile);
      
      // Send message with file URL
      await addDoc(messagesRef, {
        text: input,
        fileUrl: uploadedData.url,
        fileType: selectedFile.type,
        createdAt: serverTimestamp(),
        sender: user?._id,
        role: role,
        receiver: receiverData?._id
      });

      // Clear file preview and input
      setSelectedFile(null);
      setPreviewUrl('');
      setInput('');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input === '' && !selectedFile) return;

    if (selectedFile) {
      await handleUpload();
    } else {
      await addDoc(messagesRef, {
        text: input,
        createdAt: serverTimestamp(),
        sender: user?._id,
        role: role,
        receiver: receiverData?._id
      });
      setInput('');
    }
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

      return () => unsubscribe();
    }
  }, [user, receiverData]);

  const renderMessage = (message) => {
    return (
      <div>
        {message.text && <div>{message.text}</div>}
        {message.fileUrl && (
          <div style={styles.filePreview}>
            {message.fileType?.startsWith('image/') ? (
              <img src={message.fileUrl} alt="Shared" style={styles.previewImage} />
            ) : (
              <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
                View File
              </a>
            )}
          </div>
        )}
        <div style={styles.timestamp}>
          {message.createdAt?.seconds
            ? format(new Date(message.createdAt.seconds * 1000), 'Pp')
            : 'Sending...'}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>
        <img src={receiverData?.photo} alt="Doctor" style={styles.doctorPhoto} />
        <span style={styles.doctorName}>{receiverData?.name}</span>
      </div>
      <div style={styles.messageContainer} className='flex flex-col h-[200px]'>
        {messages.map((message, index) => (
          <div key={index} style={message.role === role ? styles.userMessage : styles.doctorMessage}>
            {renderMessage(message)}
          </div>
        ))}
      </div>
      {previewUrl && (
        <div style={styles.previewContainer}>
          {selectedFile?.type.startsWith('image/') ? (
            <img src={previewUrl} alt="Preview" style={styles.previewImage} />
          ) : (
            <div style={styles.filePreview}>
              Selected file: {selectedFile?.name}
            </div>
          )}
          <button 
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl('');
            }}
            style={styles.removeButton}
          >
            ×
          </button>
        </div>
      )}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          placeholder="Type a message..."
        />
        <label style={styles.uploadButton}>
          <Upload size={20} />
          <input
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept="image/*,.pdf,.doc,.docx"
          />
        </label>
        <button 
          onClick={handleSendMessage} 
          style={styles.sendButton}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  // ... (previous styles remain the same)
  previewContainer: {
    position: 'relative',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderTop: '1px solid #ccc',
  },
  previewImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'contain',
    borderRadius: '4px',
  },
  removeButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    cursor: 'pointer',
    color: '#007bff',
  },
  filePreview: {
    marginTop: '5px',
    padding: '5px',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '4px',
  },
  fileLink: {
    color: '#007bff',
    textDecoration: 'none',
  },
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
  }
};

export default Chat;