/**
 * Arama karşılama sayfaları.
 *
 * İnsanlar ürünü aramaz, SORUNU arar: "bergen ferry cancelled what to do".
 * Bu sayfaların işi satmak değil, cevabı vermek ve aracı kullandırmak.
 * Sıra önemli: önce gerçek bilgi, sonra ürün. Tersi geri tuşuyla kapanır.
 */

export type HelpTopic = {
  slug: string;
  /** Kullanıcının arama kutusuna yazdığı cümleye yakın başlık. */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** İlk ekranda verilen gerçek cevap — ürün anlatımı DEĞİL. */
  answer: string[];
  /** Devamını okuyanın işine yarayan somut adımlar. */
  steps: { step: string; detail: string }[];
  /** Aracın hangi soruna yönlendireceği. */
  cta: { label: string; href: string };
};

export const helpTopics: HelpTopic[] = [
  {
    slug: 'ferry-cancelled-norway',
    title: 'Your ferry in Norway was cancelled. What now?',
    metaTitle: 'Ferry cancelled in Norway — what to do next',
    metaDescription:
      'Norwegian ferries cancel for weather and technical faults. Your rights, the fastest alternatives, and how to keep the rest of your day intact.',
    answer: [
      'Cancellations for weather are common on the west coast and are not the operator’s fault — but you still have rights.',
      'Under Norwegian and EU passenger rules, a cancelled scheduled ferry generally entitles you to either re-routing at no extra cost or a refund. Ask at the counter for re-routing first: a refund leaves you standing in the same place.',
      'Before you queue, check whether a bus or train covers the same route. On many west-coast connections the road alternative leaves sooner than the next sailing.',
    ],
    steps: [
      { step: 'Ask for re-routing, not a refund', detail: 'A refund solves the money, not the day. Re-routing is usually offered if you ask directly.' },
      { step: 'Check bus and train for the same route', detail: 'Norway’s public transport is integrated. The next departure is often not a ferry at all.' },
      { step: 'Call your hotel before you rebook', detail: 'Most Norwegian hotels hold a room far later than the stated check-in time — but only if you tell them.' },
      { step: 'Keep the cancellation notice', detail: 'A photo of the board or the SMS is what travel insurance asks for later.' },
    ],
    cta: { label: 'Show me the alternatives', href: '/sorun/cancelled' },
  },
  {
    slug: 'rain-ruined-my-day-norway',
    title: 'It is raining in Norway and your whole plan was outdoors',
    metaTitle: 'Raining in Norway — is it worth waiting, or move indoors?',
    metaDescription:
      'Bergen rains most days but rarely all day. How to tell whether to wait it out or rebuild the day indoors, and what is actually worth doing.',
    answer: [
      'Bergen averages rain on roughly two days in three — but most of it passes within a couple of hours. Rebuilding your whole day at the first shower usually costs you the good weather that follows.',
      'The useful question is not "is it raining" but "how long for". If the forecast clears within about two hours, wait it out somewhere with a roof and keep your plan.',
      'If it is set in for the afternoon, swap the order of your days rather than cancelling anything: do the indoor day now and move the hike to the clear one.',
    ],
    steps: [
      { step: 'Check the hourly forecast, not the daily one', detail: 'A "rainy day" in the daily summary is often three wet hours and six dry ones.' },
      { step: 'Swap days instead of cancelling', detail: 'Museums are open every day; the view from Fløyen is not.' },
      { step: 'Buy the rain jacket, not the umbrella', detail: 'Coastal wind makes umbrellas useless and locals will quietly judge you.' },
    ],
    cta: { label: 'Should I wait or go indoors?', href: '/sorun/rain' },
  },
];

export function helpTopic(slug: string): HelpTopic | undefined {
  return helpTopics.find((t) => t.slug === slug);
}
