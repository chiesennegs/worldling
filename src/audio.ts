/** Replace or compose providers as curated audio assets are added. */
export interface AudioRequest {
  text: string;
  language: string;
  dialect?: string;
  rate?: number;
  asset?: string;
}
export interface AudioProvider {
  play(request: AudioRequest): Promise<string | undefined>;
  stop(): void;
}
const locale: Record<string, string> = {
  ara: "ar-SA",
  ell: "el-GR",
  eng: "en-US",
  heb: "he-IL",
  jpn: "ja-JP",
  hin: "hi-IN",
  zho: "zh-CN",
};
export class BrowserSpeechProvider implements AudioProvider {
  async play({ text, language, rate = 1 }: AudioRequest) {
    if (!("speechSynthesis" in window))
      return "Audio is unavailable in this browser.";
    const code = locale[language] || language;
    const voice = speechSynthesis
      .getVoices()
      .find((v) => v.localService && v.lang.startsWith(code.split("-")[0]));
    if (!voice)
      return "No offline voice is installed for this language. Add a system voice to hear it.";
    this.stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = code;
    utterance.voice = voice;
    utterance.rate = rate;
    speechSynthesis.speak(utterance);
  }
  stop() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }
}
export class RecordedAudioProvider implements AudioProvider {
  private audio?: HTMLAudioElement;
  async play({ asset, rate = 1 }: AudioRequest) {
    if (!asset) return "No recorded audio is available.";
    this.stop();
    this.audio = new Audio(asset);
    this.audio.playbackRate = rate;
    try {
      await this.audio.play();
    } catch {
      return "This recording could not be played.";
    }
  }
  stop() {
    this.audio?.pause();
    this.audio = undefined;
  }
}
export const audioProvider: AudioProvider = new BrowserSpeechProvider();
