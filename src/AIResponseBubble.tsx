export enum AIResponseType {
  Error = "error",
  Info = "info",
}

export interface AIResponse {
  message: string;
  type: AIResponseType;
}

interface Props {
  aiResponse: AIResponse;
}

const AIResponseBubble = ({ aiResponse }: Props) => {
  return aiResponse.message ? (
    <div className="chat chat-start pt-3">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
            />
          </svg>
        </div>
      </div>
      <div
        className={`chat-bubble ${
          aiResponse.type === AIResponseType.Error ? "chat-bubble-error" : ""
        }`}
      >
        {aiResponse.message}
      </div>
    </div>
  ) : null;
};

export default AIResponseBubble;
