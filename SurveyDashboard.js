import React, { useState, useEffect } from 'react';

const SurveyDashboard = () => {
  const [aggregatedSurveys, setAggregatedSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndAggregateData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://127.0.0.1:8082/get-surveys');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawSurveys = await response.json();
        const topicsMap = {};

        const textToNumberMap = {
          "SA": 5, "A": 4, "N": 3, "D": 2, "SD": 1
        };

        rawSurveys.forEach((survey) => {
          const topic = survey.survey_topic || 'General Survey';

          if (!topicsMap[topic]) {
            topicsMap[topic] = {
              topicName: topic,
              totalSubmissions: 0,
              questions: {}
            };
          }

          topicsMap[topic].totalSubmissions += 1;

          if (survey.responses) {
            Object.entries(survey.responses).forEach(([questionKey, answer]) => {
              let numericValue = parseFloat(answer);
              
              if (isNaN(numericValue) && typeof answer === 'string') {
                numericValue = textToNumberMap[answer.toUpperCase()];
              }

              if (numericValue !== undefined && !isNaN(numericValue)) {
                if (!topicsMap[topic].questions[questionKey]) {
                  topicsMap[topic].questions[questionKey] = { sum: 0, count: 0 };
                }
                topicsMap[topic].questions[questionKey].sum += numericValue;
                topicsMap[topic].questions[questionKey].count += 1;
              }
            });
          }
        });

        const finalAggregatedData = Object.values(topicsMap).map((topicData) => {
          const questionAverages = {};
          Object.entries(topicData.questions).forEach(([qKey, totals]) => {
            questionAverages[qKey] = (totals.sum / totals.count).toFixed(1);
          });

          return {
            topic: topicData.topicName,
            totalSubmissions: topicData.totalSubmissions,
            averages: questionAverages
          };
        });

        setAggregatedSurveys(finalAggregatedData);
      } catch (err) {
        console.error("Error fetching surveys:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndAggregateData();
  }, []);

  // --- Professional UI Theme ---
  const theme = {
    wrapper: {
      backgroundColor: '#f8fafc', // Very soft modern gray/blue background
      minHeight: '100vh',
      padding: '40px 24px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
    },
    headerBox: {
      marginBottom: '32px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#0f172a',
      margin: '0 0 8px 0',
      letterSpacing: '-0.02em',
    },
    subtitle: {
      fontSize: '15px',
      color: '#64748b',
      margin: '0',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: '24px',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #f1f5f9',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0',
      lineHeight: '1.4',
    },
    badge: {
      backgroundColor: '#eff6ff',
      color: '#2563eb',
      padding: '6px 12px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
      marginLeft: '12px',
    },
    listTitle: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '16px',
    },
    questionRow: {
      marginBottom: '16px',
    },
    questionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#334155',
      fontWeight: '500',
    },
    scoreText: {
      fontWeight: '700',
      color: '#0f172a',
    },
    barTrack: {
      width: '100%',
      height: '8px',
      backgroundColor: '#f1f5f9',
      borderRadius: '4px',
      overflow: 'hidden',
    },
  };

  // Helper component to render the visual progress bar
  const ScoreBar = ({ score }) => {
    const percentage = (score / 5) * 100;
    // Dynamic color: Green for high, Yellow for medium, Red for low
    const barFillColor = score >= 4 ? '#10b981' : score >= 3 ? '#f59e0b' : '#ef4444';
    
    return (
      <div style={theme.barTrack}>
        <div 
          style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            backgroundColor: barFillColor,
            borderRadius: '4px',
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
          }} 
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div style={{ ...theme.wrapper, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '16px', fontWeight: '500' }}>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={theme.wrapper}>
        <div style={theme.container}>
          <div style={{ ...theme.card, borderTop: '4px solid #ef4444' }}>
            <h2 style={{ color: '#ef4444', marginTop: 0 }}>Connection Error</h2>
            <p style={{ color: '#64748b' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={theme.wrapper}>
      <div style={theme.container}>
        
        <div style={theme.headerBox}>
          <h1 style={theme.title}>Survey Intelligence</h1>
          <p style={theme.subtitle}>Aggregated performance averages across all user submissions.</p>
        </div>
        
        {aggregatedSurveys.length === 0 ? (
          <div style={theme.card}>
            <p style={{ color: '#64748b', textAlign: 'center', margin: '20px 0' }}>
              No survey data available yet.
            </p>
          </div>
        ) : (
          <div style={theme.grid}>
            {aggregatedSurveys.map((topic, index) => (
              <div key={index} style={theme.card}>
                
                <div style={theme.cardHeader}>
                  <h3 style={theme.cardTitle}>{topic.topic}</h3>
                  <div style={theme.badge}>
                    {topic.totalSubmissions} {topic.totalSubmissions === 1 ? 'Response' : 'Responses'}
                  </div>
                </div>
                
                <div style={theme.listTitle}>Average Scores by Question</div>

                {Object.keys(topic.averages).length === 0 ? (
                  <p style={{ fontSize: '14px', color: '#94a3b8' }}>No quantifiable data found.</p>
                ) : (
                  <div>
                    {Object.entries(topic.averages).map(([qKey, avgValue]) => (
                      <div key={qKey} style={theme.questionRow}>
                        <div style={theme.questionHeader}>
                          <span>Question {qKey}</span>
                          <span style={theme.scoreText}>{avgValue} <span style={{ color: '#94a3b8', fontWeight: '400' }}>/ 5</span></span>
                        </div>
                        <ScoreBar score={parseFloat(avgValue)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyDashboard;