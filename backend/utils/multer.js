import multer from 'multer';

const storage = () => multer.memoryStorage(); // Store the file data in memory for encryption

export const uploadUserImage = multer({ storage: storage() }).single('file');
