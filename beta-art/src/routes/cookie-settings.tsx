import { createFileRoute, redirect } from "@tanstack/react-router";

// Eski bir yayın sürümünün altbilgisi /cookie-settings sayfasına bağlanıyordu.
// Bu kaynakta izleme çerezi ve dolayısıyla ayrı bir çerez ayar sayfası yok;
// çerez beyanı gizlilik metnindedir. Eski bağlantılar oraya yönlendirilir.
export const Route = createFileRoute("/cookie-settings")({
  beforeLoad: () => {
    throw redirect({ to: "/privacy" });
  },
});
