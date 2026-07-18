
-- Transferir user_id de Marco Reyes a Tlacaelel
UPDATE coaches
  SET user_id = '49c9240a-18ae-49f9-bb85-7e41b68bda58'
  WHERE id = 'd64b1bfa-8fa2-4c03-9748-158bcdef4017';

-- Reasignar todas las referencias de Marco Reyes → Tlacaelel
UPDATE athletes         SET coach_id      = 'd64b1bfa-8fa2-4c03-9748-158bcdef4017' WHERE coach_id      = '374edcde-33e7-439f-8da8-e887a3ff365f';
UPDATE reports          SET coach_id      = 'd64b1bfa-8fa2-4c03-9748-158bcdef4017' WHERE coach_id      = '374edcde-33e7-439f-8da8-e887a3ff365f';
UPDATE report_on_court  SET completed_by  = 'd64b1bfa-8fa2-4c03-9748-158bcdef4017' WHERE completed_by  = '374edcde-33e7-439f-8da8-e887a3ff365f';
UPDATE report_physical  SET completed_by  = 'd64b1bfa-8fa2-4c03-9748-158bcdef4017' WHERE completed_by  = '374edcde-33e7-439f-8da8-e887a3ff365f';
UPDATE report_character SET completed_by  = 'd64b1bfa-8fa2-4c03-9748-158bcdef4017' WHERE completed_by  = '374edcde-33e7-439f-8da8-e887a3ff365f';
UPDATE reports          SET athlete_voice_unlocked_by = 'd64b1bfa-8fa2-4c03-9748-158bcdef4017' WHERE athlete_voice_unlocked_by = '374edcde-33e7-439f-8da8-e887a3ff365f';

-- Eliminar Marco Reyes
DELETE FROM coaches WHERE id = '374edcde-33e7-439f-8da8-e887a3ff365f';
