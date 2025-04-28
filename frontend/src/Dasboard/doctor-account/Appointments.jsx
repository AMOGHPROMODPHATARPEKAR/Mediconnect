import React, { useState } from 'react';
import { formateDate } from '../../utils/formateDate';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Avatar,
  IconButton,
  CircularProgress,
  Box,
  Typography,
  Tooltip,
  Modal
} from '@mui/material';
import { Upload, X, FileText, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {token} from '../../config.js'
import uploadToCloudinary from '../../utils/uploadToCloudinary.js'

const Appointments = ({ appointments }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [fileType, setFileType] = useState(null); // 'image' or 'pdf'

  

  const navigate = useNavigate()

  const activeAppointments = appointments?.filter(item => item.status !== 'completed') || [];

  // const handleViewRecord = async (record,id) => {
  //   setLoadingImage(true);
  //   try {
  //     const response = await fetch(`/api/v1/ipfs/getImage?userId=${id}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         ipfsHash: record.ipfsHash
  //       })
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch image');
  //     }

  //     const data = await response.json();
  //     setSelectedImage(`data:image/jpeg;base64,${data.depcryptedImage}`);
  //     setImageDialogOpen(true);
  //   } catch (error) {
  //     console.error('Error fetching image:', error);
  //   } finally {
  //     setLoadingImage(false);
  //   }
  // };

  const handleViewRecord = async (record, id) => {
    setLoadingImage(true);
    try {
      const response = await fetch(`/api/v1/ipfs/getImage?userId=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ipfsHash: record.ipfsHash }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
  
      const data = await response.json();
  
      // Check if it's a PDF or image based on the format returned
      const base64Data = data.depcryptedImage;
      const isPDF = base64Data.startsWith('JVBER'); // Basic PDF file signature
  
      if (isPDF) {
        setFileType('pdf');
        setSelectedPDF(`data:application/pdf;base64,${base64Data}`);
      } else {
        setFileType('image');
        setSelectedImage(`data:image/jpeg;base64,${base64Data}`);
      }
  
      setImageDialogOpen(true);
    } catch (error) {
      console.error('Error fetching file:', error);
    } finally {
      setLoadingImage(false);
    }
  };
  

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const data  = await uploadToCloudinary(selectedFile);
      setFileUrl(data?.url);
      
      setSelectedFile(null); // Clear the selected file
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleComplete = async (appointmentId) => {
    try {
      const response = await fetch(`/api/v1/bookings/${appointmentId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: 'completed', 
          remarks,
          reportUrl: fileUrl
        }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setRemarks('');
        setFileUrl('');
      }

      navigate('/doctor/profile/me')
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setRemarks('');
    setSelectedFile(null);
    setFileUrl('');
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="appointments table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Medical Info</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Booked On</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeAppointments?.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={item?.user?.photo} alt={item.user?.name} />
                    <div style={{ marginLeft: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{item.user?.name}</div>
                      <div style={{ color: 'gray' }}>{item.user?.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.user?.gender}</TableCell>
                <TableCell>
                  <div>
                    <div><strong>Blood Type:</strong> {item.user?.bloodType || 'N/A'}</div>
                    <div>
                      <strong>Allergies:</strong>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {item.user?.allergies?.length > 0 ? (
                          item.user.allergies.map((allergy, index) => (
                            <Chip 
                              key={index}
                              label={allergy}
                              size="small"
                              color="warning"
                              sx={{ margin: '2px' }}
                            />
                          ))
                        ) : (
                          'None reported'
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {item.user?.records?.length > 0 ? (
                    item.user.records.map((record, index) => (
                      <Tooltip key={index} title={record.name || `View Record ${index + 1}`}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewRecord(record,item.user._id)}
                          disabled={loadingImage}
                          sx={{ mr: 1 }}
                        >
                          {loadingImage ? <CircularProgress size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </Tooltip>
                    ))
                  ) : (
                    'No records'
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.isPaid ? "Paid" : "Unpaid"}
                    color={item.isPaid ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{item.ticketPrice}</TableCell>
                <TableCell>{formateDate(item.createdAt)}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    color={
                      item.status === 'pending' ? 'warning' :
                      item.status === 'approved' ? 'success' : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                      setSelectedAppointment(item);
                      setIsDialogOpen(true);
                    }}
                  >
                    Complete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Appointment Completion Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Complete Appointment</DialogTitle>
        <DialogContent>
          <p style={{ marginBottom: '1rem' }}>
            Enter your remarks about the appointment for {selectedAppointment?.user?.name}
          </p>
          <TextField
            autoFocus
            margin="dense"
            label="Remarks"
            fullWidth
            multiline
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Report/Documents
            </Typography>
            
            {!fileUrl && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload />}
                  disabled={uploading}
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </Button>
                {selectedFile && (
                  <>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {selectedFile.name}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleFileUpload}
                      disabled={uploading}
                    >
                      {uploading ? <CircularProgress size={24} /> : 'Upload'}
                    </Button>
                  </>
                )}
              </Box>
            )}

            {fileUrl && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Chip
                  label="File uploaded successfully"
                  color="success"
                  onDelete={() => setFileUrl('')}
                  deleteIcon={<X size={16} />}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={() => handleComplete(selectedAppointment?._id)}
            color="primary"
            variant="contained"
            disabled={!remarks.trim() || (!fileUrl && selectedFile)}
          >
            Complete Appointment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Viewing Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="md" fullWidth>
  <DialogTitle>Record Preview</DialogTitle>
  <DialogContent>
    {fileType === 'image' && (
      <img src={selectedImage} alt="Record" style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
    )}
    {fileType === 'pdf' && (
      <iframe
        src={selectedPDF}
        title="PDF Record"
        width="100%"
        height="600px"
        style={{ border: 'none' }}
      />
    )}
  </DialogContent>
</Dialog>

    </div>
  );
};

export default Appointments;