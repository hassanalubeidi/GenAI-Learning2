import { useCallback, useLayoutEffect, useState } from "react";
import { assistant_id, openai } from "~/ai/aiService";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "~/components/ui/card";
import { Avatar } from "~/components/ui/avatar";
import { RadioGroupItem, RadioGroup } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { MessageCreateParams } from "openai/resources/beta/threads/messages.mjs";
import ReactMarkdown from "react-markdown";
import { completeAndParseJSON } from "~/ai/finishJSON";
import useFileUpload from "~/lib/hooks";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [thread, setThread] = useState(null);
  const [lastToolCalled, setLastToolCalled] = useState(null);
  const [runId, setRunId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const { extractedText, handleFileUpload } = useFileUpload();

  const init = useCallback(async () => {
    const thread = await openai.beta.threads.create();
    setThread(thread);
    const startingMessage = {
      role: "assistant",
      content: "I'm an AI-powered career coach. Let's start by understanding your goals and preferences.",
    } as MessageCreateParams;
    await openai.beta.threads.messages.create(thread.id, startingMessage);
    setMessages([startingMessage]);
  }, []);

  const addMessage = async (content, hidden = false) => {
    if (!thread) {
      return;
    }
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: content,
    });

    const run = openai.beta.threads.runs
      .stream(thread.id, {
        assistant_id,
      })
      .on("runStepCreated", (run) => {
        console.log({ run });
        setRunId(run.run_id);
      })
      .on("textCreated", () => {
        setMessages((ms) => [
          ...ms,
          {
            role: "user",
            content: content,
            hidden,
          },
          {
            role: "assistant",
            content: "",
          },
        ]);
      })
      .on("textDelta", (text) => {
        console.log("text delta", text.value);
        setMessages((ms) => [
          ...ms.slice(0, -1),
          {
            role: "assistant",
            content: ms.at(-1).content + text.value,
          },
        ]);
      })
      .on("textDone", () => {
        console.log("done");
      })
      .on("error", (error) => {
        console.error(error);
      })
      .on("toolCallCreated", (toolCall) => {
        console.log({ toolCall });
        setMessages((ms) => [
          ...ms,
          {
            role: "assistant",
            content: "",
            fnName: toolCall?.function?.name,
            fn: {},
            uparsed: "",
          },
        ]);
        setLastToolCalled(toolCall.id);
      })
      .on("toolCallDelta", (toolCall) => {
        setMessages((ms) => {
          let fn;
          try {
            fn = JSON.parse(ms.at(-1).uparsed + toolCall.function.arguments);
            if (fn === null) {
              throw new Error("null");
            }
          } catch (error) {
            fn = completeAndParseJSON(
              ms.at(-1).uparsed + toolCall.function.arguments
            );
          }
          return [
            ...ms.slice(0, -1),
            {
              ...ms.at(-1),
              role: "assistant",
              content: "",
              fn: fn,
              uparsed: ms.at(-1).uparsed + toolCall.function.arguments,
            },
          ];
        });
      })
      .on("toolCallDone", (evt) => {
        console.log("tool call done", evt);
      });
  };

  useLayoutEffect(() => {
    init();
  }, []);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    addMessage(messageText).then(() => {
      setMessageText("");
    });
  };

  const handleSelectAnswer = (answer, question) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.question]: answer,
    }));
    setMessageText(JSON.stringify(selectedAnswers, null, 2));
    console.log({ selectedAnswers });
  };

  const handleSubmitAnswers = async () => {
    await openai.beta.threads.runs.cancel(thread.id, runId);
    addMessage(messageText, true).then(() => {
      setMessageText("");
    });
  };

  const sendFileUploadedMessage = async (evt) => {
    await openai.beta.threads.runs.cancel(thread.id, runId);
    handleFileUpload(evt).then(() => {
      addMessage(`CV: ${extractedText}`, true);
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <Card className="max-w-3xl w-full">
          <CardHeader>
            <CardTitle>AI Career Coach</CardTitle>
            <CardDescription>Let's find your dream job together!</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 w-full">
            {messages.map(
              (message, index) =>
                !message.hidden && (
                  <div key={index} className="flex items-start gap-4">
                    {message.role === "assistant" ? (
                      <Avatar className="rounded-full w-12 h-12 bg-green-500 text-white">
                        <span className="p-3">🤖</span>
                      </Avatar>
                    ) : (
                      <Avatar className="rounded-full w-12 h-12 bg-blue-500 text-white">
                        <span className="p-3 pl-3.5">👤</span>
                      </Avatar>
                    )}
                    <div className="grid gap-1">
                      <div className="font-bold">
                        {message.role === "assistant"
                          ? "AI Career Coach"
                          : "You"}
                      </div>
                      <div>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      {message.fn &&
                        message.fnName === "show_questions" &&
                        message.fn.questions &&
                        message.fn.questions.map((q, i) => (
                          <Card key={i}>
                            <CardHeader>
                              <CardTitle>{q.question}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-2 mt-5">
                              <RadioGroup
                                defaultValue="frontend"
                                className="gap-y-4"
                              >
                                {q.answers &&
                                  q.answers.map((answer, j) => (
                                    <Label
                                      key={j}
                                      htmlFor={answer}
                                      onClick={() =>
                                        handleSelectAnswer(answer, q)
                                      }
                                    >
                                      <RadioGroupItem
                                        id={answer}
                                        value={answer}
                                      />
                                      <span className="ml-2">{answer}</span>
                                    </Label>
                                  ))}
                              </RadioGroup>
                            </CardContent>
                          </Card>
                        ))}
                      {message.fn && message.fnName === "show_upload_dialog" && (
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="cv-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-400 dark:text-gray-500">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                PDF or Word document
                              </p>
                            </div>
                            <input
                              id="cv-upload"
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx"
                              onChange={sendFileUploadedMessage}
                            />
                          </label>
                        </div>
                      )}
                      {message.fn && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleSubmitAnswers}
                        >
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                )
            )}
          </CardContent>
        </Card>
      </div>
      <div className="sticky bottom-0 w-full p-4 bg-white dark:bg-gray-800">
        <div className="relative">
          <Textarea
            className="min-h-[128px] rounded-2xl resize-none p-4 border border-gray-200 border-neutral-400 shadow-sm pr-16 dark:border-gray-800"
            id="message"
            name="message"
            placeholder="Type your message..."
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            rows={1}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage(event);
              }
            }}
          />
          <Button
            className="absolute top-3 right-3 w-8 h-8"
            size="icon"
            onClick={handleSendMessage}
          >
            <ArrowUpIcon className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ArrowUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}