export const WORD_POOL = {
  en: {
    easy: 'the and you that was for are with his they this have from one had word but not what all were we when your can said there use an each which she do how their if will up other about out many then them these so some her would make like him into time has look two more write go see number no way could people my than first water been call who oil its now find long down day did get come made may part'.split(' '),
    medium: 'because thought through between mother another country picture animal letter mother answer almost during without several morning example process usually mountain although language completely important question together measure remember sentence'.split(' '),
    hard: 'exaggerate communication pronunciation sophisticated characteristic unconstitutional representation philosophical psychological administrative mathematical infrastructure terminology biodiversity'.split(' '),
    expert: 'polymorphism asynchronous middleware authentication serialization cryptography cryptocurrency obfuscation concurrency parallelism refactoring optimization methodology instantiate'.split(' ')
  },
  hi: {
    easy: 'और मैं है यह वह के में से को पर नहीं एक क्या हैं था थी थे कर अपने साथ कोई भी बहुत कुछ कैसे'.split(' '),
    medium: 'इसलिए लेकिन क्योंकि हमेशा कभी चाहिए सिर्फ बिल्कुल शायद शायद समझना बताना'.split(' '),
    hard: 'महत्वपूर्ण आवश्यकता जानकारी उपयोग समस्या विचार अनुभव'.split(' '),
    expert: 'अंतर्राष्ट्रीय अर्थव्यवस्था प्रौद्योगिकी दृष्टिकोण'.split(' ')
  },
  hinglish: {
    easy: 'aur main hai yeh woh ke mein se ko par nahi ek kya hain tha thi the kar apne saath koi bhi bahut kuch kaise'.split(' '),
    medium: 'isliye lekin kyunki hamesha kabhi chahiye sirf bilkul shayad samajhna batana'.split(' '),
    hard: 'mahatvapurna avashyakta jaankari upyog samasya vichar anubhav'.split(' '),
    expert: 'antarrashtriya arthvyavastha praudyogiki drishtikon'.split(' ')
  }
};

export const CODE_SNIPPETS = [
  "const calculateWpm = (chars, time) => Math.round((chars / 5) / (time / 60));",
  "function factorial(n) {\n  if (n === 0 || n === 1) return 1;\n  return n * factorial(n - 1);\n}",
  "import React, { useState } from 'react';\n\nexport const Counter = () => {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n};",
  "for (let i = 0; i < 10; i++) {\n  console.log(`Iteration ${i}`);\n}"
];

export const generateAdaptiveWordList = (count, profile) => {
  const { weakKeys, slowWords, difficultyLevel, language = 'en' } = profile;
  
  const langPool = WORD_POOL[language] || WORD_POOL.en;
  const pool = langPool[difficultyLevel] || langPool.easy;
  
  // Sort weak keys
  const sortedWeakKeys = Object.entries(weakKeys)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([key]) => key);

  // Find words containing weak keys
  const adaptivePool = pool.filter(word => 
    sortedWeakKeys.some(key => word.includes(key))
  );

  // Add slow words to adaptive pool
  const sortedSlowWords = Object.entries(slowWords)
    .sort(([, a], [, b]) => b - a)
    .map(([word]) => word);
  
  adaptivePool.push(...sortedSlowWords);

  const result = [];
  const adaptiveCount = Math.floor(count * 0.4);
  const randomCount = count - adaptiveCount;

  // Add adaptive words
  for (let i = 0; i < adaptiveCount; i++) {
    if (adaptivePool.length > 0) {
      result.push(adaptivePool[Math.floor(Math.random() * adaptivePool.length)]);
    } else {
      result.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  }

  // Add random words
  for (let i = 0; i < randomCount; i++) {
    result.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  // Shuffle the result array
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};
