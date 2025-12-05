<template>
  <div class="racing-bar-container" ref="containerRef">
    <button
      @click="toggleFullscreen"
      class="fullscreen-button"
      :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
    >
      <MaximizeIcon v-if="!isFullscreen" class="w-6 h-6" />
      <MinimizeIcon v-else class="w-6 h-6" />
    </button>

    <div class="animated-background">
      <div class="floating-circle" v-for="i in 20" :key="i" :style="getCircleStyle(i)"></div>
    </div>

    <div class="logo-container">
      <img src="/Design sans titre.png" alt="Shopa.ovh" class="logo" />
    </div>

    <div class="engagement-info">
      <div class="info-text">
        <span class="info-icon">⚡</span>
        <strong>Point System:</strong> Comments +2 pts | Likes +1 pt | Shares +3 pts/min
        <span class="pulse-dot"></span>
        Live
      </div>
    </div>

    <div class="leaderboard">
      <div
        v-for="(participant, index) in sortedParticipants"
        :key="participant.id"
        class="participant-row"
        :class="{ 'top-rank': index < 3 }"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="rank-badge" :class="`rank-${index + 1}`">
          <span v-if="index === 0" class="trophy">👑</span>
          <span v-else-if="index === 1" class="trophy">🥈</span>
          <span v-else-if="index === 2" class="trophy">🥉</span>
          <span v-else class="rank-number">{{ index + 1 }}</span>
        </div>

        <div class="participant-name">
          <span class="name-text">{{ participant.name }}</span>
        </div>

        <div class="bar-container">
          <div class="bar-background"></div>
          <div
            class="progress-bar"
            :class="`bar-rank-${index + 1}`"
            :style="{
              width: `${getBarWidth(participant.points)}%`,
              transitionDelay: `${index * 0.1}s`
            }"
          >
            <div class="bar-shine"></div>
            <div class="bar-glow"></div>
            <div class="bar-pattern"></div>
          </div>
          <div
            class="avatar-container"
            :style="{ left: `${getBarWidth(participant.points)}%` }"
          >
            <div class="avatar-glow" :style="{ background: participant.glowColor }"></div>
            <div class="avatar" :style="{ background: participant.avatarColor }">
              <div class="avatar-icon">{{ participant.initials }}</div>
            </div>
          </div>
        </div>

        <div class="points-display" :class="`points-rank-${index + 1}`">
          <span class="points-value">{{ participant.points.toLocaleString() }}</span>
          <span class="points-label">pts</span>
        </div>
      </div>
    </div>

    <div class="footer-text">
      <span class="footer-icon">🎯</span>
      Live Engagement Leaderboard
      <span class="footer-separator">•</span>
      <span class="footer-brand">Shopa.ovh</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Maximize as MaximizeIcon, Minimize as MinimizeIcon } from 'lucide-vue-next'

interface Participant {
  id: number
  name: string
  points: number
  initials: string
  avatarColor: string
  glowColor: string
}

const containerRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

const participants = ref<Participant[]>([
  {
    id: 1,
    name: 'Sarah Martinez',
    points: 150,
    initials: 'SM',
    avatarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    glowColor: 'radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%)'
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    points: 120,
    initials: 'AH',
    avatarColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    glowColor: 'radial-gradient(circle, rgba(240, 147, 251, 0.4) 0%, transparent 70%)'
  },
  {
    id: 3,
    name: 'Emily Chen',
    points: 95,
    initials: 'EC',
    avatarColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    glowColor: 'radial-gradient(circle, rgba(79, 172, 254, 0.4) 0%, transparent 70%)'
  },
  {
    id: 4,
    name: 'Marcus Johnson',
    points: 80,
    initials: 'MJ',
    avatarColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    glowColor: 'radial-gradient(circle, rgba(67, 233, 123, 0.4) 0%, transparent 70%)'
  },
  {
    id: 5,
    name: 'Isabella Romano',
    points: 65,
    initials: 'IR',
    avatarColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    glowColor: 'radial-gradient(circle, rgba(250, 112, 154, 0.4) 0%, transparent 70%)'
  }
])

const maxPoints = computed(() => {
  return Math.max(...participants.value.map(p => p.points), 100)
})

