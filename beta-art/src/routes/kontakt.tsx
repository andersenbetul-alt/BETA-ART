import { createFileRoute, redirect } from "@tanstack/react-router";

// Eski bir yayın sürümünün altbilgisi "Angrerett og refusjon" bağlantısını
// /kontakt'a veriyordu; o adres bu kaynakta yok. Gelen eski bağlantılar
// kırılmasın diye asıl sayfaya yönlendirilir.
export const Route = createFileRoute("/kontakt")({
  beforeLoad: () => {
    throw redirect({ to: "/refunds" });
  },
});
