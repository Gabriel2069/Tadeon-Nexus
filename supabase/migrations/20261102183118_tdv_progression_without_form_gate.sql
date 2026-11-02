-- DEC-032: numerical sealing without a mandatory writing form; master-only regressions.
create or replace function private.tdv2_character_valid(d jsonb)
returns boolean language plpgsql immutable security invoker set search_path = '' as $$
declare
  k text; v numeric; imp integer; cad integer; nex integer; las integer;
  spent integer := 0; milestones integer; entry jsonb; current_value integer;
  matrix_values jsonb; grades jsonb; skill_count integer; ready boolean;
begin
  if d is null or jsonb_typeof(d) is distinct from 'object' or d->>'version' is distinct from '2' or jsonb_typeof(d->'ready') is distinct from 'boolean' or octet_length(d::text)>8388608 then return false; end if;
  ready := (d->>'ready')::boolean;
  matrix_values := d->'matrices'; grades := d->'alinhavos';
  if jsonb_typeof(matrix_values) is distinct from 'object' or (select count(*) from jsonb_object_keys(matrix_values))<>4 or jsonb_typeof(grades) is distinct from 'object' then return false; end if;
  foreach k in array array['Ímpeto','Cadência','Nexo','Lastro'] loop
    v := (matrix_values->>k)::numeric;
    if v is null or v<0 or v>5 or v<>trunc(v) then return false; end if;
  end loop;
  if ready and (select array_agg(value::integer order by value::integer) from jsonb_each_text(matrix_values)) <> array[2,2,3,3] then return false; end if;
  imp:=(matrix_values->>'Ímpeto')::integer; cad:=(matrix_values->>'Cadência')::integer; nex:=(matrix_values->>'Nexo')::integer; las:=(matrix_values->>'Lastro')::integer;
  select count(*) into skill_count from jsonb_object_keys(grades);
  if skill_count<>21 then return false; end if;
  foreach k in array array['Atletismo','Luta','Pontaria','Furtividade','Engenharia','Ciências','Medicina','Ofício','Percepção','Sobrevivência','Investigação','Condução','Diplomacia','Persuasão','Intimidação','Encenação','Sociedade','Tática','Iniciativa','Canalização','Selagem'] loop
    v:=(grades->>k)::numeric;
    if v is null or v<0 or v>2 or v<>trunc(v) then return false; end if;
  end loop;
  if ready and ((select count(*) from jsonb_each_text(grades) where value::integer=2)<>2 or (select count(*) from jsonb_each_text(grades) where value::integer=1)<>4) then return false; end if;
  if jsonb_typeof(d->'milestones') is distinct from 'array' or jsonb_typeof(d->'investments') is distinct from 'array' then return false; end if;
  milestones:=jsonb_array_length(d->'milestones');
  if milestones>20 or jsonb_array_length(d->'investments')>100 then return false; end if;
  for entry in select value from jsonb_array_elements(d->'milestones') loop
    if coalesce(btrim(entry->>'event'),'')='' or coalesce(btrim(entry->>'incorporation'),'')='' then return false; end if;
  end loop;
  for entry in select value from jsonb_array_elements(d->'investments') loop
    if not ready or coalesce(btrim(entry->>'reason'),'')='' then return false; end if;
    k:=entry->>'target';v:=(entry->>'cost')::numeric;
    if v is null or v<>trunc(v) then return false; end if;
    case entry->>'kind'
      when 'Matriz' then
        current_value:=case k when 'Ímpeto' then imp when 'Cadência' then cad when 'Nexo' then nex when 'Lastro' then las else null end;
        if current_value is null or current_value>=5 or v<>current_value+3 or (current_value=4 and coalesce((entry->>'transcendent')::boolean,false)=false) then return false; end if;
        case k when 'Ímpeto' then imp:=imp+1; when 'Cadência' then cad:=cad+1; when 'Nexo' then nex:=nex+1; when 'Lastro' then las:=las+1; end case;
      when 'Alinhavo' then
        current_value:=(grades->>k)::integer;
        if current_value is null or current_value>=4 or v<>2 then return false; end if;
        grades:=jsonb_set(grades,array[k],to_jsonb(current_value+1));
      when 'Lavor' then if v not in (4,6) or coalesce(btrim(k),'')='' then return false; end if;
      when 'Ampliação' then if v<3 or v>7 or coalesce(btrim(k),'')='' then return false; end if;
      else return false;
    end case;
    spent:=spent+v::integer;
  end loop;
  if spent>milestones*2 then return false; end if;
  foreach k in array array['pv','pi','pe'] loop
    v:=(d->'resources'->>k)::numeric;
    if v is null or v<0 or v<>trunc(v) or v>(case k when 'pv' then 6+2*imp when 'pi' then 6+nex+las else 5+nex+las end) then return false; end if;
  end loop;
  v:=(d->>'equilibrium')::numeric;if v is null or v<>trunc(v) or v < -10 or v>10 then return false; end if;
  v:=(d->>'tension')::numeric;if v is null or v<>trunc(v) or v < -3 or v>3 then return false; end if;
  if jsonb_typeof(d->'face') is distinct from 'object' or jsonb_typeof(d->'face'->'links') is distinct from 'array' or jsonb_typeof(d->'face'->'anchor') is distinct from 'object' or jsonb_typeof(d->'face'->'mark') is distinct from 'object' or jsonb_typeof(d->'scene') is distinct from 'object' then return false; end if;
  if jsonb_typeof(d->'guard') is distinct from 'object' then return false; end if;
  v:=coalesce((d->'guard'->>'protection')::numeric,0);
  if v<>trunc(v) or v<0 or v>2 then return false; end if;
  if v>0 and (coalesce(btrim(d->'guard'->>'protectionSource'),'')='' or coalesce(btrim(d->'guard'->>'totalCover'),'')<>'') then return false; end if;
  v:=coalesce((d->'guard'->>'modifier')::numeric,0);
  if v<>trunc(v) or abs(v)>100 or (v<>0 and coalesce(btrim(d->'guard'->>'source'),'')='') then return false; end if;
  return true;
