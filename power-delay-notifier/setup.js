#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('⚡ Power Delay Notifier Setup');
console.log('=============================\n');

const questions = [
  {
    name: 'DB_HOST',
    question: 'MySQL Host (default: localhost): ',
    default: 'localhost'
  },
  {
    name: 'DB_USER',
    question: 'MySQL Username (default: root): ',
    default: 'root'
  },
  {
    name: 'DB_PASSWORD',
    question: 'MySQL Password: ',
    default: ''
  },
  {
    name: 'DB_NAME',
    question: 'Database Name (default: power_delay_notifier): ',
    default: 'power_delay_notifier'
  },
  {
    name: 'DB_PORT',
    question: 'MySQL Port (default: 3306): ',
    default: '3306'
  },
  {
    name: 'PORT',
    question: 'Server Port (default: 3000): ',
    default: '3000'
  },
  {
    name: 'JWT_SECRET',
    question: 'JWT Secret (generate a strong random string): ',
    default: ''
  },
  {
    name: 'EMAIL_USER',
    question: 'Gmail Address: ',
    default: ''
  },
  {
    name: 'EMAIL_PASS',
    question: 'Gmail App Password: ',
    default: ''
  }
];

let currentQuestion = 0;
const answers = {};

function askQuestion() {
  if (currentQuestion >= questions.length) {
    generateEnvFile();
    return;
  }

  const q = questions[currentQuestion];
  rl.question(q.question, (answer) => {
    answers[q.name] = answer || q.default;
    currentQuestion++;
    askQuestion();
  });
}

function generateEnvFile() {
  const envContent = `# Database Configuration
DB_HOST=${answers.DB_HOST}
DB_USER=${answers.DB_USER}
DB_PASSWORD=${answers.DB_PASSWORD}
DB_NAME=${answers.DB_NAME}
DB_PORT=${answers.DB_PORT}

# Server Configuration
PORT=${answers.PORT}
NODE_ENV=development

# JWT Configuration
JWT_SECRET=${answers.JWT_SECRET}

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=${answers.EMAIL_USER}
EMAIL_PASS=${answers.EMAIL_PASS}
EMAIL_FROM=${answers.EMAIL_USER}
`;

  const envPath = path.join(__dirname, '.env');

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Create the MySQL database:');
    console.log(`   CREATE DATABASE ${answers.DB_NAME};`);
    console.log('2. Start the application:');
    console.log('   npm run dev');
    console.log('3. Visit http://localhost:' + answers.PORT);
    console.log('\n📚 For more information, see README.md');
  } catch (error) {
    console.error('Error creating .env file:', error.message);
  }

  rl.close();
}

// Start the setup process
askQuestion(); 