-- ============================================================
-- POKOCHAJ ANGIELSKI — Supabase Schema
-- Wklej do: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. Teksty sekcji (key-value)
create table if not exists site_content (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  key text not null,
  value text not null default '',
  updated_at timestamptz default now(),
  unique(section, key)
);

-- 2. Kroki "Jak pracuję"
create table if not exists method_steps (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null,
  title text not null,
  description text not null,
  updated_at timestamptz default now()
);

-- 3. Cennik — główne formaty
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null,
  duration text not null,
  description text not null,
  price text not null,
  price_note text not null default '',
  is_featured boolean default false,
  updated_at timestamptz default now()
);

-- 4. Cennik — pakiety / polecenie
create table if not exists offer_extras (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null,
  label text not null,
  title text not null,
  description text not null,
  price text not null,
  price_note text not null default '',
  updated_at timestamptz default now()
);

-- 5. Opinie
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null,
  quote text not null,
  author text not null,
  role text not null,
  avatar_url text,
  date_label text,
  rating int not null default 5,
  updated_at timestamptz default now()
);

-- Migracja dla istniejących baz (bezpieczna, idempotentna):
alter table reviews add column if not exists avatar_url text;
alter table reviews add column if not exists date_label text;
alter table reviews add column if not exists rating int not null default 5;

