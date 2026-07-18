
-- Función genérica para updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers updated_at
create trigger set_updated_at before update on public.athletes
  for each row execute function update_updated_at();

create trigger set_updated_at before update on public.reports
  for each row execute function update_updated_at();

create trigger set_updated_at before update on public.report_on_court
  for each row execute function update_updated_at();

create trigger set_updated_at before update on public.report_physical
  for each row execute function update_updated_at();

create trigger set_updated_at before update on public.report_character
  for each row execute function update_updated_at();

create trigger set_updated_at before update on public.report_athlete_voice
  for each row execute function update_updated_at();

-- Trigger: actualizar utr_actual en athletes cuando se completa report_on_court
create or replace function sync_utr_to_athlete()
returns trigger as $$
begin
  if new.completed_at is not null and new.utr is not null then
    update public.athletes
    set utr_actual = new.utr,
        updated_at = now()
    where id = (
      select athlete_id from public.reports where id = new.report_id
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_on_court_completed
  after insert or update on public.report_on_court
  for each row execute function sync_utr_to_athlete();
