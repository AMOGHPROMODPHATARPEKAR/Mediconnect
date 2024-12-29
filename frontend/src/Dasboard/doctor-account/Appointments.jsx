import React, { useState } from 'react';
import { formateDate } from '../../utils/formateDate';
import uploadToCloudinary from '../../utils/uploadToCloudinary'
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
  Typography
} from '@mui/material';
import { Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Appointments = ({ appointments }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate()

  const activeAppointments = appointments?.filter(item => item.status !== 'completed') || [];

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
        },
        body: JSON.stringify({ 
          status: 'completed', 
          remarks,
          reportUrl: fileUrl // Include the file URL in the request
        }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setRemarks('');
        setFileUrl('');
        // Refresh appointments data here
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

      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Complete Appointment
        </DialogTitle>
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
          <Button 
            onClick={handleCloseDialog}
            color="inherit"
          >
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
    </div>
  );
};

export default Appointments;