const sortedParticipants = computed(() => {
  return [...participants.value].sort((a, b) => b.points - a.points)
})

const getBarWidth = (points: number): number => {
  return Math.min((points / maxPoints.value) * 80, 80)
}

const getCircleStyle = (index: number) => {
  const size = Math.random() * 100 + 50
  const duration = Math.random() * 20 + 15
  const delay = Math.random() * 5
  const left = Math.random() * 100
  const opacity = Math.random() * 0.15 + 0.05

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    opacity: opacity
  }
}

const simulateRealTimeUpdates = () => {
  const randomParticipant = participants.value[Math.floor(Math.random() * participants.value.length)]
  const pointsToAdd = Math.floor(Math.random() * 5) + 1
  randomParticipant.points += pointsToAdd
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

      try {
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock('landscape').catch(() => {})
        }
      } catch (err) {}

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

      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock()
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

let updateInterval: number | null = null

onMounted(() => {
  updateInterval = window.setInterval(simulateRealTimeUpdates, 3000)

  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }

  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)

  document.body.classList.remove('fullscreen-mode')
})
</script>

<style scoped>
.racing-bar-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #4facfe 60%, #00f2fe 80%, #43e97b 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite, fadeIn 0.6s ease-in;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.racing-bar-container:fullscreen {
  padding: 1.5rem 3rem;
}

.fullscreen-button {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
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

.fullscreen-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 1);
}

.fullscreen-button:active {
  transform: scale(0.95);
}

:global(body.fullscreen-mode) {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
}

:global(body.fullscreen-mode #app) {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

@media (max-width: 768px) {
  .racing-bar-container:fullscreen,
  :global(body.fullscreen-mode) .racing-bar-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding: 0.75rem;
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animated-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
  animation: float 20s infinite ease-in-out;
  bottom: -100px;
}

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
}

.logo-container {
  margin-bottom: 2rem;
  animation: slideDown 0.8s ease-out;
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

@keyframes slideDown {
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.logo {
  height: 80px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.engagement-info {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 1.25rem 2.5rem;
  border-radius: 50px;
  margin-bottom: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.5);
  max-width: 900px;
  width: 100%;
  position: relative;
  z-index: 10;
  animation: slideDown 0.8s ease-out 0.2s backwards;
}

.info-text {
  color: #1a1a1a;
  font-size: 1rem;
  text-align: center;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.info-icon {
  font-size: 1.5rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 2s infinite;
  margin-left: 0.5rem;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.leaderboard {
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 10;
}

.participant-row {
  display: grid;
  grid-template-columns: 80px 250px 1fr 140px;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.5);
  animation: slideInFromLeft 0.6s ease-out forwards;
  opacity: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.participant-row:hover {
  transform: translateX(5px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.25);
}

.participant-row.top-rank {
  border: 3px solid rgba(255, 215, 0, 0.5);
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.3);
}

@keyframes slideInFromLeft {
  from { transform: translateX(-100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.rank-badge {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: rotate3d 3s infinite ease-in-out;
}

.rank-badge.rank-1 {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.6);
  animation: rotate3d 3s infinite ease-in-out, glow 2s infinite;
}

.rank-badge.rank-2 {
  background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%);
  box-shadow: 0 4px 20px rgba(192, 192, 192, 0.6);
}

.rank-badge.rank-3 {
  background: linear-gradient(135deg, #CD7F32 0%, #B8860B 100%);
  box-shadow: 0 4px 20px rgba(205, 127, 50, 0.6);
}

@keyframes rotate3d {
  0%, 100% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 4px 20px rgba(255, 215, 0, 0.6); }
  50% { box-shadow: 0 4px 30px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 215, 0, 0.5); }
}

.trophy {
  font-size: 2rem;
  animation: bounce 2s infinite;
}

.rank-number {
  font-size: 1.5rem;
}

.participant-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: left;
}

.name-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.bar-container {
  position: relative;
  height: 70px;
  width: 100%;
}

.bar-background {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
}

.progress-bar {
  height: 100%;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25), inset 0 -2px 10px rgba(0, 0, 0, 0.2);
}

.bar-rank-1 {
  background: linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

.bar-rank-2 {
  background: linear-gradient(90deg, #C0C0C0 0%, #E8E8E8 50%, #C0C0C0 100%);
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

.bar-rank-3 {
  background: linear-gradient(90deg, #CD7F32 0%, #DDA15E 50%, #CD7F32 100%);
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

.bar-rank-4, .bar-rank-5 {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.bar-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { left: -50%; }
  100% { left: 150%; }
}

.bar-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0.5;
}

.bar-pattern {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 20px
  );
}

.avatar-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: left 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.avatar-glow {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulseGlow 2s ease-in-out infinite;
  z-index: -1;
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 5px solid white;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: avatarBounce 2s ease-in-out infinite;
}

@keyframes avatarBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.avatar-icon {
  color: white;
  font-size: 1.75rem;
  font-weight: 800;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.points-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.points-value {
  font-size: 2.25rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  animation: countUp 0.8s ease-out;
}

.points-rank-1 .points-value {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: countUp 0.8s ease-out, sparkle 2s infinite;
}

@keyframes sparkle {
  0%, 100% { filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)); }
  50% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); }
}

.points-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
}

