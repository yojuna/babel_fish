import { AudioManager } from "./components/AudioManager";
import Transcript from "./components/Transcript";
import { useTranscriber } from "./hooks/useTranscriber";
import TranslationManager from "./components/TranslationManager"
import { useTranslatedStore } from "./store/translatedStore";
import SpeechSynthesisManager from "./components/SpeechSynthesisManager";

function App() {
    const transcriber = useTranscriber();
    // const { text } = useTranslatedStore()
    const translatedText = useTranslatedStore((state) => state.text);

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='container flex flex-col justify-center items-center'>
                <h1 className='text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl text-center'>
                    BabelFish
                </h1>
                <h2 className='mt-3 mb-5 px-4 text-center text-1xl font-semibold tracking-tight text-slate-900 sm:text-2xl'>
                    On-device ML-powered speech to speech translation.
                </h2>
                {/* <h2 className='mt-3 mb-5 px-4 text-center text-1xl font-semibold tracking-tight text-slate-900 sm:text-2xl'>
                    Running locally in your browser.
                </h2> */}
                <AudioManager transcriber={transcriber} />
                <Transcript transcribedData={transcriber.output} />
                <TranslationManager transcribedData={transcriber.output} />
                <SpeechSynthesisManager translatedData={translatedText} />
                
            </div>
        </div>
    );
}

export default App;
