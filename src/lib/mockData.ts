export type ContactStatus =
  | 'not_called'
  | 'called_no_answer'
  | 'called_answered'
  | 'confirmed'
  | 'declined'
  | 'callback_requested'
  | 'invalid_contact'
  | 'completed'

export interface Capture {
  id: string
  page_id: string
  page_name: string
  status: 'active' | 'stopped'
  started_at: string
  stopped_at: string | null
  total_views: number
  total_likes: number
  total_comments: number
  created_at: string
  phone_count?: number
}

export interface DetectedPhoneNumber {
  id: string
  capture_id: string
  phone_number: string
  username: string | null
  detected_at: string
  page_source: string | null
  contact_status: ContactStatus
  status_updated_at: string
  sequence_number: number
}

export interface PhoneNumberComment {
  id: string
  phone_number_id: string
  comment_text: string
  created_at: string
}

export interface Page {
  id: string
  page_name: string
  page_url: string
  is_active: boolean
  created_at: string
}

let mockCaptures: Capture[] = [
  {
    id: '1',
    page_id: '1',
    page_name: 'Fashion Trends',
    status: 'active',
    started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    stopped_at: null,
    total_views: 45230,
    total_likes: 3421,
    total_comments: 856,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    phone_count: 12
  },
  {
    id: '2',
    page_id: '2',
    page_name: 'Tech Reviews',
    status: 'stopped',
    started_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    stopped_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    total_views: 28540,
    total_likes: 1832,
    total_comments: 423,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    phone_count: 8
  },
  {
    id: '3',
    page_id: '3',
    page_name: 'Cooking Channel',
    status: 'active',
    started_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    stopped_at: null,
    total_views: 12450,
    total_likes: 892,
    total_comments: 234,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    phone_count: 5
  }
]

let mockPhoneNumbers: (DetectedPhoneNumber & { comments: PhoneNumberComment[] })[] = [
  {
    id: '1',
    capture_id: '1',
    phone_number: '+1 (555) 123-4567',
    username: 'sarah_miller',
    detected_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    page_source: 'comment',
    contact_status: 'confirmed',
    status_updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    sequence_number: 1,
    comments: [
      {
        id: '1',
        phone_number_id: '1',
        comment_text: 'Hey! Contact me for collaboration opportunities',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '2',
    capture_id: '1',
    phone_number: '+1 (555) 987-6543',
    username: 'mike_johnson',
    detected_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    page_source: 'comment',
    contact_status: 'called_answered',
    status_updated_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    sequence_number: 2,
    comments: [
      {
        id: '2',
        phone_number_id: '2',
        comment_text: 'Interested in your product! Call me at the number above',
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        phone_number_id: '2',
        comment_text: 'Available after 5pm today',
        created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '3',
    capture_id: '1',
    phone_number: '+1 (555) 456-7890',
    username: 'emma_davis',
    detected_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    page_source: 'comment',
    contact_status: 'callback_requested',
    status_updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    sequence_number: 3,
    comments: [
      {
        id: '4',
        phone_number_id: '3',
        comment_text: 'Please call me back tomorrow morning',
        created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        phone_number_id: '3',
        comment_text: 'Best time to reach me is 9-11am',
        created_at: new Date(Date.now() - 55 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        phone_number_id: '3',
        comment_text: 'Looking forward to discussing business opportunities',
        created_at: new Date(Date.now() - 50 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '4',
    capture_id: '1',
    phone_number: '+1 (555) 234-5678',
    username: 'john_smith',
    detected_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    page_source: 'comment',
    contact_status: 'not_called',
    status_updated_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    sequence_number: 4,
    comments: []
  },
  {
    id: '5',
    capture_id: '1',
    phone_number: '+1 (555) 876-5432',
    username: 'lisa_anderson',
    detected_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    page_source: 'comment',
    contact_status: 'declined',
    status_updated_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    sequence_number: 5,
    comments: [
      {
        id: '7',
        phone_number_id: '5',
        comment_text: 'Not interested at this time',
        created_at: new Date(Date.now() - 120 * 60 * 1000).toISOString()
      }
    ]
  }
]

let mockPages: Page[] = [
  {
    id: '1',
    page_name: 'Fashion Trends',
    page_url: 'https://tiktok.com/@fashiontrends',
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    page_name: 'Tech Reviews',
    page_url: 'https://tiktok.com/@techreviews',
    is_active: true,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    page_name: 'Cooking Channel',
    page_url: 'https://tiktok.com/@cookingchannel',
    is_active: true,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    page_name: 'Travel Diaries',
    page_url: 'https://tiktok.com/@traveldiaries',
    is_active: false,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export const mockDataService = {
  getCaptures: async (): Promise<Capture[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockCaptures]
  },

  getCapture: async (id: string): Promise<Capture | null> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockCaptures.find(c => c.id === id) || null
  },

  createCapture: async (pageId: string): Promise<Capture> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const page = mockPages.find(p => p.id === pageId)
    const newCapture: Capture = {
      id: String(mockCaptures.length + 1),
      page_id: pageId,
      page_name: page?.page_name || 'Unknown Page',
      status: 'active',
      started_at: new Date().toISOString(),
      stopped_at: null,
      total_views: 0,
      total_likes: 0,
      total_comments: 0,
      created_at: new Date().toISOString(),
      phone_count: 0
    }
    mockCaptures.unshift(newCapture)
    return newCapture
  },

  stopCapture: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const capture = mockCaptures.find(c => c.id === id)
    if (capture) {
      capture.status = 'stopped'
      capture.stopped_at = new Date().toISOString()
    }
  },

  getPhoneNumbers: async (captureId: string): Promise<(DetectedPhoneNumber & { comments: PhoneNumberComment[] })[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockPhoneNumbers.filter(p => p.capture_id === captureId)
  },

  updatePhoneNumberStatus: async (id: string, status: ContactStatus): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const phoneNumber = mockPhoneNumbers.find(p => p.id === id)
    if (phoneNumber) {
      phoneNumber.contact_status = status
      phoneNumber.status_updated_at = new Date().toISOString()
    }
  },

  getPages: async (): Promise<Page[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockPages]
  },

  createPage: async (name: string, url: string): Promise<Page> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newPage: Page = {
      id: String(mockPages.length + 1),
      page_name: name,
      page_url: url,
      is_active: true,
      created_at: new Date().toISOString()
    }
    mockPages.unshift(newPage)
    return newPage
  },

  updatePageStatus: async (id: string, isActive: boolean): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const page = mockPages.find(p => p.id === id)
    if (page) {
      page.is_active = isActive
    }
  },

  deletePage: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    mockPages = mockPages.filter(p => p.id !== id)
  }
}
