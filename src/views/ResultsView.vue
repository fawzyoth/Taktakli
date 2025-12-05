<template>
  <div class="results-container" ref="containerRef">
    <button
      @click="toggleFullscreen"
      class="fullscreen-button"
      :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
    >
      <MaximizeIcon v-if="!isFullscreen" class="w-6 h-6" />
      <MinimizeIcon v-else class="w-6 h-6" />
    </button>

    <button
      @click="resetAnimation"
      class="reset-button"
      title="Restart Animation"
    >
      <RotateCcwIcon class="w-6 h-6" />
    </button>

    <div class="animated-background">
      <div class="floating-particle" v-for="i in 30" :key="i" :style="getParticleStyle(i)"></div>
    </div>

    <div class="logo-container">
      <img src="/Design sans titre.png" alt="Shopa.ovh" class="logo" />
    </div>

    <transition name="fade">
      <div v-if="currentStage < 4" class="announcement-text">
        {{ currentStage === 3 ? 'The winner is' : 'And the winner is...' }}
      </div>
    </transition>

    <div class="podium-container">
      <transition name="slide-up">
        <div
          v-if="currentStage >= 1 && currentStage < 4"
          class="podium-position second-place"
          :class="{ 'fade-away': currentStage === 4 }"
        >
          <div class="crown silver-crown">
            <div class="crown-icon">👑</div>
          </div>
          <div class="avatar-wrapper">
            <div class="avatar-glow silver-glow"></div>
            <div class="avatar" :style="{ background: winners[1].avatarColor }">
              <div class="avatar-text">{{ winners[1].initials }}</div>
            </div>
            <div class="medal-badge silver-medal">
              <span class="medal-number">2</span>
            </div>
          </div>
          <div class="participant-name">{{ winners[1].name }}</div>
        </div>
      </transition>

      <transition name="scale-up">
        <div
          v-if="currentStage >= 2"
          class="podium-position first-place"
          :class="{ 'move-to-left': currentStage === 4 }"
        >
          <div class="crown gold-crown">
            <div class="crown-icon">👑</div>
          </div>
          <div class="avatar-wrapper">
            <div class="avatar-glow gold-glow"></div>
            <div class="avatar" :style="{ background: winners[0].avatarColor }">
              <div class="avatar-text">{{ winners[0].initials }}</div>
            </div>
            <div class="medal-badge gold-medal">
              <span class="medal-number">1</span>
            </div>
          </div>
          <div class="participant-name">{{ winners[0].name }}</div>

          <transition name="fade">
            <div v-if="currentStage === 4" class="engagement-stats">
              <div class="stat-item">
                <HeartIcon class="stat-icon" />
                <span class="stat-value">{{ winners[0].likes.toLocaleString() }}</span>
                <span class="stat-label">Likes</span>
              </div>
              <div class="stat-item">
                <Share2Icon class="stat-icon" />
                <span class="stat-value">{{ winners[0].shares.toLocaleString() }}</span>
                <span class="stat-label">Shares</span>
              </div>
              <div class="stat-item">
                <MessageCircleIcon class="stat-icon" />
                <span class="stat-value">{{ winners[0].comments.toLocaleString() }}</span>
                <span class="stat-label">Comments</span>
              </div>
            </div>
          </transition>
        </div>
      </transition>

      <transition name="slide-up">
        <div
          v-if="currentStage >= 0 && currentStage < 4"
          class="podium-position third-place"
          :class="{ 'fade-away': currentStage === 4 }"
        >
          <div class="crown bronze-crown">
            <div class="crown-icon">👑</div>
          </div>
          <div class="avatar-wrapper">
            <div class="avatar-glow bronze-glow"></div>
            <div class="avatar" :style="{ background: winners[2].avatarColor }">
              <div class="avatar-text">{{ winners[2].initials }}</div>
            </div>
            <div class="medal-badge bronze-medal">
              <span class="medal-number">3</span>
            </div>
          </div>
          <div class="participant-name">{{ winners[2].name }}</div>
        </div>
      </transition>
    </div>

    <transition name="fade">
      <div v-if="currentStage === 4" class="confetti-container">
        <div v-for="i in 50" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Maximize as MaximizeIcon, Minimize as MinimizeIcon, RotateCcw as RotateCcwIcon, Heart as HeartIcon, Share2 as Share2Icon, MessageCircle as MessageCircleIcon } from 'lucide-vue-next'

interface Winner {
  id: number
  name: string
  initials: string
  avatarColor: string
  likes: number
  shares: number
  comments: number
  totalPoints: number
}

const containerRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)
const currentStage = ref(-1)

const winners = ref<Winner[]>([
  {
    id: 1,
    name: 'Sarah Martinez',
    initials: 'SM',
    avatarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    likes: 15420,
    shares: 3240,
    comments: 8960,
    totalPoints: 150
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    initials: 'AH',
    avatarColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    likes: 12350,
    shares: 2890,
    comments: 7120,
    totalPoints: 120
  },
  {
    id: 3,
    name: 'Emily Chen',
    initials: 'EC',
    avatarColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    likes: 9840,
    shares: 2150,
    comments: 5670,
    totalPoints: 95
  }
])

const getParticleStyle = (index: number) => {
  const size = Math.random() * 4 + 2
  const duration = Math.random() * 3 + 2
  const delay = Math.random() * 2
  const left = Math.random() * 100
  const top = Math.random() * 100

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}

const getConfettiStyle = (index: number) => {
  const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F093FB', '#667EEA']
  const size = Math.random() * 10 + 5
  const left = Math.random() * 100
  const delay = Math.random() * 0.5
  const duration = Math.random() * 2 + 2
  const rotation = Math.random() * 360

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    transform: `rotate(${rotation}deg)`
  }
}

let animationTimeout: number | null = null

const startAnimation = () => {
  currentStage.value = 0

  setTimeout(() => {
    currentStage.value = 1
  }, 5000)

  setTimeout(() => {
    currentStage.value = 2
  }, 10000)

  setTimeout(() => {
    currentStage.value = 3
  }, 15000)

  animationTimeout = window.setTimeout(() => {
    currentStage.value = 4
  }, 18000)
}

const resetAnimation = () => {
  if (animationTimeout) {
    clearTimeout(animationTimeout)
  }
  currentStage.value = -1
  setTimeout(() => {
    startAnimation()
  }, 100)
}

const toggleFullscreen = async () => {
  if (!containerRef.value) return

  try {
    if (!isFullscreen.value) {
      const elem = containerRef.value as any

      if (elem.requestFullscreen) {
        await elem.requestFullscreen()
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen()
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen()
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen()
      }

      document.body.classList.add('fullscreen-mode')
    } else {
      const doc = document as any

      if (doc.exitFullscreen) {
        await doc.exitFullscreen()
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen()
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen()
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen()
      }

      document.body.classList.remove('fullscreen-mode')
    }
  } catch (error) {
    console.error('Fullscreen error:', error)
    document.body.classList.toggle('fullscreen-mode')
    isFullscreen.value = !isFullscreen.value
  }
}

const handleFullscreenChange = () => {
  const doc = document as any
  isFullscreen.value = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement)

  if (!isFullscreen.value) {
    document.body.classList.remove('fullscreen-mode')
  }
}

onMounted(() => {
  startAnimation()

  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)
})

onUnmounted(() => {
  if (animationTimeout) {
    clearTimeout(animationTimeout)
  }

  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)

  document.body.classList.remove('fullscreen-mode')
})
</script>

<style scoped>
.results-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.animated-background {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(218, 165, 32, 0.15) 0%, transparent 70%);
  overflow: hidden;
  pointer-events: none;
}

.floating-particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(218, 165, 32, 0.6);
  box-shadow: 0 0 10px rgba(218, 165, 32, 0.8);
  animation: float-particle 3s infinite ease-in-out;
}

@keyframes float-particle {
  0%, 100% { opacity: 0.3; transform: translateY(0) scale(1); }
  50% { opacity: 1; transform: translateY(-20px) scale(1.2); }
}

.fullscreen-button,
.reset-button {
  position: fixed;
  top: 1.5rem;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  color: #1a1a1a;
}

.fullscreen-button {
  right: 1.5rem;
}

.reset-button {
  right: 5rem;
}

.fullscreen-button:hover,
.reset-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 1);
}

.logo-container {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  animation: fadeInDown 1s ease-out;
}

.logo {
  height: 60px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(218, 165, 32, 0.5));
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateX(-50%) translateY(-30px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.announcement-text {
  font-size: 3.5rem;
  font-weight: 900;
  color: #ffffff;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 4px 20px rgba(218, 165, 32, 0.8), 0 0 40px rgba(218, 165, 32, 0.5);
  letter-spacing: 2px;
  z-index: 10;
}

.podium-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3rem;
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
}

