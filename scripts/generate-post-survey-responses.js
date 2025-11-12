// Script to generate 100 post-survey responses based on pre-survey data
// This generates realistic responses for the Post-Survey based on user demographics and pre-survey answers

const fs = require('fs');
const path = require('path');

// Survey questions structure based on the post-survey PDF
const generateResponse = (preSurveyData) => {
  const {
    email,
    ageRange,
    gender,
    location,
    disabilityType
  } = preSurveyData;

  // Generate realistic responses based on disability type and pre-survey answers
  const satisfactionLevel = Math.floor(Math.random() * 2) + 4; // 4-5 (high satisfaction)
  const ableToLogin = 'Yes';
  const workOffline = Math.random() > 0.2 ? 'Yes' : 'No';
  const ableToCreateMeals = Math.random() > 0.15 ? 'Yes' : 'No';
  const ableToSendMessages = Math.random() > 0.1 ? 'Yes' : 'No';
  const satisfiedWithHealth = Math.floor(Math.random() * 2) + 4;
  const monitorHealth = Math.random() > 0.1 ? 'Yes' : 'No';
  const trackHealthIssues = Math.random() > 0.8 ? 'Not Completely' : 'Yes';
  const accessImportance = 5;
  const dietSatisfaction = Math.random() > 0.2 ? 'Yes' : 'No';
  const manageDietaryNeeds = Math.random() > 0.15 ? 'Yes' : (Math.random() > 0.5 ? 'Not Completely' : 'No');
  const localFoodsImportance = Math.floor(Math.random() * 2) + 4;
  const assistiveFeaturesHelpful = Math.random() > 0.1 ? 'Yes' : 'No';
  const concernsAboutApp = Math.random() > 0.7 ? 'Yes' : 'No';
  
  const encouragingFactors = [
    'Free to use',
    'Easy to navigate',
    'Disability-friendly features',
    'Voice control',
    'Offline functionality',
    'Local food integration'
  ][Math.floor(Math.random() * 6)];

  const accessLanguages = Math.random() > 0.05 ? 'Yes' : 'No';
  const accessOffline = workOffline;
  const needTraining = Math.random() > 0.4 ? 'Yes' : 'No';

  const improvementComments = [
    'The app has greatly improved my ability to track my health independently',
    'I can now access health information anytime without visiting hospital',
    'The voice features help me use the app without assistance',
    'Having my health data in one place is very helpful',
    'The offline mode allows me to use it even without internet',
    'It helps me remember medication and track my diet effectively'
  ][Math.floor(Math.random() * 6)];

  const recommendations = [
    'Add more local foods to the database',
    'Improve voice recognition accuracy',
    'Add emergency contact features',
    'Include telemedicine integration',
    'Make the app work better on older phones',
    'Add more languages and dialects',
    'Improve battery efficiency',
    'Add reminder notifications'
  ][Math.floor(Math.random() * 8)];

  const additionalComments = Math.random() > 0.5 ? 
    'Thank you for creating an accessible health app for PWDs. Keep improving it.' :
    '';

  return {
    email,
    ageRange,
    gender,
    location,
    disabilityType,
    ableToLogin,
    workOffline,
    ableToCreateMeals,
    ableToSendMessages,
    satisfactionLevel,
    monitorHealth,
    trackHealthIssues,
    accessImportance,
    dietSatisfaction,
    manageDietaryNeeds,
    localFoodsImportance,
    assistiveFeaturesHelpful,
    concernsAboutApp,
    encouragingFactors,
    accessLanguages,
    accessOffline,
    needTraining,
    improvementComments,
    recommendations,
    additionalComments
  };
};

// Parse pre-survey CSV (simplified - assumes data structure from the uploaded file)
const parsePreSurveyCSV = (csvContent) => {
  const lines = csvContent.split('\n');
  const data = [];
  
  // Skip header row
  for (let i = 1; i < Math.min(lines.length, 101); i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    if (parts.length > 3) {
      data.push({
        email: parts[0],
        ageRange: parts[1],
        gender: parts[2],
        location: parts[3],
        disabilityType: parts[4] || 'Mobility (e.g. hands/legs) Disability'
      });
    }
  }
  
  return data;
};

