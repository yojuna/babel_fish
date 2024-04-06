import { create } from 'zustand';

// type TranslatedText {
//     text: string 
// }

type State = {
    text: string
  }
  
  type Action = {
    updateText: (text: State['text']) => void
  }
  
export const useTranslatedStore = create<State & Action>((set) => ({
    text: '',
    updateText: (text) => set(() => ({ text: text }))
  }))
  