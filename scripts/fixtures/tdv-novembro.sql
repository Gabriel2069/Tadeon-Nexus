-- Banco de ensaio da revisão de novembro. Executar após Fundação VIII.
create or replace function private.tdv2_character_valid(d jsonb)
returns boolean language plpgsql immutable security invoker set search_path='' as $$
declare
  november boolean := coalesce(d#>>'{foundation,revision}' = 'TDV-2026-11-23', false);
  clean jsonb; matrices jsonb; skills jsonb; e jsonb; k text; n numeric;
  m integer; spent integer:=0; credits integer; nx integer; base_nx integer; high_water integer; nx_used integer:=0;
  resource_reinforcements jsonb:='{"pv":0,"pi":0,"pe":0}';
  old_ids jsonb; v integer; expected integer; cap integer; max_resource integer;
begin
  if not d ? 'foundation' then return private.tdv2_legacy_character_valid(d); end if;
  if octet_length(d::text)>8388608 or (not november and d#>>'{foundation,revision}' is distinct from 'VIII') then return false; end if;
  if jsonb_typeof(d#>'{foundation,practices}') is distinct from 'array' or jsonb_array_length(d#>'{foundation,practices}')>40 then return false; end if;
  if november and ((d->'foundation') ? 'legacy' or d#>'{foundation,practices}' <> '[]'::jsonb) then return false; end if;
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
  credits:=case when november then 10+4*m+2*(m/4) else 3*m end;
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
        expected:=case when november then (array[2,3,4,5,8])[v+1] else (array[3,4,5,6,8])[v+1] end;
        if v is null or v>=cap or n<>expected or (v=4 and (coalesce((e->>'transcendent')::boolean,false)=false or coalesce(d#>>'{progression,allowExtraordinary}','false')<>'true')) then return false; end if;
        matrices:=jsonb_set(matrices,array[k],to_jsonb(v+1));
      when 'Alinhavo','Nexo' then
        v:=(skills->>k)::integer; cap:=case when m>=8 then 4 when m>=4 then 3 else 2 end;
        expected:=case when e->>'kind'='Nexo' then 0 when november then (array[2,2,3,4])[v+1] else v+2 end;
        if v is null or v>=cap or n<>expected then return false; end if;
        skills:=jsonb_set(skills,array[k],to_jsonb(v+1));
        if e->>'kind'='Nexo' then nx_used:=nx_used+1; end if;
      when 'Reforço' then
        if k not in ('pv','pi','pe') or n<>(case when november and k='pe' then 1 else 2 end) then return false; end if;
        v:=(resource_reinforcements->>k)::integer+1;
        if v>1+m/4 then return false; end if;
        resource_reinforcements:=jsonb_set(resource_reinforcements,array[k],to_jsonb(v));
      when 'Lavor' then
        if november then return false; end if;
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
    if november then
      max_resource:=max_resource+(case k when 'pv' then 4+m/4 when 'pi' then 3+m/4 else 1 end);
    end if;
    max_resource:=greatest(0,max_resource+coalesce((d->'resourceModifiers'->>k)::integer,0));
    if n is null or n<>trunc(n) or n<0 or n>max_resource then return false; end if;
  end loop;
  if d#>'{crisisMarks}' ? 'surrender' then n:=(d#>>'{crisisMarks,surrender}')::numeric; if n is null or n<>trunc(n) or n<0 or n>3 then return false; end if; end if;
  return true;
exception when invalid_text_representation or numeric_value_out_of_range or invalid_parameter_value then return false;
end; $$;

-- Pin both directions of the dated edition, including writes made by an older client.
create function private.guard_november_revision() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  if (old.tdv2_data#>>'{foundation,revision}' = 'TDV-2026-11-23') is true
       or (new.tdv2_data#>>'{foundation,revision}' = 'TDV-2026-11-23') is true then
    if old.tdv2_data#>>'{foundation,revision}' is distinct from new.tdv2_data#>>'{foundation,revision}' then
      raise exception 'A revisão da personagem deve ser preservada';
    end if;
  end if;
  return new;
end; $$;
revoke all on function private.guard_november_revision() from public,anon;
create trigger preserve_november_revision before update on public.character_sheets
for each row execute function private.guard_november_revision();
