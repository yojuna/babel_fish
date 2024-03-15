import { AudioManager } from "./components/AudioManager";
import Transcript from "./components/Transcript";
import { useTranscriber } from "./hooks/useTranscriber";
import logo from './assets/babelfish.jpg';

function App() {
    const transcriber = useTranscriber();

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='container flex flex-col justify-center items-center'>
                <h1 className='text-5xl font-extrabold tracking-tight text-white sm:text-7xl text-center'>
                    Babel Fish
                </h1>
                <h2 className='mt-3 mb-5 px-4 text-center text-1xl font-semibold tracking-tight text-white sm:text-2xl'>
                    real time language translation running locally
                </h2>
                <img src={logo} alt="Babel Fish Description - Hitchhiker's Guide To The Galaxy"></img>
                <br/>
                <AudioManager transcriber={transcriber} />
                <Transcript transcribedData={transcriber.output} />
            </div>

            <div className='absolute bottom-4'>
                Made with{" "}
                <a
                    className='underline'
                    href='https://github.com/xenova/transformers.js'
                >
                    🤗 Transformers.js
                </a>
            </div>
        </div>
    );
}

export default App;