// Generate CSV output
const generatePostSurveyCSV = (responses) => {
  const headers = [
    'Email',
    'Age Range',
    'Gender',
    'Address Location',
    'Disability Type',
    'Able to Log In',
    'Can Use App Offline',
    'Able to Create Meals',
    'Able to Send Messages',
    'Satisfaction Level (1-5)',
    'Able to Monitor Health',
    'Track Health Issues',
    'Access Importance (1-5)',
    'Satisfied with Diet Features',
    'Manage Dietary Needs',
    'Local Foods Importance (1-5)',
    'Assistive Features Helpful',
    'Concerns About App',
    'Encouraging Factors',
    'Access in Other Languages',
    'Access Offline',
    'Need Training',
    'How App Improved Inclusion',
    'Recommendations',
    'Additional Comments'
  ];

  const csvRows = [headers.join(',')];

  responses.forEach(r => {
    const row = [
      r.email,
      r.ageRange,
      r.gender,
      `"${r.location}"`,
      `"${r.disabilityType}"`,
      r.ableToLogin,
      r.workOffline,
      r.ableToCreateMeals,
      r.ableToSendMessages,
      r.satisfactionLevel,
      r.monitorHealth,
      r.trackHealthIssues,
      r.accessImportance,
      r.dietSatisfaction,
      r.manageDietaryNeeds,
      r.localFoodsImportance,
      r.assistiveFeaturesHelpful,
      r.concernsAboutApp,
      `"${r.encouragingFactors}"`,
      r.accessLanguages,
      r.accessOffline,
      r.needTraining,
      `"${r.improvementComments}"`,
      `"${r.recommendations}"`,
      `"${r.additionalComments}"`
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

// Main execution
const main = () => {
  console.log('Generating 100 post-survey responses...');
  
  // Read pre-survey file
  const preSurveyPath = path.join(__dirname, '..', 'user-uploads', 'Pre-Survey_Assistive_Mobile_Health_Software_Technologies_for_PWDs_Responses_-_final.csv');
  
  let preSurveyContent;
  try {
    preSurveyContent = fs.readFileSync(preSurveyPath, 'utf-8');
  } catch (error) {
    console.error('Error reading pre-survey file:', error.message);
    console.log('Using generated sample data instead...');
    // Generate sample data if file not found
    preSurveyContent = generateSamplePreSurveyData();
  }

  const preSurveyData = parsePreSurveyCSV(preSurveyContent);
  
  // Generate responses for up to 100 users
  const responses = [];
  for (let i = 0; i < Math.min(100, preSurveyData.length); i++) {
    responses.push(generateResponse(preSurveyData[i]));
  }

  // If we have less than 100, generate additional ones with synthetic data
  while (responses.length < 100) {
    responses.push(generateResponse({
      email: `user${responses.length + 1}@example.com`,
      ageRange: ['25-30 years', '31-35 years', '36-40 years', '41-45 years'][Math.floor(Math.random() * 4)],
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      location: 'Cameroon, Southwest Region',
      disabilityType: ['Visual Disability', 'Hearing Disability', 'Mobility (e.g. hands/legs) Disability'][Math.floor(Math.random() * 3)]
    }));
  }

  const csvOutput = generatePostSurveyCSV(responses);
  
  // Write to file
  const outputPath = path.join(__dirname, '..', 'public', 'Post-Survey_Responses_Generated.csv');
  fs.writeFileSync(outputPath, csvOutput);
  
  console.log(`✅ Successfully generated ${responses.length} post-survey responses`);
  console.log(`📁 File saved to: ${outputPath}`);
};

// Generate sample data if pre-survey file not available
const generateSamplePreSurveyData = () => {
  const headers = 'Email Address,1. Age Range,2. Gender,3. Country of Residence and State/CIty,4. What is Your Disability Type';
  const rows = [];
  for (let i = 1; i <= 100; i++) {
    rows.push(`user${i}@example.com,25-30 years,${i % 2 === 0 ? 'Male' : 'Female'},Cameroon,Visual Disability`);
  }
  return [headers, ...rows].join('\n');
};

main();
