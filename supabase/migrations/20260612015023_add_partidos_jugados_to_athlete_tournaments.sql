alter table athlete_tournaments add column if not exists partidos_jugados smallint check (partidos_jugados is null or partidos_jugados between 1 and 15);
comment on column athlete_tournaments.partidos_jugados is 'Total de partidos jugados en el torneo (incluye qualy). Permite calcular W/L por partido: si victoria=true gana todos; si false, pierde el último.';
