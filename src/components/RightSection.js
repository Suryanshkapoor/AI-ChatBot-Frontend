import { PlaneIcon } from "../assets/icons";
import { useEffect, useState, useRef } from "react";
import QuestionAnswer from "./QuestionAnswer";

function RightSection() {
  const [prompt, setPrompt] = useState("");
  const [answer, setanswer] = useState([]);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const scrollContainerRef = useRef(null);

	useEffect(() => {
		if (scrollContainerRef.current) {
		scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
		}
	}, [answer]);

  const handleStreamingResponse = async (response) => {
    for (const word of response) {
      if (!isMounted.current || loading) {
        return;
      }
      setanswer((prevanswer) => [...prevanswer, word]);
      await new Promise((resolve) => setTimeout(resolve, 2));
    }
  };

  useEffect(() => {
    setanswer([]);
    return () => {
      isMounted.current = false;
    };
  }, [question]);


  

  const handleSubmit = async (e) => {
    setQuestion(prompt);
    setLoading(true);
    e.preventDefault();
    setPrompt("");

    try {
      const res = await fetch(
        "https://ai-server-q4ey.onrender.com/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );
      const reader = res.body.getReader();
      const response = await reader.read()
      setLoading(false);
      isMounted.current = true;
      await handleStreamingResponse(new TextDecoder().decode(response.value));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  return (
    <div className="h-full pl-[260px]">
      <main className="relative h-full w-full flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-col text-sm h-screen bg-lightBlack">
            <div ref={scrollContainerRef} className="text-gray-800 w-full max-w-2xl overflow-x-hidden overflow-y-scroll scroll-auto flex flex-col px-6 min-w-full">
              {!question &&(
                <h1 className="text-4xl text-gray-100 font-semibold text-center mt-[20vh] mx-auto mb-16">
                  ChatGPT
                </h1>
              )}
              {question &&(
                <QuestionAnswer answer={loading?'':answer} question={question} />
              )}
            </div>
            <div className="w-full h-48 flex-shrink-0"></div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 bg-vert-light-gradient !bg-transparent bg-gray-800 w-full">
          <form
            className="flex gap-3 last:mb-6 mx-auto max-w-3xl pt-6"
            onSubmit={handleSubmit}
          >
            <div className="relative flex h-full flex-1 flex-col">
              <div className="flex flex-col w-full flex-grow py-3 relative border-black/10 dark:border-gray-900/50 text-white rounded-md bg-[rgba(64,65,79, var(--tw-bg-opacity))]">
                <input
                  className="m-0 rounded-2xl w-full resize-none border border-gray-400 bg-transparent p-5 pl-9 focus:ring-0 focus-visible:ring-0 outline-none overflow-y-hidden h-[23px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button className="absolute p-1 rounded-md text-gray-400 bottom-5 right-2 hover:bg-black">
                  <PlaneIcon />
                </button>
              </div>
            </div>
          </form>
          <div className="text-center text-xs text-gray-100/50 px-4 pt-1 pb-6">
            <span className="text-gray-200 underline underline-offset-2">
              This is a skills demonstrative project made by Suryansh Kapoor.
            </span>
            <p>Free instance types (server) will spin-down after few minutes of inactivity, then will spin back up when the next request is made, and that restart can take some time.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RightSection;
