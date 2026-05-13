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
  updated_at timestamptz default now()
);

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

insert into reviews (sort_order, quote, author, role) values
  (1, 'Po 3 miesiącach przestałam unikać spotkań po angielsku. Lekcje są konkretne i bez niepotrzebnego spięcia.', 'Agnieszka', 'UX Designer'),
  (2, 'Najlepsze jest to, że po każdej lekcji wiem, co mam robić dalej. W końcu mam system i spokój.', 'Mateusz', 'Programista'),
  (3, 'Miałam duży opór przed mówieniem. Tutaj nie boję się błędów i pierwszy raz czuję, że to ma sens.', 'Karolina', 'Psycholożka'),
  (4, 'Profesjonalnie i po ludzku. Dużo praktyki, zero nadęcia, dużo wsparcia.', 'Piotr', 'Project Manager')
on conflict do nothing;

insert into faq_items (sort_order, question, answer) values
  (1, 'Czy lekcje są tylko online?', 'Tak, dzięki temu łatwo łączysz naukę z pracą i życiem prywatnym, niezależnie od miasta.'),
  (2, 'Czy mogę odwołać lub przełożyć spotkanie?', 'Tak. Termin możesz przełożyć zgodnie z zasadami pakietu. Wszystko jest jasno opisane.'),
  (3, 'Jakie są formy płatności?', 'Płatność przelewem przed startem pakietu. Szczegóły ustalimy na konsultacji.'),
  (4, 'Kiedy płacę za zajęcia?', 'Płatność z góry, przed rozpoczęciem pakietu. Nie pobieramy zaliczek za pojedyncze zajęcia.'),
  (5, 'W jakich dniach i godzinach odbywają się zajęcia?', 'Terminy ustalamy indywidualnie — dopasowujemy do Twojego grafiku, także weekendy.'),
  (6, 'Czy muszę mieć konkretny poziom, żeby zacząć?', 'Nie. Pracuję z osobami na każdym poziomie — od podstawowego do zaawansowanego.')
on conflict do nothing;
