export const SITE = {
  name: "Verodav Home",
  tagline: "Better home, think us.",
  email: "info@verodav-home.com",
  phone: "+33 7 58 34 76 62",
  phoneRaw: "+33758347662",
  address: "21 rue de Cherbourg, 67100 Strasbourg",
  socials: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
  },
};

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
