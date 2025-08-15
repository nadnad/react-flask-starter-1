import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, CircularProgress, List, ListItem, ListItemText, Divider, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '30px',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  card: {
    padding: '20px',
    marginBottom: '20px',
    minHeight: '200px',
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
  feedbackItem: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: '10px',
    borderRadius: '4px',
  },
  feedbackMeta: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  backButton: {
    marginBottom: '20px',
    color: '#35baf6',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  noFeedback: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: '40px',
  },
}));

function FeedbackPage() {
  const classes = useStyles();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/feedback');
      const data = await response.json();
      
      if (response.ok) {
        setFeedbackList(data.feedback || []);
      } else {
        setError(data.error || 'Failed to fetch feedback');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box className={classes.container}>
        <Box className={classes.loadingContainer}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box className={classes.container}>
      <Button 
        component={Link} 
        to="/" 
        className={classes.backButton}
        variant="outlined"
      >
        ← Back to Home
      </Button>
      
      <Box className={classes.header}>
        <Typography variant="h3" component="h1">
          Feedback
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          All feedback submissions from users
        </Typography>
      </Box>

      <Card className={classes.card}>
        {error ? (
          <Box className={classes.noFeedback}>
            <Typography color="error">{error}</Typography>
            <Button 
              onClick={fetchFeedback} 
              variant="outlined" 
              style={{ marginTop: '20px' }}
            >
              Try Again
            </Button>
          </Box>
        ) : feedbackList.length === 0 ? (
          <Box className={classes.noFeedback}>
            <Typography>No feedback submitted yet.</Typography>
            <Typography variant="body2" style={{ marginTop: '10px' }}>
              Be the first to share your thoughts!
            </Typography>
          </Box>
        ) : (
          <List>
            {feedbackList.map((feedback, index) => (
              <React.Fragment key={feedback.id}>
                <ListItem className={classes.feedbackItem} alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="h6" component="div">
                          {feedback.name}
                        </Typography>
                        <Typography variant="body2" className={classes.feedbackMeta}>
                          {feedback.email} • {formatDate(feedback.created_at)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography 
                        variant="body1" 
                        style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}
                      >
                        {feedback.message}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < feedbackList.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>
    </Box>
  );
}

export default FeedbackPage;