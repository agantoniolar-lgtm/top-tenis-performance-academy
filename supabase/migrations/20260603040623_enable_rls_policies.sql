
-- Habilitar RLS en todas las tablas
alter table public.coaches enable row level security;
alter table public.athletes enable row level security;
alter table public.reports enable row level security;
alter table public.report_on_court enable row level security;
alter table public.report_physical enable row level security;
alter table public.report_character enable row level security;
alter table public.report_athlete_voice enable row level security;

-- coaches: cada coach ve solo su perfil
create policy "coaches_select_own" on public.coaches
  for select using (user_id = auth.uid());

-- athletes: coach ve y gestiona sus atletas; atleta ve su propio perfil
create policy "coaches_all_their_athletes" on public.athletes
  for all using (
    coach_id in (select id from public.coaches where user_id = auth.uid())
  );

create policy "athletes_select_own" on public.athletes
  for select using (user_id = auth.uid());

-- reports: coach gestiona los de sus atletas; atleta lee los suyos
create policy "coaches_all_their_reports" on public.reports
  for all using (
    coach_id in (select id from public.coaches where user_id = auth.uid())
  );

create policy "athletes_select_own_reports" on public.reports
  for select using (
    athlete_id in (select id from public.athletes where user_id = auth.uid())
  );

-- report_on_court: coach gestiona; atleta lee solo si está completado
create policy "coaches_all_on_court" on public.report_on_court
  for all using (
    report_id in (
      select r.id from public.reports r
      join public.coaches c on c.id = r.coach_id
      where c.user_id = auth.uid()
    )
  );

create policy "athletes_select_completed_on_court" on public.report_on_court
  for select using (
    completed_at is not null
    and report_id in (
      select r.id from public.reports r
      join public.athletes a on a.id = r.athlete_id
      where a.user_id = auth.uid()
    )
  );

-- report_physical: coach gestiona; atleta lee solo si está completado
create policy "coaches_all_physical" on public.report_physical
  for all using (
    report_id in (
      select r.id from public.reports r
      join public.coaches c on c.id = r.coach_id
      where c.user_id = auth.uid()
    )
  );

create policy "athletes_select_completed_physical" on public.report_physical
  for select using (
    completed_at is not null
    and report_id in (
      select r.id from public.reports r
      join public.athletes a on a.id = r.athlete_id
      where a.user_id = auth.uid()
    )
  );

-- report_character: solo coaches
create policy "coaches_only_character" on public.report_character
  for all using (
    report_id in (
      select r.id from public.reports r
      join public.coaches c on c.id = r.coach_id
      where c.user_id = auth.uid()
    )
  );

-- report_athlete_voice: coach lee; atleta gestiona el suyo solo si está desbloqueado
create policy "coaches_select_athlete_voice" on public.report_athlete_voice
  for select using (
    report_id in (
      select r.id from public.reports r
      join public.coaches c on c.id = r.coach_id
      where c.user_id = auth.uid()
    )
  );

create policy "athletes_all_own_voice_if_unlocked" on public.report_athlete_voice
  for all using (
    report_id in (
      select r.id from public.reports r
      join public.athletes a on a.id = r.athlete_id
      where a.user_id = auth.uid()
      and r.athlete_voice_unlocked_at is not null
    )
  );
