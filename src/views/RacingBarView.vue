<template>
  <div class="racing-bar-container">
    <div class="header-section">
      <div class="logo-container">
        <img src="/Design sans titre.png" alt="Shopa.ovh" class="logo" />
      </div>

      <div class="engagement-info">
        <div class="live-indicator">
          <span class="live-dot"></span>
          <span class="live-text">LIVE</span>
        </div>
        <div class="info-text">
          <span class="info-label">Engagement Points:</span>
          <span class="info-detail">Comments +2 · Likes +1 · Shares +3/min</span>
        </div>
      </div>
    </div>

    <div class="leaderboard-header">
      <div class="header-rank">Rank</div>
      <div class="header-name">Participant</div>
      <div class="header-progress">Progress</div>
      <div class="header-points">Points</div>
    </div>

    <div class="leaderboard">
      <div
        v-for="(participant, index) in sortedParticipants"
        :key="participant.id"
        class="participant-row"
        :class="{ 'is-leader': index === 0 }"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="rank-badge" :class="`rank-${index + 1}`">
          <span class="rank-number">{{ index + 1 }}</span>
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

        <div class="points-display">
          <span class="points-value">{{ participant.points.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <div class="footer-text">
      <span>Real-time Engagement Leaderboard</span>
      <span class="footer-separator">|</span>
      <span class="footer-brand">Powered by Shopa.ovh</span>
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
  {
    id: 1,
    name: 'Sarah Martinez',
    points: 150,
    initials: 'SM',
    avatarColor: 'linear-gradient(135deg, #2E5EAA 0%, #1e3a8a 100%)'
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    points: 120,
    initials: 'AH',
    avatarColor: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)'
  },
  {
    id: 3,
    name: 'Emily Chen',
    points: 95,
    initials: 'EC',
    avatarColor: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
  },
  {
    id: 4,
    name: 'Marcus Johnson',
    points: 80,
    initials: 'MJ',
    avatarColor: 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
  },
  {
    id: 5,
    name: 'Isabella Romano',
    points: 65,
    initials: 'IR',
    avatarColor: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
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
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.header-section {
  width: 100%;
  max-width: 1400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1rem;
}

.logo-container {
  background: white;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.logo {
  height: 60px;
  width: auto;
  object-fit: contain;
}

.engagement-info {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #dc2626;
  border-radius: 50%;
  animation: livePulse 2s infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.live-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: #dc2626;
  letter-spacing: 0.05em;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-detail {
  font-size: 0.875rem;
  color: #334155;
  font-weight: 500;
}

.leaderboard-header {
  width: 100%;
  max-width: 1400px;
  display: grid;
  grid-template-columns: 70px 250px 1fr 140px;
  gap: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.leaderboard-header > div {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.header-rank {
  text-align: center;
}

.header-points {
  text-align: center;
}

.leaderboard {
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.participant-row {
  display: grid;
  grid-template-columns: 70px 250px 1fr 140px;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.participant-row:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.participant-row.is-leader {
  border: 2px solid #2E5EAA;
  box-shadow: 0 4px 16px rgba(46, 94, 170, 0.15);
}

.rank-badge {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  background: #f1f5f9;
  color: #475569;
  border: 2px solid #e2e8f0;
  margin: 0 auto;
}

.rank-badge.rank-1 {
  background: linear-gradient(135deg, #2E5EAA 0%, #1e3a8a 100%);
  color: white;
  border-color: #2E5EAA;
  box-shadow: 0 2px 8px rgba(46, 94, 170, 0.25);
}

.rank-badge.rank-2 {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  color: white;
  border-color: #0891b2;
}

.rank-badge.rank-3 {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: white;
  border-color: #0284c7;
}

.rank-number {
  font-size: 1.25rem;
  font-weight: 800;
}

.participant-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.name-text {
  display: block;
}

.bar-container {
  position: relative;
  height: 48px;
  width: 100%;
}

.bar-background {
  position: absolute;
  inset: 0;
  background: #f1f5f9;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.progress-bar {
  height: 100%;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bar-rank-1 {
  background: linear-gradient(90deg, #2E5EAA 0%, #1e3a8a 100%);
}

.bar-rank-2 {
  background: linear-gradient(90deg, #0891b2 0%, #0e7490 100%);
}

.bar-rank-3 {
  background: linear-gradient(90deg, #0284c7 0%, #0369a1 100%);
}

.bar-rank-4,
.bar-rank-5 {
  background: linear-gradient(90deg, #64748b 0%, #475569 100%);
}

.bar-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { left: -50%; }
  100% { left: 150%; }
}

.avatar-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: left 1s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-icon {
  color: white;
  font-size: 1.125rem;
  font-weight: 700;
}

.points-display {
  display: flex;
  align-items: center;
  justify-content: center;
}

.points-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
}

.footer-text {
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.footer-separator {
  color: #cbd5e1;
}

.footer-brand {
  color: #2E5EAA;
  font-weight: 700;
}

@media (max-width: 1024px) {
  .leaderboard-header,
  .participant-row {
    grid-template-columns: 60px 180px 1fr 120px;
    gap: 1rem;
    padding: 1rem;
  }

  .rank-badge {
    width: 44px;
    height: 44px;
    font-size: 1.125rem;
  }

  .participant-name {
    font-size: 1rem;
  }

  .bar-container {
    height: 44px;
  }

  .avatar {
    width: 52px;
    height: 52px;
  }

  .points-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .racing-bar-container {
    padding: 1.5rem 1rem;
  }

  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .logo-container {
    text-align: center;
  }

  .engagement-info {
    flex-direction: column;
    gap: 1rem;
  }

  .leaderboard-header {
    display: none;
  }

  .participant-row {
    grid-template-columns: 50px 1fr 100px;
    gap: 0.75rem;
    padding: 0.875rem;
  }

  .rank-badge {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .participant-name {
    font-size: 0.875rem;
    grid-column: 2 / 3;
  }

  .bar-container {
    grid-column: 1 / 4;
    grid-row: 2;
    height: 40px;
  }

  .avatar {
    width: 48px;
    height: 48px;
  }

  .avatar-icon {
    font-size: 1rem;
  }

  .points-display {
    grid-column: 3 / 4;
    grid-row: 1;
  }

  .points-value {
    font-size: 1.25rem;
  }

  .footer-text {
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.75rem;
  }

  .footer-separator {
    display: none;
  }
}
</style>