@keyframes countUp {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.footer-text {
  margin-top: 3rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
}

.footer-icon {
  font-size: 1.5rem;
}

.footer-separator {
  color: #999;
  margin: 0 0.5rem;
}

.footer-brand {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

@media (max-width: 1024px) {
  .participant-row {
    grid-template-columns: 60px 180px 1fr 120px;
    gap: 1rem;
    padding: 0.75rem;
  }

  .rank-badge {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .participant-name {
    font-size: 1.2rem;
  }

  .bar-container {
    height: 60px;
  }

  .avatar {
    width: 70px;
    height: 70px;
    border-width: 4px;
  }

  .avatar-icon {
    font-size: 1.5rem;
  }

  .points-value {
    font-size: 1.75rem;
  }
}

@media (orientation: landscape) and (max-height: 768px) {
  .racing-bar-container {
    padding: 1rem 2rem;
  }

  .logo-container {
    padding: 0.75rem 2rem;
    margin-bottom: 1rem;
  }

  .logo {
    height: 50px;
  }

  .engagement-info {
    padding: 0.75rem 1.5rem;
    margin-bottom: 1.5rem;
  }

  .info-text {
    font-size: 0.85rem;
  }

  .leaderboard {
    gap: 1rem;
  }

  .participant-row {
    padding: 0.75rem;
  }

  .bar-container {
    height: 55px;
  }

  .avatar {
    width: 65px;
    height: 65px;
  }

  .avatar-glow {
    width: 100px;
    height: 100px;
  }

  .fullscreen-button {
    top: 1rem;
    right: 1rem;
    padding: 0.5rem;
  }

  .footer-text {
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .racing-bar-container {
    padding: 1rem;
  }

  .fullscreen-button {
    top: 1rem;
    right: 1rem;
    padding: 0.625rem;
    border-radius: 10px;
  }

  .logo-container {
    padding: 1rem 2rem;
  }

  .logo {
    height: 60px;
  }

  .participant-row {
    grid-template-columns: 50px 1fr 100px;
    gap: 0.75rem;
    padding: 0.5rem;
  }

  .participant-name {
    font-size: 1rem;
    grid-column: 2 / 3;
  }

  .rank-badge {
    width: 45px;
    height: 45px;
    font-size: 1.25rem;
  }

  .bar-container {
    height: 50px;
    grid-column: 1 / 4;
    grid-row: 2;
  }

  .avatar {
    width: 60px;
    height: 60px;
    border-width: 3px;
  }

  .avatar-glow {
    width: 90px;
    height: 90px;
  }

  .avatar-icon {
    font-size: 1.25rem;
  }

  .points-display {
    grid-column: 3 / 4;
    grid-row: 1;
  }

  .points-value {
    font-size: 1.5rem;
  }

  .points-label {
    font-size: 0.75rem;
  }

  .engagement-info {
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
  }

  .info-text {
    font-size: 0.85rem;
  }

  .footer-text {
    font-size: 0.9rem;
    padding: 0.75rem 1.5rem;
    flex-wrap: wrap;
  }
}
</style>
