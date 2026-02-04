
import { describe, it, expect } from 'vitest';
import { getYouTubeId } from './data';

describe('getYouTubeId', () => {
  it('extracts ID from standard watch URL', () => {
    expect(getYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from short URL', () => {
    expect(getYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from embed URL', () => {
    expect(getYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID when params are present', () => {
    expect(getYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s')).toBe('dQw4w9WgXcQ');
  });

  it('returns null for invalid URLs', () => {
    expect(getYouTubeId('https://www.google.com')).toBeNull();
    expect(getYouTubeId('not a url')).toBeNull();
  });
});
