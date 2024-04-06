import { useEffect, useRef, useState } from 'react'
import LanguageSelector from './LanguageSelector';
import Progress from './ProgressTranslation';
import { processTranscribedText } from '../utils/ProcessTranscribedText';
// import { TranscriberData } from "../hooks/useTranscriber";
import '../css/translationComp.css'

const TRANSLATION_WORKER_PATH = "../workers/translationWorker.js"
const TTS_WORKER_PATH = "../workers/ttsWorker.js"

function SpeechSynthesisManager({ translatedData }) {
  // Model loading
  const [ready, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [input, setInput] = useState('lets translate this spoken speech to the target language');
  const [translatedInput, setTranlatedInput] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
  const [targetLanguage, setTargetLanguage] = useState('deu_Latn');
  const [output, setOutput] = useState('');
  const [audioReady, setAudioReady] = useState(null);

  // Create a reference to the worker object.
  const workerTTS = useRef(null);

  // pass the transcribed input as the input for the translation module
  useEffect(() => {
    setTranlatedInput(translatedData)
  }, [translatedData]);

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {

    if (!workerTTS.current) {
      // Create the worker if it does not yet exist.
      workerTTS.current = new Worker(new URL(TTS_WORKER_PATH, import.meta.url), {
        type: 'module'
      });
    }

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

        // case 'update':
        //   // Generation update: update the output text.
        //   setOutput(e.data.output);
          
        //   break;

        case 'complete':
          // Generation complete: re-enable the "Translate" button
          setDisabled(false);
          processWav(e.data.output)
          break;
      }
    };

    // Attach the callback function as an event listener.
    workerTTS.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => workerTTS.current.removeEventListener('message', onMessageReceived);
  });

//   const translate = () => {
//     setDisabled(true);
//     worker.current.postMessage({
//       text: input,
//       src_lang: sourceLanguage,
//       tgt_lang: targetLanguage,
//     });
//   }

  const SynthesizeTranslatedInput = () => {
    setDisabled(true);
    console.log('wiorker:', workerTTS)
    console.log("starting speech synthesis. passed message body: ", translatedInput)
    workerTTS.current.postMessage({
      text: translatedInput
    });
  }

  function processWav(wav) {
    console.log('provess wav', wav)
    const wavFilePath = wav.toDataURI()
    fs.writeFileSync(wavFilePath, wav.toBuffer());
    console.log(wav)
    setAudioReady(wavFilePath)
  }

  return (
    <>
      <div className='container'>

        <div className='textbox-container'>
          {/* <textarea value={input} rows={3} onChange={e => setInput(e.target.value)}></textarea> */}
          <textarea value={translatedInput} rows={3} onChange={e => setTranlatedInput(e.target.value)}></textarea>
          {/* <textarea value={output} rows={3} readOnly></textarea> */}
          {audioReady && (<audio controls src={audioReady}></audio>)}
        </div>
      </div>

      <button disabled={disabled} onClick={SynthesizeTranslatedInput}>Synthesize Speech</button>

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

export default SpeechSynthesisManager;
