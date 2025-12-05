<template>
  <div class="comic-container">
    <div class="comic-burst burst-1"></div>
    <div class="comic-burst burst-2"></div>
    <div class="comic-burst burst-3"></div>

    <div class="halftone-overlay"></div>

    <div class="speed-lines"></div>

    <div class="main-character">
      <div class="character-head">
        <div class="eye eye-left">
          <div class="pupil"></div>
        </div>
        <div class="eye eye-right">
          <div class="pupil"></div>
        </div>
        <div class="mouth"></div>
        <div class="hair"></div>
      </div>
      <div class="character-body"></div>
      <div class="energy-aura"></div>
    </div>

    <div class="speech-bubble bubble-1">
      <div class="bubble-text">POW!</div>
      <div class="bubble-tail"></div>
    </div>

    <div class="speech-bubble bubble-2">
      <div class="bubble-text">BOOM!</div>
      <div class="bubble-tail"></div>
    </div>

    <div class="speech-bubble bubble-3">
      <div class="bubble-text">ZAP!</div>
      <div class="bubble-tail"></div>
    </div>

    <div class="sound-effect effect-1">KAPOW!</div>
    <div class="sound-effect effect-2">WHAM!</div>
    <div class="sound-effect effect-3">BAM!</div>

    <div class="geometric-pattern pattern-1"></div>
    <div class="geometric-pattern pattern-2"></div>
    <div class="geometric-pattern pattern-3"></div>

    <div class="star-burst star-1">★</div>
    <div class="star-burst star-2">★</div>
    <div class="star-burst star-3">★</div>
    <div class="star-burst star-4">★</div>
    <div class="star-burst star-5">★</div>

    <div class="lightning-bolt bolt-1"></div>
    <div class="lightning-bolt bolt-2"></div>

    <div class="comic-dots dots-1"></div>
    <div class="comic-dots dots-2"></div>
    <div class="comic-dots dots-3"></div>

    <div class="neon-circle circle-1"></div>
    <div class="neon-circle circle-2"></div>
    <div class="neon-circle circle-3"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const pupils = document.querySelectorAll('.pupil')

  document.addEventListener('mousemove', (e) => {
    pupils.forEach(pupil => {
      const eye = pupil.parentElement
      if (eye) {
        const rect = eye.getBoundingClientRect()
        const eyeX = rect.left + rect.width / 2
        const eyeY = rect.top + rect.height / 2

        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX)
        const distance = Math.min(15, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 20)

        const pupilX = Math.cos(angle) * distance
        const pupilY = Math.sin(angle) * distance

        ;(pupil as HTMLElement).style.transform = `translate(${pupilX}px, ${pupilY}px)`
      }
    })
  })
})
</script>

<style scoped>
.comic-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(45deg, #FF006E 0%, #8338EC 25%, #3A86FF 50%, #06FFA5 75%, #FFBE0B 100%);
  animation: backgroundShift 10s ease-in-out infinite alternate;
}

@keyframes backgroundShift {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.comic-burst {
  position: absolute;
  border-radius: 50%;
  animation: pulseBurst 3s ease-in-out infinite;
}

.burst-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  background: radial-gradient(circle, #FF006E 0%, transparent 70%);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  filter: drop-shadow(0 0 30px #FF006E);
}

.burst-2 {
  width: 350px;
  height: 350px;
  bottom: -80px;
  left: -80px;
  background: radial-gradient(circle, #06FFA5 0%, transparent 70%);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  filter: drop-shadow(0 0 30px #06FFA5);
  animation-delay: 1s;
}

.burst-3 {
  width: 300px;
  height: 300px;
  top: 30%;
  right: 10%;
  background: radial-gradient(circle, #FFBE0B 0%, transparent 70%);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  filter: drop-shadow(0 0 30px #FFBE0B);
  animation-delay: 2s;
}

@keyframes pulseBurst {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.15) rotate(10deg);
    opacity: 0.9;
  }
}

.halftone-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle, rgba(0,0,0,0.3) 2px, transparent 2px);
  background-size: 20px 20px;
  opacity: 0.3;
  pointer-events: none;
  animation: halftoneScroll 20s linear infinite;
}

@keyframes halftoneScroll {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100px 100px;
  }
}

.speed-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    120deg,
    transparent,
    transparent 50px,
    rgba(255, 255, 255, 0.15) 50px,
    rgba(255, 255, 255, 0.15) 55px
  );
  animation: speedLineMove 1.5s linear infinite;
  pointer-events: none;
}

@keyframes speedLineMove {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(100px);
  }
}

.main-character {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  animation: characterBounce 2s ease-in-out infinite;
}

@keyframes characterBounce {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0px) rotate(-2deg);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-20px) rotate(2deg);
  }
}

