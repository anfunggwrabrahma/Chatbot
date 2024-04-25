// Get the necessary elements from the DOM
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbot = document.querySelector('.chatbot');
const closeBtn = document.querySelector('.close-btn');
const chatbox = document.querySelector('.chatbox');
const textarea = document.querySelector('.chat-input textarea');
const sendBtn = document.getElementById('send-btn');

const greetings = [
  "Hello",
  "Hi",
  "Hey",
  "Good morning",
  "Good afternoon",
  "Good evening",
  "What's up?",
  "Greetings",
  "Salutations",
  "Yo",
  "Hey there",
  "Hiya",
  "What's happening?",
  "Howdy",
  "Morning",
  "Evening",
  "Hola",
  "Bonjour",
];

// Event listener for chatbot toggler button
chatbotToggler.addEventListener('click', () => {
  document.body.classList.toggle('show-chatbot');
});

// Event listener for close button
closeBtn.addEventListener('click', () => {
  document.body.classList.remove('show-chatbot');
});

// Event listener for send button
sendBtn.addEventListener('click', sendMessage);

// Event listener for Enter key press
textarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// Function to send a message
function sendMessage() {
  const message = textarea.value.trim();
  if (message !== '') {
    addOutgoingMessage(message);
    if (checkGreetings(message)) {
      addIncomingMessage("Hi, I am a link fetcher chatbot. Please tell me the name of the link you want to fetch.");
    } else {
      generateLink(message);
    }
    textarea.value = '';
  }
}

// Function to check if the message matches any greeting in the greetings array
function checkGreetings(message) {
  const lowercaseMessage = message.toLowerCase();
  for (const greeting of greetings) {
    if (lowercaseMessage.includes(greeting.toLowerCase())) {
      return true;
    }
  }
  return false;
}

// Function to add an outgoing message to the chatbox
function addOutgoingMessage(message) {
  const chat = document.createElement('li');
  chat.classList.add('chat', 'outgoing');
  chat.innerHTML = `
    <p>${message}</p>
    <span class="material-symbols-outlined">smart_toy</span>
  `;
  chatbox.appendChild(chat);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Function to add an incoming message to the chatbox
function addIncomingMessage(message) {
  const chat = document.createElement('li');
  chat.classList.add('chat', 'incoming');
  chat.innerHTML = `
    <span class="material-symbols-outlined">smart_toy</span>
    <p>${message}</p>
  `;
  chatbox.appendChild(chat);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Function to calculate the Jaccard index between two strings
function calculateJaccardIndex(str1, str2) {
  const set1 = new Set(str1.toLowerCase().split(' '));
  const set2 = new Set(str2.toLowerCase().split(' '));

  const intersection = new Set([...set1].filter(value => set2.has(value)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

// Function to find the most similar keyword in the similarity matrix
function findMostSimilarKeyword(query) {
  let mostSimilarKeyword = '';
  let maxSimilarity = 0;

  for (const item of data) {
    const similarity = calculateJaccardIndex(query, item.keyword);
    if (similarity > maxSimilarity) {
      mostSimilarKeyword = item.keyword;
      maxSimilarity = similarity;
    }
  }
  return mostSimilarKeyword;
}

// Function to generate link based on query
function generateLink(query) {
  const keywords = query.toLowerCase().split(' ');

  const keywordMatches = data.filter(item => keywords.includes(item.keyword));

  if (keywordMatches.length > 0) {
    const linkMessages = keywordMatches.map(item => {
      const link = item.url;
      return `Here is the link for ${item.keyword}: <a href="${link}" target="_blank">${link}</a>`;
    });

    linkMessages.forEach(linkMessage => {
      addIncomingMessage(linkMessage);
    });

    return; // Return early to avoid executing the rest of the code
  }

  const singleKeywordMatches = data.filter(item => item.keyword.toLowerCase().includes(query.toLowerCase()));

  if (keywords.length === 1 && singleKeywordMatches.length > 0) {
    const linkMessages = singleKeywordMatches.map(item => {
      const link = item.url;
      return `Here is the link for ${item.keyword}: <a href="${link}" target="_blank">${link}</a>`;
    });

    linkMessages.forEach(linkMessage => {
      addIncomingMessage(linkMessage);
    });

    return; // Return early to avoid executing the rest of the code
  }

  const mostSimilarKeyword = findMostSimilarKeyword(query);

  if (mostSimilarKeyword) {
    const item = data.find(obj => obj.keyword === mostSimilarKeyword);
    const link = item.url;
    const linkMessage = `Here is the link you requested: <a href="${link}" target="_blank">${link}</a>`;
    addIncomingMessage(linkMessage);
  } else {
    const errorMessage = 'Sorry, I could not find a link for your query. Please try again and be more precise.';
    addIncomingMessage(errorMessage);
  }
}
