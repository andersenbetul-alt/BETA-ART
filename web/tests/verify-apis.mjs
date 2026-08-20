/**
 * Canlı API doğrulaması.
 *
 * Entur ve MET sorguları geliştirme ortamından test edilemedi (ağ politikası
 * o adresleri engelliyor). Bu betik ikisini de gerçek sorgularla dener ve
 * yanıtın BEKLENEN ALANLARI içerip içermediğini kontrol eder — 200 dönmesi
 * yetmez, şema tutmalı.
 *
 *   npm run verify:apis
 */

const CLIENT = process.env.ENTUR_CLIENT_NAME ?? 'cobban-verify';
const UA = process.env.MET_USER_AGENT ?? 'cobban-verify/0.1 hei@cobban.com';

let failed = 0;
const ok = (m) => console.log(`✅ ${m}`);
const bad = (m, detail) => { failed++; console.log(`❌ ${m}`); if (detail) console.log(`   ${detail}`); };

/**
 * Kurumsal ağlar ve sandbox'lar da 403 döndürür. Bunu sağlayıcının reddi
 * sanmak yanlış teşhise götürür — gövdeye bakıp ayır.
 */
function isNetworkBlock(status, body) {
  return status === 403 && /allowlist|egress|proxy|blocked|forbidden by/i.test(body);
}

/* ------------------------------------------------------------------ Entur */

const TRIP_QUERY = `
query Trip($from: String!, $to: String!, $when: DateTime!, $n: Int!) {
  trip(from: { place: $from }, to: { place: $to }, dateTime: $when,
       numTripPatterns: $n, maxPreTransitWalkDistance: 1500) {
    tripPatterns {
      expectedStartTime expectedEndTime duration
      legs {
        mode expectedStartTime expectedEndTime realtime
        line { publicCode name }
        fromPlace { name } toPlace { name }
        serviceJourney { estimatedCalls { cancellation } }
      }
    }
  }
}`;

console.log('\n── Entur JourneyPlanner v3 ──');
try {
  const res = await fetch('https://api.entur.io/journey-planner/v3/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'ET-Client-Name': CLIENT },
    body: JSON.stringify({
      query: TRIP_QUERY,
      variables: {
        from: 'NSR:StopPlace:548',    // Bergen
        to: 'NSR:StopPlace:60298',    // Stavanger
        when: new Date().toISOString(),
        n: 3,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    isNetworkBlock(res.status, body)
      ? bad('Ağ engeli — istek Entur\'a hiç ulaşmadı',
            'Sorgu değil, ağın kendisi engelliyor. Başka bir ağdan dene.')
      : bad(`HTTP ${res.status}`, body.slice(0, 300));
  } else {
    const json = await res.json();
    if (json.errors?.length) {
      // En sık hata: alan adı değişmiş veya argüman kaldırılmış.
      bad('GraphQL hatası — sorgu şemayla uyuşmuyor',
          json.errors.map((e) => e.message).join('\n   '));
      console.log('   Gezginle düzelt: https://api.entur.io/graphql-explorer/journey-planner-v3');
    } else {
      const patterns = json.data?.trip?.tripPatterns ?? [];
      if (patterns.length === 0) {
        bad('Sorgu çalıştı ama sonuç boş', 'Gece yarısı olabilir; gündüz tekrar dene.');
      } else {
        ok(`${patterns.length} seçenek döndü`);
        const leg = patterns[0].legs?.[0];
        for (const [field, value] of Object.entries({
          expectedStartTime: patterns[0].expectedStartTime,
          duration: patterns[0].duration,
          'legs[0].mode': leg?.mode,
          'legs[0].fromPlace.name': leg?.fromPlace?.name,
          'legs[0].realtime': leg?.realtime,
        })) {
          value === undefined ? bad(`alan eksik: ${field}`) : ok(`${field} = ${value}`);
        }
        const hasCancellation = leg?.serviceJourney?.estimatedCalls !== undefined;
        hasCancellation
          ? ok('iptal bilgisi (estimatedCalls.cancellation) mevcut')
          : bad('iptal bilgisi gelmiyor', 'lib/entur.ts içindeki cancelled alanı hep false kalır');
      }
    }
  }
} catch (error) {
  bad('Bağlantı kurulamadı', String(error));
}

/* -------------------------------------------------------------------- MET */

console.log('\n── MET Norway Locationforecast 2.0 ──');
try {
  const res = await fetch(
    'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60.3913&lon=5.3221',
    { headers: { 'User-Agent': UA } },
  );

  if (!res.ok) {
    const body = await res.text();
    if (isNetworkBlock(res.status, body)) {
      bad('Ağ engeli — istek MET\'e hiç ulaşmadı',
          'Sorgu değil, ağın kendisi engelliyor. Başka bir ağdan dene.');
    } else if (res.status === 403) {
      bad('403 — MET User-Agent\'ı reddetti',
          'MET gerçek bir uygulama adı ve iletişim bilgisi ister. MET_USER_AGENT değerini doldur.');
    } else {
      bad(`HTTP ${res.status}`, body.slice(0, 200));
    }
  } else {
    const json = await res.json();
    const series = json.properties?.timeseries ?? [];
    if (series.length === 0) {
      bad('timeseries boş');
    } else {
      ok(`${series.length} saatlik tahmin döndü`);
      const first = series[0];
      first.data?.instant?.details?.air_temperature !== undefined
        ? ok(`air_temperature = ${first.data.instant.details.air_temperature}`)
        : bad('air_temperature eksik');
      const symbol = first.data?.next_1_hours?.summary?.symbol_code;
      symbol
        ? ok(`next_1_hours.symbol_code = ${symbol}`)
        : bad('next_1_hours.summary.symbol_code eksik',
              'Yağmur kararı bu alana bakıyor — yoksa hep "içeri gir" der.');
    }
  }
} catch (error) {
  bad('Bağlantı kurulamadı', String(error));
}

console.log(failed
  ? `\n❌ ${failed} sorun var — yukarıdaki alanları lib/entur.ts ve lib/met.ts ile karşılaştır.`
  : '\n✅ İki API de beklenen şemayla yanıt veriyor. COBBAN_LIVE_DATA=true yapabilirsin.');
process.exit(failed ? 1 : 0);
