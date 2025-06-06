-- ---------------------
-- 🔐 認証・プロフィール関連
-- ---------------------

-- profilesテーブル作成
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  name text,
  introduce text,
  avatar_url text
);

-- profilesテーブルRLS指定（後程直すこと！）
alter table profiles enable row level security;
create policy "プロフィールは誰でも参照可能" on profiles for select using (true);
create policy "プロフィールを更新" on profiles for update using (true);

-- サインアップ時にプロフィールテーブル作成する関数
create function public.handle_new_user()
returns trigger as $$
begin 
  insert into public.profiles (id,email)
  values(new.id,new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- サインアップ時にプロフィールテーブル作成する関数を呼び出すトリガー
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- プロフィール画像のstorage作成
insert into storage.buckets (id, name, public) values ('profile', 'profile', true);

create policy "プロフィール画像は誰でも参照可能"
on storage.objects
for select
using ( bucket_id = 'profile' );

create policy "プロフィール画像はログインユーザーが追加"
on storage.objects
for insert
with check ( bucket_id = 'profile' AND auth.role() = 'authenticated' );

create policy "自身のプロフィール画像を更新"
on storage.objects
for update
with check ( bucket_id = 'profile' AND auth.uid() = owner );

create policy "自身のプロフィール画像を削除"
on storage.objects
for delete
using ( bucket_id = 'profile' AND auth.uid() = owner );


-- ---------------------
-- ✅ TODO機能
-- ---------------------

create table todos (
  id uuid primary key default gen_random_uuid(), -- 一意なID
  user_id uuid references auth.users on delete cascade, -- ユーザーに紐づける
  title text not null, -- タイトル（必須）
  description text, -- 内容（任意）
  status text check (status in ('not_started', 'in_progress', 'completed')) default 'not_started', -- 状態管理
  due_date date, -- 締め切り日
  created_at timestamp with time zone default timezone('utc', now()), -- 作成日時
  updated_at timestamp with time zone default timezone('utc', now()) -- 更新日時
);

alter table todos enable row level security;

-- 自分のTODOだけ参照・操作できるように
create policy "自分のTODOを取得" on todos
for select using (auth.uid() = user_id);

create policy "自分のTODOを追加" on todos
for insert with check (auth.uid() = user_id);

create policy "自分のTODOを更新" on todos
for update using (auth.uid() = user_id);

create policy "自分のTODOを削除" on todos
for delete using (auth.uid() = user_id);