# WEB-2026-005 Eve Slack Agent — Mimari

## Kaynak ağacı

```
agents/eve-slack-agent/
├── agent/
│   ├── agent.ts            Model seçimi + profil yükleme (23 satır)
│   ├── instructions.md     Yedek talimat (6 satır)
│   ├── channels/
│   │   └── slack.ts        Slack webhook handler
│   ├── profiles/
│   │   ├── hxi-music.md    HXI müzik botu kimliği (59 satır)
│   │   └── naviar-consult.md  Naviar danışmanlık botu (17 satır, taslak)
│   ├── skills/
│   │   ├── proje-on-degerlendirme.md
│   │   └── teknik-format.md
│   └── tools/
│       └── get_weather.ts  Örnek araç
├── package.json            v0.0.0
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.json
```

## Çalışma şekli

1. Slack'ten webhook gelir → eve çalışır
2. `AGENT_PROFILE` env değişkenine göre profil dosyası yüklenir
3. Profil botun kimliğini, ses tonunu ve davranış kurallarını belirler
4. Aynı kod tabanından farklı Vercel projeleri oluşturulur

## Geliştirme

```bash
cd agents/eve-slack-agent
pnpm install
vercel link   # ilgili projeyi seç
vercel env pull
AGENT_PROFILE=hxi-music pnpm dev
```

## Teknoloji

| Alan | Değer |
|---|---|
| Framework | Eve (eve.dev) |
| Deploy | Vercel |
| Dil | TypeScript |
| Paket yöneticisi | pnpm |
