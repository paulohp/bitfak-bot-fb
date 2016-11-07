const natural = require('natural');

const classifier = new natural.BayesClassifier();


classifier.addDocument('pay my bills', 'pay');
classifier.addDocument('pay my check', 'pay');
classifier.addDocument('pay my invoice', 'pay');
classifier.addDocument('withdraw money to my account', 'withdrawal');
classifier.addDocument('send money to my account', 'withdrawal');
classifier.addDocument('what\'s bitcoin price', 'getPrice');
classifier.addDocument('recharge my phone', 'topup');
classifier.addDocument('topup my phone', 'topup');

classifier.train();

classifier.save('classifier.json', function(err, classifier) {
  if(!err){
    console.log('Done without errors');
  }else{
    console.error('Something went wrong', err);
  }
});