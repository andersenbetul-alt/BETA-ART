-- Örnek tohum verisi: tek örnek Q Brief (is_sample=true → girişsiz de okunur).
-- İçerik uydurma değildir: sitedeki yayınlanmış "AI resepsiyonist" yazısının
-- kaynaklı tespitinden türetilmiştir. schema.sql'den SONRA çalıştırın.

insert into public.briefs (slug, title, summary, body_md, published_at, is_sample)
values (
  'ornek-ai-bildirim-zorunlulugu',
  'Yapay zekâ bildirim zorunluluğu yürürlükte — müşteri iletişiminde ne değişti?',
  'AB kaynaklı şeffaflık yükümlülüğü 2 Ağustos 2026''da yürürlüğe girdi; müşteriyle konuşan yapay zekâ artık kendini bildirmek zorunda.',
  E'Ne değişti?\nMüşteriyle etkileşen yapay zekâ sistemleri için bildirim (şeffaflık) yükümlülüğü 2 Ağustos 2026''da yürürlüğe girdi. Arayan ya da yazışan kişi, karşısındakinin yapay zekâ olduğunu bilmek zorunda.\n\nNeden önemli?\nTelefon, sohbet ve resepsiyon otomasyonu kullanan her işletme kapsam içinde. "Fark edilmeyecek kadar doğal" diye pazarlanan çözümler, tam da bu özellik yüzünden uyum riski taşır.\n\nSizi nasıl etkileyebilir?\nMüşteri iletişiminde AI kullanıyorsanız karşılama akışına açık bildirim eklemek gerekir. Kullanmıyorsanız da tedarikçi seçiminde "bildirim özelliği var mı" artık bir eleme sorusudur.\n\nEn büyük risk\nUyumun pazarlamaya kurban edilmesi: bildirimin müşteriyi kaçıracağı korkusuyla sessiz kalmak.\n\nHangi göstergeler izlenmeli?\nYerel denetim pratiği (ilk cezalar/uyarılar) ve tedarikçilerin bildirim özelliğini varsayılan yapıp yapmadığı.\n\nŞimdi sorulacak soru\n"Müşterimle konuşan her otomasyon, kendini bildiriyor mu?"\n\n—\nKaynak ve ayrıntı: QBLOGG, "AI resepsiyonist gerçekte ne kadar tutuyor?"\nhttps://qblogg.com/post.html?slug=ai-resepsiyonist-maliyet (yazının kaynak listesiyle birlikte)\nNot: Bu bir örnek Q Brief''tir; biçimi tanıtmak için yayınlanmıştır. Hukuki görüş değildir.',
  '2026-08-24',
  true
)
on conflict (slug) do nothing;
