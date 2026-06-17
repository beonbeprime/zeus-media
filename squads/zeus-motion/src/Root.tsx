import React from "react";
import { Composition } from "remotion";
import { VideoMixer } from "./compositions/VideoMixer";
import { TextReveal } from "./compositions/TextReveal";
import { DeviceDemo } from "./compositions/DeviceDemo";
import { SquadPromo } from "./compositions/SquadPromo";
import { ProblemSolution } from "./compositions/ProblemSolution";
import { DataStory } from "./compositions/DataStory";
import { PriceReveal } from "./compositions/PriceReveal";
import { ArrowExplainer } from "./compositions/ArrowExplainer";
import { AiDemo } from "./compositions/AiDemo";
import { CheckoutDemo } from "./compositions/CheckoutDemo";
import { AgenteArquiteto } from "./compositions/AgenteArquiteto";
import { MagnaCaptura } from "./compositions/MagnaCaptura";
import { MentoriaPitch } from "./compositions/MentoriaPitch";
import { AgenteArquitetoV2 } from "./compositions/AgenteArquitetoV2";
import { MentoriaEstrutura21Dias, TOTAL_FRAMES_NARR as TotalMentoriaEstrutura21 } from "./compositions/MentoriaEstrutura21Dias";
import { Ads007 } from "./compositions/Ads007";
import { MagnaUltraPremium, TOTAL_FRAMES as TotalMagnaUltraPremium } from "./compositions/MagnaUltraPremium";
import { MaquinaMentoria, TOTAL_FRAMES_MM as TotalMaquinaMentoria } from "./compositions/MaquinaMentoria";
import { MaquinaNeoanalogiaca } from "./compositions/MaquinaNeoanalogiaca";
import { MaquinaNeoanalogiaca2 } from "./compositions/MaquinaNeoanalogiaca2";
import { Conhecimento } from "./compositions/Conhecimento";
import { ConhecimentoBrian, TOTAL_FRAMES as TotalConhecimentoBrian } from "./compositions/ConhecimentoBrian";
import { MagnaMotion, TOTAL_FRAMES_MAGNA as TotalMagnaMotion } from "./compositions/MagnaMotion";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Mixer de vídeo + música — Full HD 1920x1080 */}
      <Composition
        id="VideoMixer"
        component={VideoMixer}
        durationInFrames={159}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Video de marketing do squad — PRINCIPAL */}
      <Composition
        id="SquadPromo"
        component={SquadPromo}
        durationInFrames={640}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "zeus" }}
      />
      <Composition
        id="SquadPromoMagna"
        component={SquadPromo}
        durationInFrames={640}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "magna" }}
      />

      {/* Compositions de uso geral */}
      <Composition
        id="TextReveal"
        component={TextReveal}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ brand: "universal-default", text: "Exemplo de texto", effect: "blur" }}
      />
      <Composition
        id="DeviceDemo"
        component={DeviceDemo}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ brand: "universal-default", device: "iphone", title: "Meu App" }}
      />
      <Composition
        id="ProblemSolution"
        component={ProblemSolution}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ brand: "universal-default", problem: "O problema", solution: "A solucao" }}
      />
      <Composition
        id="DataStory"
        component={DataStory}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ brand: "universal-default", title: "Resultados" }}
      />
      <Composition
        id="PriceReveal"
        component={PriceReveal}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ brand: "universal-default", price: 97, originalPrice: 297 }}
      />
      <Composition
        id="ArrowExplainer"
        component={ArrowExplainer}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ brand: "universal-default", title: "Como funciona" }}
      />
      <Composition
        id="AiDemo"
        component={AiDemo}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ brand: "universal-default" }}
      />
      <Composition
        id="CheckoutDemo"
        component={CheckoutDemo}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ brand: "universal-default", productName: "Meu Produto", price: 97 }}
      />

      {/* Compositions Premium — Diretor Brabo */}
      <Composition
        id="AgenteArquiteto"
        component={AgenteArquiteto}
        durationInFrames={1387}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Captação de leads — Mentoria Magna */}
      <Composition
        id="MagnaCaptura"
        component={MagnaCaptura}
        durationInFrames={1357}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Pitch de mentoria — Apple Minimalist Kinetic (Reels portrait) */}
      <Composition
        id="MentoriaPitch"
        component={MentoriaPitch}
        durationInFrames={1620}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Agente Arquiteto V2 — Brabo Edition (Diretor Brabo briefing) */}
      <Composition
        id="AgenteArquitetoV2"
        component={AgenteArquitetoV2}
        durationInFrames={1350}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Estrutura Absoluta 21 Dias — Dark Luxury Tech Premium */}
      {/* Timing: narr-timing.ts (sobrescrito por narr-sync.py apos narracao real) */}
      <Composition
        id="MentoriaEstrutura21Dias"
        component={MentoriaEstrutura21Dias}
        durationInFrames={TotalMentoriaEstrutura21}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ADS 007 — Magna Ultra Premium | Monochrome Dark Luxury + Laser Red */}
      {/* Timing estimado (recalcular após silencedetect da narração) */}
      <Composition
        id="Ads007"
        component={Ads007}
        durationInFrames={1350}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Magna Ultra Premium — Nível 5 de Consciência | Dark Luxury Tech Premium */}
      {/* 7 cenas, 1350 frames, 45s @ 30fps | Acento: #FF001E */}
      <Composition
        id="MagnaUltraPremium"
        component={MagnaUltraPremium}
        durationInFrames={TotalMagnaUltraPremium}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* A MÁQUINA FOI ATIVADA — Vintage Premium Anos 80 | 31 cenas | 960f | 32s */}
      {/* Paleta: BG_DARK #07080D + GOLD #C99A3A + CYAN #00C2FF + MAGENTA #D81B60 */}
      <Composition
        id="MaquinaMentoria"
        component={MaquinaMentoria}
        durationInFrames={TotalMaquinaMentoria}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Máquina Neo-Analógica — Brutalismo Funcional | 8 cenas | 1713f | 57.1s */}
      {/* Paleta: BG #050505 + WHITE #F2F2F2 + ACID #D6FF00 | Narrador: verde narrador.mp3 */}
      <Composition
        id="MaquinaNeoanalogiaca"
        component={MaquinaNeoanalogiaca}
        durationInFrames={1713}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Máquina Neo-Analógica 2 — Versão Rosa | 8 cenas | 1785f | 59.5s */}
      {/* Paleta: BG #050505 + WHITE #F2F2F2 + ROSE1 #FF2D78 + ROSE2 #FF85B3 */}
      <Composition
        id="MaquinaNeoanalogiaca2"
        component={MaquinaNeoanalogiaca2}
        durationInFrames={1785}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* CONHECIMENTO — Vintage Premium Sepia Quente | 10 cenas | 1202f | 40.07s */}
      {/* Paleta: PAPER #F2E2C0 + SEPIA #C4A46B + RUST #9B3A1E + GOLD #B8941A */}
      {/* Narrador: conhecimento.mp3 (38.38s, 83 palavras, whisper-synced) */}
      <Composition
        id="Conhecimento"
        component={Conhecimento}
        durationInFrames={1202}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* CONHECIMENTO BRIAN — Navy Arquiteto | 6 cenas | 843f | 28.1s */}
      {/* Narrador: Brian (ElevenLabs) — conhecimento-brian.mp3 (26.44s) */}
      {/* Script direto ao ponto: estrutura completa, deliverables, 100 mil, vendedor pronto, CTA */}
      <Composition
        id="ConhecimentoBrian"
        component={ConhecimentoBrian}
        durationInFrames={TotalConhecimentoBrian}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* MAGNA MOTION — Padrão visual das apresentações Magna (rosegold) */}
      {/* Texto sincronizado palavra a palavra com narração (word-level whisper) */}
      {/* Timing: data/narration.json (transcribe-words.py) + data/scenes.ts (manual) */}
      <Composition
        id="MagnaMotion"
        component={MagnaMotion}
        durationInFrames={TotalMagnaMotion}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
