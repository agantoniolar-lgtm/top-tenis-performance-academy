alter table public.coaches
  add column if not exists rol text,
  add column if not exists credencial text,
  add column if not exists bio text,
  add column if not exists orden integer not null default 100,
  add column if not exists visible_en_sitio boolean not null default true;

update public.coaches
set rol = 'Director General',
    credencial = 'UTR 12.07 · División I',
    bio = 'Fundador de TTPA. Llegó al #1 del Estado de México y al #4 nacional. Cuatro años en Marian University (Indianapolis) como capitán del equipo, invicto en la Crossroads League 2019.',
    orden = 10
where nombre = 'Armando' and apellido = 'Tlacaelel';
