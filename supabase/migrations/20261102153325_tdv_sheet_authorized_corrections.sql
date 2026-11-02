-- DEC-031: permissions belong to the stored pre-update row, never to a submitted grant.
-- No row is rewritten. Existing RLS, CAS, validation and investment costs remain authorities.
create or replace function private.guard_tdv2_sheet_progression()
returns trigger language plpgsql security invoker set search_path = '' as $$
declare is_master boolean; delegated boolean := false; reopened boolean := false;
begin
  if auth.uid() is null then return new; end if;
  select exists(select 1 from public.user_roles where user_id=(select auth.uid()) and role='mestre'::public.app_role) into is_master;
  if new.rules_version=2 and new.tdv2_data ? 'progression' then
    if jsonb_typeof(new.tdv2_data->'progression') is distinct from 'object'
       or jsonb_typeof(new.tdv2_data#>'{progression,allowMilestones}') is distinct from 'boolean'
       or jsonb_typeof(new.tdv2_data#>'{progression,allowCreation}') is distinct from 'boolean' then
      raise exception 'Invalid progression authorization';
    end if;
  end if;
  if is_master then return new; end if;
  if tg_op='UPDATE' and old.rules_version=2 then
    if new.rules_version<>2 then raise exception 'Only a mestre may change a completed rules edition'; end if;
    if new.tdv2_data->'progression' is distinct from old.tdv2_data->'progression'
       or new.tdv2_data->'corrections' is distinct from old.tdv2_data->'corrections' then
      raise exception 'Only a mestre may authorize progression or correct its history';
    end if;
    delegated := coalesce(old.tdv2_data#>>'{progression,allowMilestones}','false')='true';
    reopened := coalesce(old.tdv2_data#>>'{progression,allowCreation}','false')='true';
    if new.tdv2_data->'milestones' is distinct from old.tdv2_data->'milestones' then
      if not delegated or jsonb_array_length(new.tdv2_data->'milestones')<>jsonb_array_length(old.tdv2_data->'milestones')+1
         or exists(select 1 from jsonb_array_elements(old.tdv2_data->'milestones') with ordinality x(entry,n)
                   where entry is distinct from (new.tdv2_data->'milestones')->(n::integer-1)) then
        raise exception 'Marcos require recognition by a mestre or a previously authorized single advance';
      end if;
    end if;
    if old.tdv2_data->>'ready'='true' then
      if new.tdv2_data->>'ready'<>'true' then raise exception 'A completed character stays completed'; end if;
      if new.tdv2_data->'matrices' is distinct from old.tdv2_data->'matrices'
         or new.tdv2_data->'alinhavos' is distinct from old.tdv2_data->'alinhavos'
         or new.tdv2_data#>'{face,anchor,pillar}' is distinct from old.tdv2_data#>'{face,anchor,pillar}'
         or new.tdv2_data->'creation' is distinct from old.tdv2_data->'creation' then
        if not reopened or jsonb_array_length(old.tdv2_data->'investments')<>0 or jsonb_array_length(new.tdv2_data->'investments')<>0 then
          raise exception 'Initial choices require explicit reopening without active investments';
        end if;
      end if;
      if jsonb_array_length(new.tdv2_data->'investments')<jsonb_array_length(old.tdv2_data->'investments')
         or exists(select 1 from jsonb_array_elements(old.tdv2_data->'investments') with ordinality x(entry,n)
                   where entry is distinct from (new.tdv2_data->'investments')->(n::integer-1)) then
        raise exception 'Existing investments must be preserved';
      end if;
    end if;
  elsif new.rules_version=2 then
    if jsonb_array_length(new.tdv2_data->'milestones')<>0
       or coalesce(new.tdv2_data#>>'{progression,allowMilestones}','false')<>'false'
       or coalesce(new.tdv2_data#>>'{progression,allowCreation}','false')<>'false'
       or coalesce(jsonb_array_length(new.tdv2_data->'corrections'),0)<>0 then
      raise exception 'Only a mestre may grant initial Marcos or authorize progression';
    end if;
  end if;
  return new;
end; $$;
revoke all on function private.guard_tdv2_sheet_progression() from public, anon;
grant execute on function private.guard_tdv2_sheet_progression() to authenticated, service_role;