.podium-position {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.third-place,
.second-place {
  transform-origin: center bottom;
}

.first-place {
  transform-origin: center center;
}

.first-place.move-to-left {
  animation: moveToLeft 1.5s ease-out forwards;
}

@keyframes moveToLeft {
  to {
    transform: translateX(-400px) scale(1.1);
  }
}

.fade-away {
  animation: fadeOut 1s ease-out forwards;
}

@keyframes fadeOut {
  to {
    opacity: 0;
    transform: scale(0.8);
  }
}

.crown {
  position: absolute;
  top: -40px;
  z-index: 20;
  animation: crownFloat 3s infinite ease-in-out;
}

@keyframes crownFloat {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

.crown-icon {
  font-size: 3rem;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

.gold-crown .crown-icon {
  filter: drop-shadow(0 4px 20px rgba(255, 215, 0, 0.8));
}

.silver-crown .crown-icon {
  filter: drop-shadow(0 4px 15px rgba(192, 192, 192, 0.8)) grayscale(0.3);
}

.bronze-crown .crown-icon {
  filter: drop-shadow(0 4px 15px rgba(205, 127, 50, 0.8)) brightness(0.9);
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.avatar-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulseGlow 2s ease-in-out infinite;
  z-index: -1;
}

.gold-glow {
  background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%);
}

.silver-glow {
  background: radial-gradient(circle, rgba(192, 192, 192, 0.5) 0%, transparent 70%);
}

.bronze-glow {
  background: radial-gradient(circle, rgba(205, 127, 50, 0.5) 0%, transparent 70%);
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 5px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: relative;
}

.first-place .avatar {
  width: 200px;
  height: 200px;
  border-width: 6px;
  border-color: #FFD700;
  box-shadow: 0 12px 48px rgba(255, 215, 0, 0.6);
}

.avatar-text {
  color: white;
  font-size: 3rem;
  font-weight: 900;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.first-place .avatar-text {
  font-size: 4rem;
}

.medal-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.first-place .medal-badge {
  width: 80px;
  height: 80px;
}

.gold-medal {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}

.silver-medal {
  background: linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%);
}

.bronze-medal {
  background: linear-gradient(135deg, #CD7F32 0%, #DDA15E 100%);
}

.medal-number {
  font-size: 2rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.first-place .medal-number {
  font-size: 2.5rem;
}

.participant-name {
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
}

.first-place .participant-name {
  font-size: 2.5rem;
  color: #FFD700;
  text-shadow: 0 4px 16px rgba(255, 215, 0, 0.8);
}

.engagement-stats {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  width: 32px;
  height: 32px;
  color: #FFD700;
  filter: drop-shadow(0 2px 8px rgba(255, 215, 0, 0.6));
}

.stat-value {
  font-size: 2rem;
  font-weight: 900;
  color: #FFD700;
  text-shadow: 0 2px 8px rgba(255, 215, 0, 0.6);
}

.stat-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.confetti-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

.confetti {
  position: absolute;
  top: -10px;
  animation: confettiFall 4s ease-in infinite;
}

@keyframes confettiFall {
  to {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0;
  }
}

.slide-up-enter-active {
  animation: slideUpIn 1s ease-out;
}

@keyframes slideUpIn {
  from {
    opacity: 0;
    transform: translateY(100px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.scale-up-enter-active {
  animation: scaleUpIn 1.2s ease-out;
}

@keyframes scaleUpIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .announcement-text {
    font-size: 2.5rem;
  }

  .podium-container {
    gap: 2rem;
  }

  .avatar {
    width: 120px;
    height: 120px;
  }

  .first-place .avatar {
    width: 160px;
    height: 160px;
  }

  .engagement-stats {
    gap: 1rem;
  }

  .stat-item {
    padding: 1rem 1.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .announcement-text {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .podium-container {
    gap: 1rem;
    flex-direction: row;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  .first-place .avatar {
    width: 120px;
    height: 120px;
  }

  .avatar-text {
    font-size: 2rem;
  }

  .first-place .avatar-text {
    font-size: 3rem;
  }

  .participant-name {
    font-size: 1.2rem;
  }

  .first-place .participant-name {
    font-size: 1.8rem;
  }

  .engagement-stats {
    flex-direction: column;
    gap: 0.75rem;
  }

  .stat-item {
    padding: 0.75rem 1rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .logo {
    height: 40px;
  }

  .crown-icon {
    font-size: 2rem;
  }

  .first-place.move-to-left {
    animation: moveToLeftMobile 1.5s ease-out forwards;
  }

  @keyframes moveToLeftMobile {
    to {
      transform: translateX(-100px) scale(1.05);
    }
  }
}
</style>
