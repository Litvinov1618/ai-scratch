import { useEffect, useMemo, useRef, useState } from "react";
import gesturesVideo from "./assets/gestures.mp4";
import similarPhrases from "./assets/similarPhrases.mp4";
import aiSuggestions from "./assets/aiSuggestions.mp4";
import timeQueries from "./assets/timeQueries.mp4";
import closeOnDialogClickOutside from "./closeOnDialogClickOutside";

const STEPS = [
  {
    title: "Easy Access to Notes List",
    description:
      "To quickly open the notes list on your mobile device, simply use swiping gestures.",
    shortTitle: "Swipe Gesture",
    video: gesturesVideo,
  },
  {
    title: "Simplify Searching with Similar Words or Phrases",
    description:
      "If you're unsure about the exact wording used in your notes, you can use similar words or phrases when searching.",
    shortTitle: "Similar Phrases",
    video: similarPhrases,
  },
  {
    title: "AI Helper Suggestions during Note Search",
    description:
      "To make your note searching experience more efficient, the AI helper will provide helpful suggestions based on your query.",
    shortTitle: "AI Suggestions",
    video: aiSuggestions,
  },
  {
    title: "Time-Based Queries for Efficient Note Retrieval",
    description:
      "You can provide time-based queries when searching for notes, such as a date or a range, to retrieve notes created or modified during that period.",
    shortTitle: "Time Queries",
    video: timeQueries,
  },
];

interface Props {
  setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>;
}

function TutorialModal({ setIsNewUser }: Props) {
  const [step, setStep] = useState(STEPS[0]);
  const [isModalShown, setIsModalShown] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const modalRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const loadedDataEventListener = () => setIsVideoLoading(false);
    const loadStartEventListener = () => setIsVideoLoading(true);

    video.addEventListener("loadeddata", loadedDataEventListener);
    video.addEventListener("loadstart", loadStartEventListener);

    return () => {
      video?.removeEventListener("loadeddata", loadedDataEventListener);
      video?.removeEventListener("loadstart", loadStartEventListener);
    };
  }, [videoRef]);

  const setNextStep = () => {
    const nextStepIndex = STEPS.indexOf(step) + 1;
    if (nextStepIndex < STEPS.length) {
      setStep(STEPS[nextStepIndex]);
    }

    if (nextStepIndex === STEPS.length) {
      setIsNewUser(false);
      setIsModalShown(false);
    }
  };

  const stepIndex = useMemo(() => STEPS.indexOf(step), [step]);

  const onModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    closeOnDialogClickOutside(e, () => setIsModalShown(false));
  };

  return (
    <div>
      <input
        type="checkbox"
        id="my-modal"
        className="modal-toggle"
        checked={isModalShown}
        onChange={() => setIsModalShown(!isModalShown)}
      />
      <div className="modal backdrop-blur-sm" onClick={onModalClick}>
        <div
          className="modal-box p-4 relative no-scrollbar max-md:p-3"
          ref={modalRef}
        >
          <div className="flex justify-center">
            <ul className="steps pb-2">
              {STEPS.map((step, index) => (
                <li
                  key={index}
                  className={`cursor-pointer step ${
                    stepIndex >= index ? "step-primary" : ""
                  } text-xs`}
                  onClick={() => setStep(step)}
                >
                  {step.shortTitle}
                </li>
              ))}
            </ul>
          </div>
          <h3 className="font-bold text-lg max-md:text-base text-center">
            {stepIndex + 1}. {step.title}
          </h3>
          <p className="py-3 max-md:py-2 max-md:text-sm">
            {STEPS[stepIndex]?.description}
          </p>
          <div className="min-h-[430px] flex items-center">
            {isVideoLoading && (
              <button className="btn btn-circle btn-ghost loading btn-lg w-full" />
            )}
            <video
              className={`w-full h-full ${isVideoLoading ? "hidden" : ""}`}
              autoPlay
              loop
              muted
              playsInline
              src={step.video}
              ref={videoRef}
            />
          </div>
          <div className="flex justify-center pt-3 max-md:pt-2">
            <button className="btn btn-primary" onClick={setNextStep}>
              {stepIndex === STEPS.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorialModal;
