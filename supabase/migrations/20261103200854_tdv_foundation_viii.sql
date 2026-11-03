-- DEC-037: Fundação Mecânica VIII; additive, versioned and no row rewrite.
create or replace function private.tdv2_legacy_character_valid(d jsonb)
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
  if d ? 'resourceModifiers' then
    if jsonb_typeof(d->'resourceModifiers') is distinct from 'object' or (select count(*) from jsonb_object_keys(d->'resourceModifiers'))<>3 then return false; end if;
    foreach k in array array['pv','pi','pe'] loop
      if jsonb_typeof(d->'resourceModifiers'->k) is distinct from 'number' then return false; end if;
      v:=(d->'resourceModifiers'->>k)::numeric;
      if v is null or v<>trunc(v) or abs(v)>10000 then return false; end if;
    end loop;
  end if;
  if d ? 'temporaryEffects' then
    if jsonb_typeof(d->'temporaryEffects') is distinct from 'array' or jsonb_array_length(d->'temporaryEffects')>50 then return false; end if;
    for entry in select value from jsonb_array_elements(d->'temporaryEffects') loop
      if jsonb_typeof(entry) is distinct from 'object' or jsonb_typeof(entry->'id') is distinct from 'string' or jsonb_typeof(entry->'note') is distinct from 'string' or char_length(entry->>'note')>12000 or not coalesce((entry->>'target')=any(array['Ímpeto','Cadência','Nexo','Lastro','Atletismo','Luta','Pontaria','Furtividade','Engenharia','Ciências','Medicina','Ofício','Percepção','Sobrevivência','Investigação','Condução','Diplomacia','Persuasão','Intimidação','Encenação','Sociedade','Tática','Iniciativa','Canalização','Selagem']),false) or coalesce(entry->>'kind','') not in ('Proveito','Desproveito','Bônus') then return false; end if;
      if jsonb_typeof(entry->'value') is distinct from 'number' or coalesce(btrim(entry->>'id'),'')='' then return false; end if;
      v:=(entry->>'value')::numeric;
      if v is null or v<>trunc(v) or abs(v)>100 or (entry->>'kind'='Bônus' and v=0) or (entry->>'kind'<>'Bônus' and v<>1) then return false; end if;
    end loop;
  end if;
  if d ? 'crisisMarks' then
    if jsonb_typeof(d->'crisisMarks') is distinct from 'object' or (select count(*) from jsonb_object_keys(d->'crisisMarks'))<>2 then return false; end if;
    foreach k in array array['dying','collapse'] loop
      if jsonb_typeof(d->'crisisMarks'->k) is distinct from 'number' then return false; end if;
      v:=(d->'crisisMarks'->>k)::numeric;
      if v is null or v<>trunc(v) or v<0 or v>3 then return false; end if;
    end loop;
  end if;
  foreach k in array array['pv','pi','pe'] loop
    v:=(d->'resources'->>k)::numeric;
    if v is null or v<0 or v<>trunc(v) or v>greatest(0,(case k when 'pv' then 6+2*imp when 'pi' then 6+nex+las else 5+nex+las end)+coalesce((d->'resourceModifiers'->>k)::numeric,0)) then return false; end if;
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

-- Foundation VIII is opt-in per existing sheet. No stored row is rewritten.
-- Keep the constraint function OID: historical payloads use their original validator.
create or replace function private.tdv2_character_valid(d jsonb)
returns boolean language plpgsql immutable security invoker set search_path='' as $$
declare
  clean jsonb; matrices jsonb; skills jsonb; e jsonb; k text; n numeric;
  m integer; spent integer:=0; credits integer; nx integer; base_nx integer; high_water integer; nx_used integer:=0;
  resource_reinforcements jsonb:='{"pv":0,"pi":0,"pe":0}';
  old_ids jsonb; v integer; expected integer; cap integer; max_resource integer;