-- Storage: bucket na awatary (publiczny odczyt, zapis dla zalogowanych)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "public read avatars" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "auth upload avatars" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "auth update avatars" on storage.objects
  for update using (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "auth delete avatars" on storage.objects
  for delete using (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- 6. FAQ
create table if not exists faq_items (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null,
  question text not null,
  answer text not null,
  updated_at timestamptz default now()
);

-- ============================================================
-- RLS: publiczny odczyt, zapis tylko dla zalogowanych
-- ============================================================

alter table site_content  enable row level security;
alter table method_steps  enable row level security;
alter table offers        enable row level security;
alter table offer_extras  enable row level security;
alter table reviews       enable row level security;
alter table faq_items     enable row level security;

-- Odczyt publiczny (strona główna)
create policy "public read site_content"  on site_content  for select using (true);
create policy "public read method_steps"  on method_steps  for select using (true);
create policy "public read offers"        on offers        for select using (true);
create policy "public read offer_extras"  on offer_extras  for select using (true);
create policy "public read reviews"       on reviews       for select using (true);
create policy "public read faq_items"     on faq_items     for select using (true);

-- Zapis tylko dla zalogowanych (panel admin)
create policy "auth write site_content"  on site_content  for all using (auth.role() = 'authenticated');
create policy "auth write method_steps"  on method_steps  for all using (auth.role() = 'authenticated');
create policy "auth write offers"        on offers        for all using (auth.role() = 'authenticated');
create policy "auth write offer_extras"  on offer_extras  for all using (auth.role() = 'authenticated');
create policy "auth write reviews"       on reviews       for all using (auth.role() = 'authenticated');
create policy "auth write faq_items"     on faq_items     for all using (auth.role() = 'authenticated');

-- ============================================================
-- Dane startowe (kopiuje wireframe)
-- ============================================================

insert into method_steps (sort_order, title, description) values
  (1, 'Diagnoza celu', 'Ustalamy, gdzie i kiedy potrzebujesz angielskiego najbardziej.'),
  (2, 'Praktyka mówienia', 'Skupiamy się na komunikacji i wymowie, nie na teorii bez kontekstu.'),
  (3, 'Feedback po zajęciach', 'Po każdej lekcji dostajesz krótkie podsumowanie i zadania dopasowane do Ciebie.'),
  (4, 'Stały progres', 'Co miesiąc sprawdzamy postęp i dopasowujemy plan do nowych potrzeb.')
on conflict do nothing;

insert into offers (sort_order, duration, description, price, price_note, is_featured) values
  (1, 'Zajęcia 30 min', 'Krótka, intensywna sesja — idealna na regularne ćwiczenie konwersacji.', '60 zł', 'za zajęcia', false),
  (2, 'Zajęcia 45 min', 'Zbalansowany format — czas na konwersację, gramatykę i feedback.', '100 zł', 'za zajęcia', false),
  (3, 'Zajęcia 60 min', 'Pełna godzina — najwięcej czasu na praktyczne mówienie i utrwalenie materiału.', '120 zł', 'za zajęcia', true),
  (4, 'Zajęcia w parach (60 min)', 'Nauka z partnerem lub znajomym — wygodna opcja dla dwóch osób.', '160 zł', '80 zł / osoba', false)
on conflict do nothing;

insert into offer_extras (sort_order, label, title, description, price, price_note) values
  (1, 'Pakiet', '10 zajęć — rabat 10%', 'Kup pakiet 10 dowolnych zajęć i oszczędź 10% na każdym spotkaniu. Ważność pakietu ustalamy indywidualnie.', '-10%', 'od ceny regularnej'),
  (2, 'Dla znajomych', 'Zaproś znajomego — zgarnij darmowe zajęcia', 'Poleć mnie osobie, która zacznie regularne lekcje, a Ty otrzymasz jedno zajęcie gratis.', 'Gratis', '1 zajęcia za polecenie')
on conflict do nothing;

insert into reviews (sort_order, quote, author, role, date_label, rating) values
  (1, 'Po 3 miesiącach przestałam unikać spotkań po angielsku. Lekcje są konkretne i bez niepotrzebnego spięcia.', 'Agnieszka', 'UX Designer', '2 tygodnie temu', 5),
  (2, 'Najlepsze jest to, że po każdej lekcji wiem, co mam robić dalej. W końcu mam system i spokój.', 'Mateusz', 'Programista', 'miesiąc temu', 5),
  (3, 'Miałam duży opór przed mówieniem. Tutaj nie boję się błędów i pierwszy raz czuję, że to ma sens.', 'Karolina', 'Psycholożka', '3 tygodnie temu', 5),
  (4, 'Profesjonalnie i po ludzku. Dużo praktyki, zero nadęcia, dużo wsparcia.', 'Piotr', 'Project Manager', '2 miesiące temu', 5),
  (5, 'Wreszcie nauka skrojona pod mnie, a nie pod podręcznik. Czuję realny postęp z tygodnia na tydzień.', 'Natalia', 'Marketing Manager', 'tydzień temu', 5),
  (6, 'Potrzebowałem angielskiego do pracy w międzynarodowym zespole. Po kilku miesiącach prowadzę spotkania bez stresu.', 'Tomasz', 'Team Lead', 'miesiąc temu', 5)
on conflict do nothing;

insert into faq_items (sort_order, question, answer) values
  (1, 'Czy lekcje są tylko online?', 'Tak, dzięki temu łatwo łączysz naukę z pracą i życiem prywatnym, niezależnie od miasta.'),
  (2, 'Czy mogę odwołać lub przełożyć spotkanie?', 'Tak. Termin możesz przełożyć zgodnie z zasadami pakietu. Wszystko jest jasno opisane.'),
  (3, 'Jakie są formy płatności?', 'Płatność przelewem przed startem pakietu. Szczegóły ustalimy na konsultacji.'),
  (4, 'Kiedy płacę za zajęcia?', 'Płatność z góry, przed rozpoczęciem pakietu. Nie pobieramy zaliczek za pojedyncze zajęcia.'),
  (5, 'W jakich dniach i godzinach odbywają się zajęcia?', 'Terminy ustalamy indywidualnie — dopasowujemy do Twojego grafiku, także weekendy.'),
  (6, 'Czy muszę mieć konkretny poziom, żeby zacząć?', 'Nie. Pracuję z osobami na każdym poziomie — od podstawowego do zaawansowanego.')
on conflict do nothing;

-- ============================================================
-- Opinie — gotowe zapytania do ręcznego zarządzania w SQL Editor
-- (to samo robi panel admina — to alternatywa, gdy wolisz SQL)
-- ============================================================

-- DODAJ jedną opinię (sort_order = numer kolejności; im wyższy, tym dalej):
insert into reviews (sort_order, quote, author, role, date_label, rating, avatar_url) values
  (7, 'Treść opinii klienta.', 'Imię', 'Zawód / rola', '2 tygodnie temu', 5, null);

-- DODAJ na koniec, automatycznie nadając kolejny sort_order:
insert into reviews (sort_order, quote, author, role, date_label, rating)
select coalesce(max(sort_order), 0) + 1,
       'Treść opinii klienta.', 'Imię', 'Zawód / rola', '2 tygodnie temu', 5
from reviews;

-- USUŃ opinię po autorze:
delete from reviews where author = 'Imię';

-- USUŃ opinię po sort_order:
delete from reviews where sort_order = 7;

-- PODGLĄD wszystkich opinii (żeby znaleźć id / sort_order do usunięcia):
select id, sort_order, author, role, rating, date_label from reviews order by sort_order;

-- EDYTUJ istniejącą opinię (np. zmień ocenę / datę / zdjęcie):
update reviews
set rating = 5, date_label = 'miesiąc temu', avatar_url = 'https://...'
where author = 'Imię';
