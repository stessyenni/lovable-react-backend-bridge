import { useEffect, useRef, useCallback } from 'react';

interface UseAccessibilityAnnouncerOptions {
  enabled: boolean;
  announceClicks?: boolean;
  announceScrolls?: boolean;
}

export const useAccessibilityAnnouncer = ({
  enabled,
  announceClicks = true,
  announceScrolls = true,
}: UseAccessibilityAnnouncerOptions) => {
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const lastScrollAnnounceRef = useRef<number>(0);
  const lastAnnouncementRef = useRef<string>('');

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
  }, []);

  const announce = useCallback((text: string, priority: 'high' | 'low' = 'low') => {
    if (!enabled || !speechSynthesisRef.current || !text) return;
    
    // Prevent duplicate announcements
    if (text === lastAnnouncementRef.current) return;
    lastAnnouncementRef.current = text;
    
    // Clear previous announcements for low priority
    if (priority === 'low') {
      speechSynthesisRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Get preferred voice
    const voices = speechSynthesisRef.current.getVoices();
    const preferredVoice = localStorage.getItem('preferred-voice');
    if (preferredVoice) {
      const voice = voices.find(v => v.voiceURI === preferredVoice);
      if (voice) utterance.voice = voice;
    } else if (voices.length > 0) {
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      // Reset last announcement after speaking
      setTimeout(() => {
        lastAnnouncementRef.current = '';
      }, 500);
    };

    speechSynthesisRef.current.speak(utterance);
  }, [enabled]);

  // Handle click announcements
  useEffect(() => {
    if (!enabled || !announceClicks) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      let announcement = '';

      // Get accessible name from various sources
      const ariaLabel = target.getAttribute('aria-label');
      const title = target.getAttribute('title');
      const altText = target.getAttribute('alt');
      const textContent = target.textContent?.trim().slice(0, 50);

      // Determine element type for context
      const tagName = target.tagName.toLowerCase();
      const role = target.getAttribute('role');

      if (tagName === 'button' || role === 'button') {
        const buttonText = ariaLabel || title || textContent || 'Button';
        announcement = `${buttonText} button clicked`;
      } else if (tagName === 'a' || role === 'link') {
        const linkText = ariaLabel || title || textContent || 'Link';
        announcement = `${linkText} link clicked`;
      } else if (tagName === 'input') {
        const inputType = (target as HTMLInputElement).type;
        const inputLabel = ariaLabel || title || (target as HTMLInputElement).placeholder || inputType;
        announcement = `${inputLabel} ${inputType} field selected`;
      } else if (tagName === 'select') {
        announcement = `${ariaLabel || 'Dropdown'} menu opened`;
      } else if (target.closest('[data-nav="true"]')) {
        const navItem = target.closest('[data-nav="true"]');
        const navText = navItem?.textContent?.trim() || 'Navigation item';
        announcement = `Navigating to ${navText}`;
      } else if (tagName === 'img') {
        announcement = `Image: ${altText || 'No description'}`;
      } else if (textContent && textContent.length > 2 && textContent.length < 50) {
        announcement = textContent;
      }

      if (announcement) {
        announce(announcement);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [enabled, announceClicks, announce]);

  // Handle scroll announcements
  useEffect(() => {
    if (!enabled || !announceScrolls) return;

    const handleScroll = () => {
      const now = Date.now();
      // Throttle scroll announcements to once every 2 seconds
      if (now - lastScrollAnnounceRef.current < 2000) return;
      lastScrollAnnounceRef.current = now;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight <= 0) return;
      
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
      
      if (scrollPercent <= 5) {
        announce('At top of page');
      } else if (scrollPercent >= 95) {
        announce('At bottom of page');
      } else if (scrollPercent % 25 === 0) {
        announce(`${scrollPercent} percent scrolled`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled, announceScrolls, announce]);

  // Handle focus announcements for form elements
  useEffect(() => {
    if (!enabled) return;

    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const tagName = target.tagName.toLowerCase();
      const ariaLabel = target.getAttribute('aria-label');
      const placeholder = (target as HTMLInputElement).placeholder;

      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        const label = ariaLabel || placeholder || tagName;
        announce(`${label} field focused`);
      }
    };

    document.addEventListener('focusin', handleFocus, true);
    return () => document.removeEventListener('focusin', handleFocus, true);
  }, [enabled, announce]);

  return { announce };
};

export default useAccessibilityAnnouncer;