begin
  if not d ? 'foundation' then return private.tdv2_legacy_character_valid(d); end if;
  if octet_length(d::text)>8388608 or d#>>'{foundation,revision}' is distinct from 'VIII' then return false; end if;
  if jsonb_typeof(d#>'{foundation,practices}') is distinct from 'array' or jsonb_array_length(d#>'{foundation,practices}')>40 then return false; end if;
  -- Reuse common bounds (resource modifiers, effects, face, guard) independently of the new constitution.
  clean:=d-'foundation';
  clean:=jsonb_set(clean,'{matrices}','{"Ímpeto":2,"Cadência":3,"Nexo":3,"Lastro":2}');
  select jsonb_object_agg(key,case when key in ('Engenharia','Investigação') then 2 when key in ('Atletismo','Percepção','Sociedade','Iniciativa') then 1 else 0 end) into skills from jsonb_each(d->'alinhavos');
  clean:=jsonb_set(clean,'{alinhavos}',skills);
  clean:=jsonb_set(clean,'{investments}','[]');
  clean:=jsonb_set(clean,'{milestones}','[]');
  clean:=jsonb_set(clean,'{resources}','{"pv":0,"pi":0,"pe":0}');
  if clean ? 'crisisMarks' then clean:=jsonb_set(clean,'{crisisMarks}',(clean->'crisisMarks')-'surrender'); end if;
  if not private.tdv2_legacy_character_valid(clean) then return false; end if;
  matrices:=d->'matrices'; skills:=d->'alinhavos';
  if jsonb_typeof(matrices) is distinct from 'object' or (select count(*) from jsonb_object_keys(matrices))<>4 then return false; end if;
  foreach k in array array['Ímpeto','Cadência','Nexo','Lastro'] loop
    n:=(matrices->>k)::numeric;
    if n is null or n<>trunc(n) or n<0 or n>5 then return false; end if;
  end loop;
  foreach k in array array['Atletismo','Luta','Pontaria','Furtividade','Engenharia','Ciências','Medicina','Ofício','Percepção','Sobrevivência','Investigação','Condução','Diplomacia','Persuasão','Intimidação','Encenação','Sociedade','Tática','Iniciativa','Canalização','Selagem'] loop
    n:=(skills->>k)::numeric;
    if n is null or n<>trunc(n) or n<0 or n>4 then return false; end if;
  end loop;
  base_nx:=(matrices->>'Nexo')::integer;
  n:=(d#>>'{foundation,nexoHighWater}')::numeric;
  if n is null or n<>trunc(n) or n<0 or n>5 then return false; end if;
  high_water:=n::integer;
  if not d#>'{foundation}' ? 'legacy' then
    if exists(select 1 from jsonb_each_text(matrices) where value::integer>3)
       or (select count(*) from jsonb_each_text(matrices) where value::integer=0)>1
       or (select sum(value::integer) from jsonb_each_text(matrices))>8
       or exists(select 1 from jsonb_each_text(skills) where value::integer>2)
       or (select sum(value::integer) from jsonb_each_text(skills))>6+2*base_nx then return false; end if;
    if d->>'ready'='true' and ((select sum(value::integer) from jsonb_each_text(matrices))<>8 or (select sum(value::integer) from jsonb_each_text(skills))<>6+2*base_nx) then return false; end if;
  else
    if jsonb_typeof(d#>'{foundation,legacy,investmentIds}') is distinct from 'array' or jsonb_typeof(d#>'{foundation,legacy,source}') is distinct from 'string' then return false; end if;
    n:=(d#>>'{foundation,legacy,spent}')::numeric;
    if n is null or n<0 or n<>trunc(n) then return false; end if;
    spent:=n::integer;
  end if;
  if jsonb_typeof(d->'milestones') is distinct from 'array' or jsonb_typeof(d->'investments') is distinct from 'array' then return false; end if;
  m:=jsonb_array_length(d->'milestones');
  if m>20 or jsonb_array_length(d->'investments')>100 or (d->>'ready'='false' and jsonb_array_length(d->'investments')>0) then return false; end if;
  for e in select value from jsonb_array_elements(d->'milestones') loop
    if coalesce(btrim(e->>'event'),'')='' or coalesce(btrim(e->>'incorporation'),'')='' then return false; end if;
  end loop;
  credits:=3*m;
  for e in select value from jsonb_array_elements(d#>'{foundation,practices}') loop
    n:=(e->>'pu')::numeric; v:=(e->>'interval')::integer;
    if n not in (1,2) or n is null or v is null or v<0 or v>19 or v>m or coalesce(btrim(e->>'name'),'')='' or coalesce(e->>'id','')='' then return false; end if;
    credits:=credits+n::integer;
  end loop;
  if exists(select 1 from jsonb_array_elements(d#>'{foundation,practices}') p group by p->>'interval' having sum((p->>'pu')::integer)>2)
    or (select count(*) from jsonb_array_elements(d#>'{foundation,practices}'))<>(select count(distinct p->>'id') from jsonb_array_elements(d#>'{foundation,practices}') p) then return false; end if;
  old_ids:=coalesce(d#>'{foundation,legacy,investmentIds}','[]');
  for e in select value from jsonb_array_elements(d->'investments') loop
    if old_ids ? (e->>'id') then continue; end if;
    if coalesce(btrim(e->>'reason'),'')='' or coalesce(btrim(e->>'target'),'')='' then return false; end if;
    n:=(e->>'cost')::numeric; k:=e->>'target';
    if n is null or n<>trunc(n) or n<0 or n>1000 then return false; end if;
    case e->>'kind'
      when 'Matriz' then
        v:=(matrices->>k)::integer; cap:=case when m>=16 then 5 when m>=4 then 4 else 3 end;
        expected:=(array[3,4,5,6,8])[v+1];
        if v is null or v>=cap or n<>expected or (v=4 and (coalesce((e->>'transcendent')::boolean,false)=false or coalesce(d#>>'{progression,allowExtraordinary}','false')<>'true')) then return false; end if;
        matrices:=jsonb_set(matrices,array[k],to_jsonb(v+1));
      when 'Alinhavo','Nexo' then
        v:=(skills->>k)::integer; cap:=case when m>=8 then 4 when m>=4 then 3 else 2 end;
        expected:=case when e->>'kind'='Nexo' then 0 else v+2 end;
        if v is null or v>=cap or n<>expected then return false; end if;
        skills:=jsonb_set(skills,array[k],to_jsonb(v+1));
        if e->>'kind'='Nexo' then nx_used:=nx_used+1; end if;
      when 'Reforço' then
        if k not in ('pv','pi','pe') or n<>2 then return false; end if;
        v:=(resource_reinforcements->>k)::integer+1;
        if v>1+m/4 then return false; end if;
        resource_reinforcements:=jsonb_set(resource_reinforcements,array[k],to_jsonb(v));
      when 'Lavor' then
        if n not in (4,6) and not (n>=8 and m>=16 and coalesce((e->>'transcendent')::boolean,false) and coalesce(d#>>'{progression,allowExtraordinary}','false')='true') then return false; end if;
      else return false;
    end case;
    spent:=spent+n::integer;
  end loop;
  nx:=(matrices->>'Nexo')::integer;
  if nx_used>2*(greatest(high_water,nx)-base_nx) or spent>credits then return false; end if;
  foreach k in array array['pv','pi','pe'] loop
    n:=(d->'resources'->>k)::numeric;
    max_resource:=case k when 'pv' then 2*(4+m)+2*(matrices->>'Ímpeto')::integer+2*(resource_reinforcements->>'pv')::integer when 'pi' then ceil(1.75*(3+m))::integer+2*(matrices->>'Lastro')::integer+2*(resource_reinforcements->>'pi')::integer else 5+m+2*(matrices->>'Cadência')::integer+(resource_reinforcements->>'pe')::integer end;
    max_resource:=greatest(0,max_resource+coalesce((d->'resourceModifiers'->>k)::integer,0));
    if n is null or n<>trunc(n) or n<0 or n>max_resource then return false; end if;
  end loop;
  if d#>'{crisisMarks}' ? 'surrender' then n:=(d#>>'{crisisMarks,surrender}')::numeric; if n is null or n<>trunc(n) or n<0 or n>3 then return false; end if; end if;
  return true;
exception when invalid_text_representation or numeric_value_out_of_range or invalid_parameter_value then return false;
end; $$;
revoke all on function private.tdv2_legacy_character_valid(jsonb) from public,anon;
grant execute on function private.tdv2_legacy_character_valid(jsonb) to authenticated,service_role;
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
  if new.rules_version=2 and (new.tdv2_data ? 'foundation' or (tg_op='UPDATE' and old.tdv2_data ? 'foundation')) then
    if tg_op='UPDATE' and old.tdv2_data ? 'foundation' then
      if old.tdv2_data->>'ready'='false' and new.tdv2_data->>'ready'='true' and (new.tdv2_data#>>'{foundation,nexoHighWater}')::integer<>(new.tdv2_data#>>'{matrices,Nexo}')::integer then raise exception 'Selar a criação fixa o crédito inicial de Nexo'; end if;
      if new.tdv2_data->'foundation' is null then raise exception 'Atualize o aplicativo antes de gravar esta ficha'; end if;
      if new.tdv2_data#>'{foundation,legacy}' is distinct from old.tdv2_data#>'{foundation,legacy}'
        or new.tdv2_data#>'{foundation,practices}' is distinct from old.tdv2_data#>'{foundation,practices}'
        or new.tdv2_data->'crisisMarks' is distinct from old.tdv2_data->'crisisMarks' then raise exception 'Somente o Mestre pode conceder Práticas, revisar conversão ou reconhecer Marcas'; end if;
      if (new.tdv2_data#>>'{foundation,nexoHighWater}')::integer > greatest((old.tdv2_data#>>'{foundation,nexoHighWater}')::integer,(new.tdv2_data#>>'{matrices,Nexo}')::integer+(select count(*) from jsonb_array_elements(new.tdv2_data->'investments') e where e->>'kind'='Matriz' and e->>'target'='Nexo' and not coalesce(new.tdv2_data#>'{foundation,legacy,investmentIds}','[]') ? (e->>'id')))
        or ((old.tdv2_data->>'ready')='true' and (new.tdv2_data#>>'{foundation,nexoHighWater}')::integer < (old.tdv2_data#>>'{foundation,nexoHighWater}')::integer) then raise exception 'Crédito permanente de Nexo inválido'; end if;
    else
      if new.tdv2_data#>'{foundation,legacy}' is not null or (tg_op='UPDATE' and old.tdv2_data->>'ready'='true') or coalesce(jsonb_array_length(new.tdv2_data#>'{foundation,practices}'),0)>0 then raise exception 'Adaptação e concessões exigem Mestre'; end if;
      if (new.tdv2_data#>>'{foundation,nexoHighWater}')::integer > (new.tdv2_data#>>'{matrices,Nexo}')::integer then raise exception 'Crédito inicial de Nexo inválido'; end if;
    end if;
  end if;

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
    if old.tdv2_data->>'ready'='false' and not new.tdv2_data ? 'foundation' and (
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
       or coalesce(new.tdv2_data#>>'{progression,allowExtraordinary}','false')<>'false'
       or coalesce(jsonb_array_length(new.tdv2_data->'corrections'),0)<>0 then
      raise exception 'Only a mestre may grant initial Marcos or authorize progression';
    end if;
  end if;
  return new;
end; $$;
revoke all on function private.guard_tdv2_sheet_progression() from public, anon;
grant execute on function private.guard_tdv2_sheet_progression() to authenticated, service_role;

-- Round renewal and every subsequent scene edit respect actual exhaustion.
create or replace function private.tdv2_master_revision()
returns trigger language plpgsql security invoker set search_path='' as $$
declare p jsonb; c jsonb; participants jsonb:='[]'; exhausted boolean;
begin
  if jsonb_typeof(new.tdv2_state->'participants')='array' then
    for p in select value from jsonb_array_elements(new.tdv2_state->'participants') loop
      select tdv2_data into c from public.character_sheets where id::text=p->>'sheetId' and rules_version=2;
      if c ? 'foundation' then
        exhausted:=c#>>'{resources,pe}'='0' or exists(select 1 from jsonb_array_elements(c->'conditions') i where i->>'name'='Sucumbindo');
        p:=p||jsonb_build_object('maxImpulses',case when exhausted then 1 else 2 end,'ordinaryResponse',not exhausted);
        if exhausted then p:=p||jsonb_build_object('impulses',least(1,(p->>'impulses')::integer),'response',false); end if;
      end if;
      participants:=participants||jsonb_build_array(p);
    end loop;
    new.tdv2_state:=jsonb_set(new.tdv2_state,'{participants}',participants);
  end if;
  if new.tdv2_state is distinct from old.tdv2_state then new.tdv2_revision:=old.tdv2_revision+1;
  else new.tdv2_revision:=old.tdv2_revision; end if;
  return new;
end; $$;

-- Narrow private bridge: a permitted sheet update may restrict its already-linked
-- participants. It cannot choose a scene, reveal private fields or restore spent actions.
create or replace function private.sync_tdv2_extreme_economy()
returns trigger language plpgsql security definer set search_path='' as $$
declare exhausted boolean;
begin
  if new.rules_version<>2 or not new.tdv2_data ? 'foundation' then return new; end if;
  if auth.uid() is not null and new.owner_id is distinct from auth.uid() and not exists(select 1 from public.user_roles where user_id=auth.uid() and role='mestre'::public.app_role) then raise exception 'Ficha sem autorização'; end if;
  if old.tdv2_data#>'{resources,pe}' is not distinct from new.tdv2_data#>'{resources,pe}' and old.tdv2_data->'conditions' is not distinct from new.tdv2_data->'conditions' and old.tdv2_data ? 'foundation' then return new; end if;
  exhausted:=new.tdv2_data#>>'{resources,pe}'='0' or exists(select 1 from jsonb_array_elements(new.tdv2_data->'conditions') i where i->>'name'='Sucumbindo');
  update public.game_settings g set tdv2_state=jsonb_set(g.tdv2_state,'{participants}',(
    select jsonb_agg(case when p->>'sheetId'=new.id::text then p||jsonb_build_object('maxImpulses',case when exhausted then 1 else 2 end,'ordinaryResponse',not exhausted)||case when exhausted then jsonb_build_object('impulses',least(1,(p->>'impulses')::integer),'response',false) else '{}'::jsonb end else p end)
    from jsonb_array_elements(g.tdv2_state->'participants') p))
  where jsonb_typeof(g.tdv2_state->'participants')='array' and g.tdv2_state->'participants' @> jsonb_build_array(jsonb_build_object('sheetId',new.id::text));
  return new;
end; $$;
revoke all on function private.sync_tdv2_extreme_economy() from public,anon,authenticated;
create trigger tdv2_extreme_economy after update of tdv2_data on public.character_sheets for each row execute function private.sync_tdv2_extreme_economy();

-- One authorized action commits the character and scene under both expected revisions.
create or replace function public.apply_tdv2_scene_action(p_sheet_id uuid,p_sheet_updated_at timestamptz,p_character jsonb,p_settings_id uuid,p_scene_revision bigint,p_scene jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare stamp timestamptz; rev bigint; scene jsonb;
begin
  if auth.uid() is null or not exists(select 1 from public.user_roles where user_id=auth.uid() and role='mestre'::public.app_role) then raise exception 'Somente o Mestre pode aplicar uma ação de condução'; end if;
  select updated_at into stamp from public.character_sheets where id=p_sheet_id and rules_version=2 for update;
  if not found or stamp is distinct from p_sheet_updated_at then raise exception 'A ficha mudou; releia antes de aplicar a ação' using errcode='40001'; end if;
  select tdv2_revision into rev from public.game_settings where id=p_settings_id for update;
  if not found or rev is distinct from p_scene_revision then raise exception 'A cena mudou; releia antes de aplicar a ação' using errcode='40001'; end if;
  if not private.tdv2_character_valid(p_character) or jsonb_typeof(p_scene) is distinct from 'object' or p_scene->>'version' is distinct from '2' then raise exception 'Formato inválido da ação'; end if;
  update public.character_sheets set tdv2_data=p_character where id=p_sheet_id returning updated_at into stamp;
  update public.game_settings set tdv2_state=p_scene where id=p_settings_id returning tdv2_revision,tdv2_state into rev,scene;
  return jsonb_build_object('sheetUpdatedAt',stamp,'sceneRevision',rev,'scene',scene);
end; $$;
revoke all on function public.apply_tdv2_scene_action(uuid,timestamptz,jsonb,uuid,bigint,jsonb) from public,anon;
grant execute on function public.apply_tdv2_scene_action(uuid,timestamptz,jsonb,uuid,bigint,jsonb) to authenticated;