exception when invalid_text_representation or numeric_value_out_of_range or invalid_parameter_value then return false;
end; $$;
-- DEC-031: permissions belong to the stored pre-update row, never to a submitted grant.
-- No row is rewritten. Existing RLS, CAS, validation and investment costs remain authorities.
create or replace function private.guard_tdv2_sheet_progression()
returns trigger language plpgsql security invoker set search_path = '' as $$
declare is_master boolean; delegated boolean := false;
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
    if new.tdv2_data->'milestones' is distinct from old.tdv2_data->'milestones' then
      if not delegated or jsonb_array_length(new.tdv2_data->'milestones')<>jsonb_array_length(old.tdv2_data->'milestones')+1
         or exists(select 1 from jsonb_array_elements(old.tdv2_data->'milestones') with ordinality x(entry,n)
                   where entry is distinct from (new.tdv2_data->'milestones')->(n::integer-1)) then
        raise exception 'Marcos require recognition by a mestre or a previously authorized single advance';
      end if;
    end if;
    if old.tdv2_data->>'ready'='false' and (
      exists(select 1 from jsonb_each_text(old.tdv2_data->'matrices') x where (new.tdv2_data->'matrices'->>x.key)::integer < x.value::integer)
      or exists(select 1 from jsonb_each_text(old.tdv2_data->'alinhavos') x where coalesce((new.tdv2_data->'alinhavos'->>x.key)::integer,0) < x.value::integer)
    ) then raise exception 'Only a mestre may reverse initial capability advances'; end if;
    if old.tdv2_data->>'ready'='true' then
      if new.tdv2_data->>'ready'<>'true' then raise exception 'A completed character stays completed'; end if;
      if new.tdv2_data->'matrices' is distinct from old.tdv2_data->'matrices'
         or new.tdv2_data->'alinhavos' is distinct from old.tdv2_data->'alinhavos'
         or new.tdv2_data#>'{face,anchor,pillar}' is distinct from old.tdv2_data#>'{face,anchor,pillar}'
         or new.tdv2_data#>'{creation,familiarities}' is distinct from old.tdv2_data#>'{creation,familiarities}' then
        raise exception 'Only a mestre may revise initial choices';
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
