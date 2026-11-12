# YunulosTakip

Aile içi günlük ödül (ödev, kitap, namaz) ve sınav takibi. Tarayıcıda çalışan, derleme gerektirmeyen bir web uygulaması; veriler Supabase'de tutulur.

## Yapı

- `index.html`, `css/`, `js/`: uygulama. `js/config.js` tüm sabitleri ve Supabase adresini içerir.
- `js/repository.js`: Supabase ile konuşan tek katman. `js/store.js`: durum ve eşitleme. `js/views/`: ekranlar.
- `supabase/schema.sql`: tablolar ve erişim kuralları.

## Kurulum

1. Supabase projesinde `supabase/schema.sql` dosyasını çalıştırın.
2. Authentication > Users bölümünden aile hesabını oluşturun ve şema dosyasının sonundaki `insert` satırıyla üye yapın.
3. Klasörü herhangi bir statik sunucuda yayınlayın (yerelde: `python3 -m http.server`).