.character-head {
  position: relative;
  width: 180px;
  height: 200px;
  background: linear-gradient(135deg, #FFD60A 0%, #FFA500 100%);
  border-radius: 50% 50% 45% 45%;
  border: 6px solid #000;
  box-shadow:
    inset -20px -20px 30px rgba(0,0,0,0.2),
    0 10px 0 #000,
    0 15px 30px rgba(0,0,0,0.5);
}

.eye {
  position: absolute;
  width: 50px;
  height: 60px;
  background: white;
  border: 5px solid #000;
  border-radius: 50% 50% 50% 50%;
  top: 60px;
  overflow: hidden;
}

.eye-left {
  left: 25px;
  transform: rotate(-10deg);
}

.eye-right {
  right: 25px;
  transform: rotate(10deg);
}

.pupil {
  position: absolute;
  width: 25px;
  height: 25px;
  background: #000;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease;
}

.pupil::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  top: 5px;
  right: 5px;
}

.mouth {
  position: absolute;
  width: 80px;
  height: 50px;
  border: 5px solid #000;
  border-top: none;
  border-radius: 0 0 60px 60px;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(to bottom, #FF006E 0%, #FF3366 100%);
  box-shadow: inset 0 -10px 20px rgba(0,0,0,0.3);
}

.mouth::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 25px;
  background: #FFF;
  border-radius: 50%;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.hair {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 80px;
  background: linear-gradient(135deg, #8338EC 0%, #5A189A 100%);
  border: 5px solid #000;
  border-radius: 50% 50% 20% 20%;
  clip-path: polygon(
    0% 50%, 10% 30%, 20% 40%, 30% 20%, 40% 35%,
    50% 0%, 60% 35%, 70% 20%, 80% 40%, 90% 30%, 100% 50%, 100% 100%, 0% 100%
  );
}

.character-body {
  position: relative;
  width: 150px;
  height: 140px;
  background: linear-gradient(135deg, #3A86FF 0%, #0466C8 100%);
  border: 6px solid #000;
  border-radius: 20px 20px 40px 40px;
  margin: -10px auto 0;
  box-shadow:
    inset -15px -15px 25px rgba(0,0,0,0.2),
    0 10px 30px rgba(0,0,0,0.5);
}

.character-body::before {
  content: '⚡';
  position: absolute;
  font-size: 60px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: symbolRotate 3s linear infinite;
}

@keyframes symbolRotate {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    filter: drop-shadow(0 0 10px #FFBE0B);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    filter: drop-shadow(0 0 20px #FFBE0B);
  }
}

.energy-aura {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(6, 255, 165, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: auraGlow 2s ease-in-out infinite;
  z-index: -1;
}

@keyframes auraGlow {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
}

.speech-bubble {
  position: absolute;
  background: white;
  border: 5px solid #000;
  border-radius: 30px;
  padding: 20px 35px;
  box-shadow:
    5px 5px 0 #000,
    0 10px 30px rgba(0,0,0,0.4);
  animation: bubbleFloat 3s ease-in-out infinite;
  z-index: 15;
}

.bubble-1 {
  top: 15%;
  left: 10%;
  background: linear-gradient(135deg, #FF006E 0%, #FF3366 100%);
  animation-delay: 0s;
}

.bubble-2 {
  top: 20%;
  right: 12%;
  background: linear-gradient(135deg, #06FFA5 0%, #00E676 100%);
  animation-delay: 1s;
}

.bubble-3 {
  bottom: 15%;
  left: 15%;
  background: linear-gradient(135deg, #FFBE0B 0%, #FF9F1C 100%);
  animation-delay: 2s;
}

@keyframes bubbleFloat {
  0%, 100% {
    transform: translateY(0px) rotate(-3deg);
  }
  50% {
    transform: translateY(-15px) rotate(3deg);
  }
}

.bubble-text {
  font-family: 'Arial Black', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: white;
  text-shadow:
    3px 3px 0 #000,
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000;
  letter-spacing: 2px;
}

.bubble-tail {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 30px solid white;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
}

.bubble-tail::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 30px solid #000;
  bottom: -5px;
  left: -20px;
}

.sound-effect {
  position: absolute;
  font-family: 'Impact', 'Arial Black', sans-serif;
  font-size: 80px;
  font-weight: 900;
  color: white;
  text-shadow:
    5px 5px 0 #000,
    -2px -2px 0 #000,
    2px -2px 0 #000,
    -2px 2px 0 #000,
    0 0 30px rgba(255, 255, 255, 0.8);
  letter-spacing: 5px;
  animation: effectPulse 2s ease-in-out infinite;
  z-index: 20;
  transform: rotate(-15deg);
}

.effect-1 {
  top: 35%;
  right: 5%;
  color: #FF006E;
  animation-delay: 0s;
}

.effect-2 {
  bottom: 30%;
  right: 8%;
  color: #3A86FF;
  animation-delay: 0.7s;
  font-size: 70px;
}

.effect-3 {
  top: 45%;
  left: 8%;
  color: #FFBE0B;
  animation-delay: 1.4s;
  font-size: 75px;
}

@keyframes effectPulse {
  0%, 100% {
    transform: scale(1) rotate(-15deg);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.1) rotate(-18deg);
    opacity: 1;
  }
}

.geometric-pattern {
  position: absolute;
  border: 5px solid #000;
  animation: patternRotate 8s linear infinite;
}

.pattern-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 35%;
  background: linear-gradient(45deg, #FF006E 0%, #8338EC 100%);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  filter: drop-shadow(0 5px 15px rgba(255, 0, 110, 0.5));
}

.pattern-2 {
  width: 120px;
  height: 120px;
  bottom: 20%;
  right: 20%;
  background: linear-gradient(45deg, #06FFA5 0%, #3A86FF 100%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  filter: drop-shadow(0 5px 15px rgba(6, 255, 165, 0.5));
  animation-delay: 2s;
}

.pattern-3 {
  width: 90px;
  height: 90px;
  top: 60%;
  left: 25%;
  background: linear-gradient(45deg, #FFBE0B 0%, #FF006E 100%);
  clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%);
  filter: drop-shadow(0 5px 15px rgba(255, 190, 11, 0.5));
  animation-delay: 4s;
}

@keyframes patternRotate {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.star-burst {
  position: absolute;
  font-size: 60px;
  color: white;
  text-shadow:
    0 0 20px currentColor,
    3px 3px 0 #000,
    -1px -1px 0 #000;
  animation: starTwinkle 2s ease-in-out infinite;
  z-index: 5;
}

.star-1 {
  top: 25%;
  left: 25%;
  color: #FF006E;
}

.star-2 {
  top: 15%;
  right: 30%;
  color: #06FFA5;
  animation-delay: 0.4s;
}

.star-3 {
  bottom: 25%;
  left: 40%;
  color: #FFBE0B;
  animation-delay: 0.8s;
}

.star-4 {
  bottom: 35%;
  right: 15%;
  color: #8338EC;
  animation-delay: 1.2s;
}

.star-5 {
  top: 40%;
  right: 40%;
  color: #3A86FF;
  animation-delay: 1.6s;
  font-size: 50px;
}

@keyframes starTwinkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.3) rotate(72deg);
    opacity: 1;
  }
}

.lightning-bolt {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-top: 80px solid #FFBE0B;
  filter: drop-shadow(0 0 20px #FFBE0B) drop-shadow(3px 3px 0 #000);
  animation: boltStrike 1.5s ease-in-out infinite;
  z-index: 8;
}

.lightning-bolt::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 80px solid #FFBE0B;
  top: 80px;
  left: -25px;
}

.bolt-1 {
  top: 30%;
  left: 60%;
  transform: rotate(20deg);
}

.bolt-2 {
  bottom: 25%;
  right: 35%;
  transform: rotate(-25deg);
  animation-delay: 0.75s;
}

@keyframes boltStrike {
  0%, 90%, 100% {
    opacity: 0;
  }
  91%, 95% {
    opacity: 1;
    transform: scale(1.2);
  }
  93% {
    opacity: 0.3;
  }
}

.comic-dots {
  position: absolute;
  width: 150px;
  height: 150px;
  background-image: radial-gradient(circle, #000 3px, transparent 3px);
  background-size: 15px 15px;
  opacity: 0.4;
  animation: dotsFloat 6s ease-in-out infinite;
}

.dots-1 {
  top: 20%;
  right: 5%;
  background-color: rgba(255, 0, 110, 0.2);
}

.dots-2 {
  bottom: 15%;
  left: 10%;
  background-color: rgba(58, 134, 255, 0.2);
  animation-delay: 2s;
}

.dots-3 {
  top: 55%;
  right: 25%;
  background-color: rgba(6, 255, 165, 0.2);
  animation-delay: 4s;
}

@keyframes dotsFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(10deg);
  }
}

.neon-circle {
  position: absolute;
  border-radius: 50%;
  border: 6px solid;
  animation: neonPulse 3s ease-in-out infinite;
  z-index: 3;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 5%;
  left: 5%;
  border-color: #FF006E;
  box-shadow:
    0 0 30px #FF006E,
    inset 0 0 30px rgba(255, 0, 110, 0.3);
}

.circle-2 {
  width: 250px;
  height: 250px;
  bottom: 5%;
  right: 5%;
  border-color: #06FFA5;
  box-shadow:
    0 0 30px #06FFA5,
    inset 0 0 30px rgba(6, 255, 165, 0.3);
  animation-delay: 1s;
}

.circle-3 {
  width: 180px;
  height: 180px;
  top: 50%;
  left: 10%;
  border-color: #3A86FF;
  box-shadow:
    0 0 30px #3A86FF,
    inset 0 0 30px rgba(58, 134, 255, 0.3);
  animation-delay: 2s;
}

@keyframes neonPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
    border-width: 6px;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
    border-width: 8px;
  }
}

@media (max-width: 768px) {
  .main-character {
    transform: translate(-50%, -50%) scale(0.8);
  }

  .sound-effect {
    font-size: 50px;
  }

  .speech-bubble {
    padding: 15px 25px;
  }

  .bubble-text {
    font-size: 24px;
  }

  .geometric-pattern {
    width: 60px !important;
    height: 60px !important;
  }

  .star-burst {
    font-size: 40px;
  }

  .neon-circle {
    width: 120px !important;
    height: 120px !important;
  }
}
</style>
