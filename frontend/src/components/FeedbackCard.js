import React, { useState } from 'react';
import { Card, TextField, Button, Typography, Box, Snackbar, Alert, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

function FeedbackCard(props) {
  const { classes } = props;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFormData({ name: '', email: '', message: '' });
        setNotification({
          open: true,
          message: 'Feedback submitted successfully!',
          severity: 'success'
        });
      } else {
        setNotification({
          open: true,
          message: data.error || 'Failed to submit feedback',
          severity: 'error'
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Network error. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <Card className={classes.card}>
        <h2>Feedback</h2>
        <Typography variant="body1" style={{ marginBottom: '10px' }}>
          We'd love to hear from you! Please share your thoughts about this React + Flask starter template.
        </Typography>
        <Typography variant="body2" style={{ marginBottom: '20px' }}>
          <Link component={RouterLink} to="/feedback" style={{ color: '#35baf6' }}>
            View all feedback →
          </Link>
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              name="name"
              label="Your Name"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.09)' }}
            />
          </Box>
          
          <Box mb={2}>
            <TextField
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.09)' }}
            />
          </Box>
          
          <Box mb={2}>
            <TextField
              fullWidth
              name="message"
              label="Your Feedback"
              variant="outlined"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.09)' }}
            />
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            className={classes.contained}
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </Card>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FeedbackCard;