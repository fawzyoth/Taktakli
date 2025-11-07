export type CaptureMode = 'simple' | 'code-based'

export interface CapturedCode {
  id: string
  name: string
  photo?: string
  createdAt: string
  isActive: boolean
  numbers: CapturedNumber[]
  willPurchase: boolean
}

export interface CapturedNumber {
  id: string
  phoneNumber: string
  username: string
  capturedAt: string
}

export interface CaptureSession {
  id: string
  mode: CaptureMode
  startedAt: string
  codes: CapturedCode[]
  activeCodeId: string | null
}

export class CodeCaptureService {
  private currentSession: CaptureSession | null = null

  createSession(mode: CaptureMode): CaptureSession {
    this.currentSession = {
      id: this.generateId(),
      mode,
      startedAt: new Date().toISOString(),
      codes: [],
      activeCodeId: null
    }
    return this.currentSession
  }

  createCode(name: string, photo?: string): CapturedCode {
    if (!this.currentSession) {
      throw new Error('No active session')
    }

    this.currentSession.codes.forEach(code => {
      code.isActive = false
    })

    const newCode: CapturedCode = {
      id: this.generateId(),
      name,
      photo,
      createdAt: new Date().toISOString(),
      isActive: true,
      numbers: [],
      willPurchase: false
    }

    this.currentSession.codes.push(newCode)
    this.currentSession.activeCodeId = newCode.id

    return newCode
  }

  captureNumber(phoneNumber: string, username: string): CapturedNumber {
    if (!this.currentSession) {
      throw new Error('No active session')
    }

    const activeCode = this.currentSession.codes.find(c => c.id === this.currentSession!.activeCodeId)
    if (!activeCode) {
      throw new Error('No active code')
    }

    const capturedNumber: CapturedNumber = {
      id: this.generateId(),
      phoneNumber,
      username,
      capturedAt: new Date().toISOString()
    }

    activeCode.numbers.push(capturedNumber)

    return capturedNumber
  }

  togglePurchaseDecision(codeId: string): void {
    if (!this.currentSession) return

    const code = this.currentSession.codes.find(c => c.id === codeId)
    if (code) {
      code.willPurchase = !code.willPurchase
    }
  }

  getSession(): CaptureSession | null {
    return this.currentSession
  }

  finishSession(): CaptureSession {
    if (!this.currentSession) {
      throw new Error('No active session')
    }

    const session = { ...this.currentSession }
    this.currentSession = null
    return session
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

export const codeCaptureService = new CodeCaptureService()

export function generateMockSession(): CaptureSession {
  return {
    id: '1730000000000-mock',
    mode: 'code-based',
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    activeCodeId: null,
    codes: [
      {
        id: 'code-1',
        name: 'iPhone 15 Pro',
        photo: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdAt: new Date(Date.now() - 3500000).toISOString(),
        isActive: false,
        willPurchase: true,
        numbers: [
          {
            id: 'num-1',
            phoneNumber: '+216 98 765 432',
            username: 'ahmed_tech',
            capturedAt: new Date(Date.now() - 3400000).toISOString()
          },
          {
            id: 'num-2',
            phoneNumber: '+216 22 345 678',
            username: 'sarah_mohamed',
            capturedAt: new Date(Date.now() - 3300000).toISOString()
          },
          {
            id: 'num-3',
            phoneNumber: '+216 55 123 456',
            username: 'ali_ben',
            capturedAt: new Date(Date.now() - 3200000).toISOString()
          }
        ]
      },
      {
        id: 'code-2',
        name: 'Samsung Galaxy S24',
        photo: 'https://images.pexels.com/photos/2541310/pexels-photo-2541310.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdAt: new Date(Date.now() - 2500000).toISOString(),
        isActive: false,
        willPurchase: true,
        numbers: [
          {
            id: 'num-4',
            phoneNumber: '+216 20 987 654',
            username: 'yasmine_shop',
            capturedAt: new Date(Date.now() - 2400000).toISOString()
          },
          {
            id: 'num-5',
            phoneNumber: '+216 54 321 987',
            username: 'karim_electronics',
            capturedAt: new Date(Date.now() - 2300000).toISOString()
          }
        ]
      },
      {
        id: 'code-3',
        name: 'MacBook Air M2',
        createdAt: new Date(Date.now() - 1500000).toISOString(),
        isActive: false,
        willPurchase: false,
        numbers: [
          {
            id: 'num-6',
            phoneNumber: '+216 28 456 789',
            username: 'marwa_laptop',
            capturedAt: new Date(Date.now() - 1400000).toISOString()
          }
        ]
      },
      {
        id: 'code-4',
        name: 'AirPods Pro',
        photo: 'https://images.pexels.com/photos/4219861/pexels-photo-4219861.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdAt: new Date(Date.now() - 800000).toISOString(),
        isActive: false,
        willPurchase: true,
        numbers: [
          {
            id: 'num-7',
            phoneNumber: '+216 99 111 222',
            username: 'mohamed_audio',
            capturedAt: new Date(Date.now() - 750000).toISOString()
          },
          {
            id: 'num-8',
            phoneNumber: '+216 26 333 444',
            username: 'fatma_tech',
            capturedAt: new Date(Date.now() - 700000).toISOString()
          },
          {
            id: 'num-9',
            phoneNumber: '+216 51 555 666',
            username: 'walid_store',
            capturedAt: new Date(Date.now() - 650000).toISOString()
          },
          {
            id: 'num-10',
            phoneNumber: '+216 95 777 888',
            username: 'amina_shop',
            capturedAt: new Date(Date.now() - 600000).toISOString()
          }
        ]
      }
    ]
  }
}
