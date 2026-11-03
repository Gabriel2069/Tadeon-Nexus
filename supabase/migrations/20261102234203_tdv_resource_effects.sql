-- DEC-033: bounded optional modifiers and temporary declarations; no rows rewritten.
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
