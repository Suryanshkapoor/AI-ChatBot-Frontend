import './questionAnswer.css'
const QuestionAnswer = ({ answer, question }) => {
  
	return (
	  <div className="mx-20 max-w-3xl flex flex-col items-start">
		<div className="mt-4 flex mb-10 w-full">
		  <div className="flex text-base text-gray-300 gap-7 w-full">
			<img className="w-8 h-8" src="./user.jpg" alt="user" />
			<p className="overflow-hidden text-ellipsis max-w-full">{question}</p>
		  </div>
		</div>
		<div className="flex w-full">
		  <div className="flex text-base text-gray-300 gap-7 w-full">
			<img className="w-8 h-8" src="./chatgpt-icon.png" alt="chatgpt" />
			<pre className="font-sans text-wrap max-w-full">{answer}<span id="cursor"> | </span></pre>
		  </div>
		</div>
	  </div>
	);
  };
  
  export default QuestionAnswer;
  