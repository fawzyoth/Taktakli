import { supabase } from '../lib/supabase';

const phoneNumbers = [
  '+1-555-0123',
  '+1-555-0456',
  '+1-555-0789',
  '+1-555-1234',
  '+1-555-5678',
  '+1-555-9012',
  '+1-555-3456',
  '+1-555-7890',
  '+1-555-2345',
  '+1-555-6789',
];

const usernames = [
  'tiktoker_pro',
  'live_fan_2024',
  'stream_watcher',
  'cool_user_123',
  'digital_nomad',
  'content_lover',
  'social_butterfly',
  'viral_seeker',
  'trend_setter',
  'online_enthusiast',
];

const comments = [
  'Hey everyone! Check out my profile! {phone}',
  'Looking for collabs! Hit me up at {phone}',
  'DM me for business inquiries {phone}',
  'Contact me: {phone}',
  'Whatsapp me at {phone} for more info',
  'Call or text {phone} if interested',
  'Reach out to me {phone}',
  'My number is {phone} for serious inquiries only',
  'Text me at {phone}',
  'For booking: {phone}',
  'Just having fun watching this stream!',
  'This is amazing content!',
  'Love this live!',
  'Best stream ever',
  'Keep up the great work!',
];

const additionalComments = [
  'Looking forward to more streams like this!',
  'Can you do a tutorial on this?',
  'Amazing talent!',
  'This is so helpful, thank you!',
  'Been following you for a while now',
  'Your content is top tier',
  'Just followed you!',
  'This deserves more views',
  'Thanks for the entertainment',
  'You inspired me to start streaming too!',
];

export const generateMockDataForCapture = async (captureId: string, userId: string) => {
  const { data: capturePages } = await supabase
    .from('capture_pages')
    .select('page_id')
    .eq('capture_id', captureId);

  const pageIds = capturePages?.map(cp => cp.page_id) || [];

  const numPhoneNumbers = Math.floor(Math.random() * 5) + 3;

  for (let i = 0; i < numPhoneNumbers; i++) {
    const phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
    const username = usernames[Math.floor(Math.random() * usernames.length)];
    const pageId = pageIds.length > 0 ? pageIds[Math.floor(Math.random() * pageIds.length)] : null;

    const hasPhoneInComment = Math.random() > 0.3;

    const { data: phoneData, error: phoneError } = await supabase
      .from('detected_phone_numbers')
      .insert({
        capture_id: captureId,
        phone_number: phoneNumber,
        username: username,
        user_profile_image: null,
        page_id: pageId,
        detected_at: new Date(Date.now() - Math.random() * 300000).toISOString(),
      })
      .select()
      .single();

    if (phoneError || !phoneData) continue;

    if (hasPhoneInComment) {
      const numComments = Math.floor(Math.random() * 4) + 1;

      for (let j = 0; j < numComments; j++) {
        let commentText;

        if (j === 0) {
          const phoneCommentTemplate = comments.find(c => c.includes('{phone}'));
          commentText = phoneCommentTemplate
            ? phoneCommentTemplate.replace('{phone}', phoneNumber)
            : `Contact me at ${phoneNumber}`;
        } else {
          commentText = additionalComments[Math.floor(Math.random() * additionalComments.length)];
        }

        await supabase
          .from('phone_number_comments')
          .insert({
            detected_phone_id: phoneData.id,
            comment_text: commentText,
          });
      }
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const totalComments = Math.floor(Math.random() * 50) + 20;
  const totalLikes = Math.floor(Math.random() * 200) + 50;

  await supabase
    .from('captures')
    .update({
      phone_numbers_count: numPhoneNumbers,
      comments_count: totalComments,
      likes_count: totalLikes,
    })
    .eq('id', captureId);
};

export const simulateLiveUpdates = async (captureId: string) => {
  const shouldAddPhone = Math.random() > 0.7;

  if (shouldAddPhone) {
    const phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
    const username = usernames[Math.floor(Math.random() * usernames.length)];

    const { data: phoneData } = await supabase
      .from('detected_phone_numbers')
      .insert({
        capture_id: captureId,
        phone_number: phoneNumber,
        username: username,
        user_profile_image: null,
      })
      .select()
      .single();

    if (phoneData) {
      const hasComment = Math.random() > 0.3;

      if (hasComment) {
        const phoneCommentTemplate = comments.find(c => c.includes('{phone}'));
        const commentText = phoneCommentTemplate
          ? phoneCommentTemplate.replace('{phone}', phoneNumber)
          : `Check out my profile! ${phoneNumber}`;

        await supabase
          .from('phone_number_comments')
          .insert({
            detected_phone_id: phoneData.id,
            comment_text: commentText,
          });
      }
    }
  }

  const { data: currentCapture } = await supabase
    .from('captures')
    .select('*')
    .eq('id', captureId)
    .single();

  if (currentCapture) {
    const likesIncrease = Math.floor(Math.random() * 10) + 1;
    const commentsIncrease = Math.floor(Math.random() * 5) + 1;

    await supabase
      .from('captures')
      .update({
        likes_count: currentCapture.likes_count + likesIncrease,
        comments_count: currentCapture.comments_count + commentsIncrease,
        phone_numbers_count: shouldAddPhone
          ? currentCapture.phone_numbers_count + 1
          : currentCapture.phone_numbers_count,
      })
      .eq('id', captureId);
  }
};
