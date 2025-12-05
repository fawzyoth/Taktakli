<template>
  <div class="racing-bar-container">
    <div class="logo-container">
      <img src="/Design sans titre.png" alt="Shopa.ovh" class="logo" />
    </div>

    <div class="engagement-info">
      <div class="info-text">
        <strong>Point System:</strong> Comments +2 pts | Likes +1 pt | Shares +3 pts/min | Real-time updates
      </div>
    </div>

    <div class="leaderboard">
      <div
        v-for="(participant, index) in sortedParticipants"
        :key="participant.id"
        class="participant-row"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="participant-name">{{ participant.name }}</div>
        <div class="bar-container">
          <div
            class="progress-bar"
            :style="{
              width: `${getBarWidth(participant.points)}%`,
              transitionDelay: `${index * 0.1}s`
            }"
          >
            <div class="bar-shine"></div>
          </div>
          <div
            class="avatar-container"
            :style="{ left: `${getBarWidth(participant.points)}%` }"
          >
            <div class="avatar" :style="{ background: participant.avatarColor }">
              <div class="avatar-icon">{{ participant.initials }}</div>
            </div>
          </div>
        </div>
        <div class="points-display">{{ participant.points.toLocaleString() }}</div>
      </div>
    </div>

    <div class="footer-text">
      Live Engagement Leaderboard - Shopa.ovh
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Participant {
  id: number
  name: string
  points: number
  initials: string
  avatarColor: string
}

const participants = ref<Participant[]>([
  { id: 1, name: 'Sarah Martinez', points: 150, initials: 'SM', avatarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 2, name: 'Ahmed Hassan', points: 120, initials: 'AH', avatarColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 3, name: 'Emily Chen', points: 95, initials: 'EC', avatarColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 4, name: 'Marcus Johnson', points: 80, initials: 'MJ', avatarColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 5, name: 'Isabella Romano', points: 65, initials: 'IR', avatarColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
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

const simulateRealTimeUpdates = () => {
  const randomParticipant = participants.value[Math.floor(Math.random() * participants.value.length)]
  const pointsToAdd = Math.floor(Math.random() * 5) + 1
  randomParticipant.points += pointsToAdd
}

let updateInterval: number | null = null

onMounted(() => {
  updateInterval = window.setInterval(simulateRealTimeUpdates, 3000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.racing-bar-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #E3F2FD 0%, #FFFFFF 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.6s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.logo-container {
  margin-bottom: 2rem;
  animation: slideDown 0.8s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.logo {
  height: 80px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.engagement-info {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
  box-shadow: 0 4px 12px rgba(46, 94, 170, 0.15);
  border: 1px solid rgba(46, 94, 170, 0.2);
  max-width: 900px;
  width: 100%;
}

.info-text {
  color: #2E5EAA;
  font-size: 0.95rem;
  text-align: center;
  line-height: 1.5;
}

.leaderboard {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.participant-row {
  display: grid;
  grid-template-columns: 200px 1fr 120px;
  align-items: center;
  gap: 1.5rem;
  padding: 0.5rem 0;
  animation: slideInFromLeft 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes slideInFromLeft {
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.participant-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: right;
  padding-right: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.bar-container {
  position: relative;
  height: 60px;
  width: 100%;
}

.progress-bar {
  height: 100%;
  background: #2E5EAA;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(46, 94, 170, 0.3);
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.bar-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shine 2s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.avatar-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: left 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.avatar-icon {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.points-display {
  font-size: 2rem;
  font-weight: 800;
  color: #2E5EAA;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  animation: countUp 0.8s ease-out;
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.footer-text {
  margin-top: 3rem;
  color: #2E5EAA;
  font-size: 1.1rem;
  font-weight: 600;
  opacity: 0.8;
  text-align: center;
}

@media (max-width: 1024px) {
  .participant-row {
    grid-template-columns: 150px 1fr 100px;
    gap: 1rem;
  }

  .participant-name {
    font-size: 1.2rem;
  }

  .bar-container {
    height: 50px;
  }

  .avatar {
    width: 60px;
    height: 60px;
  }

  .avatar-icon {
    font-size: 1.2rem;
  }

  .points-display {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .racing-bar-container {
    padding: 1rem;
  }

  .logo {
    height: 60px;
  }

  .participant-row {
    grid-template-columns: 100px 1fr 80px;
    gap: 0.5rem;
  }

  .participant-name {
    font-size: 1rem;
    padding-right: 0.5rem;
  }

  .bar-container {
    height: 40px;
  }

  .avatar {
    width: 50px;
    height: 50px;
    border-width: 3px;
  }

  .avatar-icon {
    font-size: 1rem;
  }

  .points-display {
    font-size: 1.2rem;
  }

  .engagement-info {
    padding: 0.75rem 1rem;
    margin-bottom: 2rem;
  }

  .info-text {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .participant-row {
    grid-template-columns: 80px 1fr 70px;
  }

  .participant-name {
    font-size: 0.9rem;
  }

  .points-display {
    font-size: 1rem;
  }
}
</style>
