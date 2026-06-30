import { describe, it, expect } from 'vitest';
import { contentKey, youTubeId, indexBySlot } from './content.js';

describe('contentKey', () => {
  it('une page y slot con ::', () => {
    expect(contentKey('home', 'hero_titulo')).toBe('home::hero_titulo');
  });
});

describe('youTubeId', () => {
  it('devuelve null si el input es null', () => {
    expect(youTubeId(null)).toBeNull();
  });
  it('devuelve null si el input es cadena vacía', () => {
    expect(youTubeId('')).toBeNull();
  });
  it('devuelve null si no es string', () => {
    expect(youTubeId(123)).toBeNull();
  });
  it('extrae el id de una URL watch?v=', () => {
    expect(youTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });
  it('extrae el id de una URL youtu.be', () => {
    expect(youTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });
  it('extrae el id de una URL embed', () => {
    expect(youTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });
  it('devuelve null para una URL que no es de YouTube', () => {
    expect(youTubeId('https://vimeo.com/12345678')).toBeNull();
  });
});

describe('indexBySlot', () => {
  it('devuelve objeto vacío si el input es null', () => {
    expect(indexBySlot(null)).toEqual({});
  });
  it('indexa por page::slot tomando el campo value por defecto', () => {
    const rows = [{ page: 'home', slot: 'hero_titulo', value: 'Hola' }];
    expect(indexBySlot(rows)).toEqual({ 'home::hero_titulo': 'Hola' });
  });
  it('puede indexar usando otro campo', () => {
    const rows = [{ page: 'home', slot: 'hero_imagen', url: 'http://x/y.jpg' }];
    expect(indexBySlot(rows, 'url')).toEqual({ 'home::hero_imagen': 'http://x/y.jpg' });
  });
  it('con valueField "*" guarda la fila completa', () => {
    const rows = [{ page: 'home', slot: 'v', url: 'u', type: 'video' }];
    expect(indexBySlot(rows, '*')['home::v']).toEqual({ page: 'home', slot: 'v', url: 'u', type: 'video' });
  });
});
