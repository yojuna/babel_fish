import { useEffect, useRef, useState } from 'react'
import LanguageSelector from './LanguageSelector';
import Progress from './ProgressTranslation';
import { processTranscribedText } from '../utils/ProcessTranscribedText';
// import { TranscriberData } from "../hooks/useTranscriber";
import '../css/translationComp.css'
import SpeechSynthesisManager from './SpeechSynthesisManager';
import { useTranslatedStore } from '../store/translatedStore';


const TRANSLATION_WORKER_PATH = "../workers/translationWorker.js"
// const TTS_WORKER_PATH = "../workers/ttsWorker.js"

// interface Props {
//   transcribedData: TranscriberData | undefined;
// }

// function TranslationManager({ transcribedData }: Props) {
function TranslationManager({ transcribedData }) {
  // Model loading
  const [ready, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [input, setInput] = useState('lets translate this spoken speech to the target language');
  const [transcribedInput, setTranscribedInput] = useState('waiting for transcription output');
  const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
  const [targetLanguage, setTargetLanguage] = useState('deu_Latn');
  const [output, setOutput] = useState('');
  // const [speechInput, setSpeechInput] = useState('');
  // const { text, setText } = useTranslatedStore() 
  const translatedText = useTranslatedStore((state) => state.text)
  const updateTranslatedText = useTranslatedStore((state) => state.updateText)


  // Create a reference to the worker object.
  const worker = useRef(null);
  // const workerTTS = useRef(null);

  // pass the transcribed input as the input for the translation module
  useEffect(() => {
    setTranscribedInput(processTranscribedText(transcribedData))
  }, [transcribedData]);

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL(TRANSLATION_WORKER_PATH, import.meta.url), {
        type: 'module'
      });
    }

    // if (!workerTTS.current) {
    //   // Create the worker if it does not yet exist.
    //   workerTTS.current = new Worker(new URL(TTS_WORKER_PATH, import.meta.url), {
    //     type: 'module'
    //   });
    // }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case 'initiate':
          // Model file start load: add a new progress item to the list.
          setReady(false);
          setProgressItems(prev => [...prev, e.data]);
          break;

        case 'progress':
          // Model file progress: update one of the progress items.
          setProgressItems(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress }
              }
              return item;
            })
          );
          break;

        case 'done':
          // Model file loaded: remove the progress item from the list.
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file)
          );
          break;

        case 'ready':
          // Pipeline ready: the worker is ready to accept messages.
          setReady(true);
          break;

        case 'update':
          // Generation update: update the output text.
          setOutput(e.data.output);
          // zustand store useTranslatedStore.ts for storing translated text
          // to make it available to other component - SpeechSynthesisManager in App.tsx
          updateTranslatedText(e.data.output)
          // setSpeechInput(e.data.output)
          break;

        case 'complete':
          // Generation complete: re-enable the "Translate" button
          setDisabled(false);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });

//   const translate = () => {
//     setDisabled(true);
//     worker.current.postMessage({
//       text: input,
//       src_lang: sourceLanguage,
//       tgt_lang: targetLanguage,
//     });
//   }

  const translateTranscribedInput = () => {
    setDisabled(true);
    console.log("starting translation. passed message body: ", transcribedInput)
    worker.current.postMessage({
      text: transcribedInput,
      src_lang: sourceLanguage,
      tgt_lang: targetLanguage,
    });
  }

  return (
    <>
      <div className='container'>
        <div className='language-container'>
          <LanguageSelector type={"Source"} defaultLanguage={"eng_Latn"} onChange={x => setSourceLanguage(x.target.value)} />
          <LanguageSelector type={"Target"} defaultLanguage={"deu_Latn"} onChange={x => setTargetLanguage(x.target.value)} />
        </div>

        <div className='textbox-container'>
          {/* <textarea value={input} rows={3} onChange={e => setInput(e.target.value)}></textarea> */}
          <textarea value={transcribedInput} rows={3} onChange={e => setTranscribedInput(e.target.value)}></textarea>
          <textarea value={output} rows={3} readOnly></textarea>
        </div>
      </div>

      <button disabled={disabled} onClick={translateTranscribedInput}>Translate</button>

      {/* <SpeechSynthesisManager translatedData={output} /> */}

      <div className='progress-bars-container'>
        {ready === false && (
          <label>Loading models... (only run once)</label>
        )}
        {progressItems.map(data => (
          <div key={data.file}>
            <Progress text={data.file} percentage={data.progress} />
          </div>
        ))}
      </div>
    </>
  )
}

export default TranslationManager;
