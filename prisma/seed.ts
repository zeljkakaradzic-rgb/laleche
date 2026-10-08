import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const CATEGORIES = [
  { name: "Kaputi", slug: "kaputi", isVisible: true, sortOrder: 0 },
  { name: "Haljine", slug: "haljine", isVisible: true, sortOrder: 1 },
  { name: "Džemperi", slug: "dzemperi", isVisible: true, sortOrder: 2 },
  { name: "Pantalone", slug: "pantalone", isVisible: true, sortOrder: 3 },
  { name: "Obuća", slug: "obuca", isVisible: true, sortOrder: 4 },
  { name: "Ponča", slug: "ponca", isVisible: false, sortOrder: 5 },
  { name: "Aksesoari", slug: "aksesoari", isVisible: false, sortOrder: 6 },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@laleche.rs";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "laleche2026";

await db.adminUser.upsert({
  where: { email: adminEmail },
  update: {
    passwordHash: await bcrypt.hash(adminPassword, 10),
  },
  create: {
    email: adminEmail,
    passwordHash: await bcrypt.hash(adminPassword, 10),
  },
});
  console.log(`Admin nalog: ${adminEmail} / ${adminPassword}`);

  const categoryBySlug = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const created = await db.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, isVisible: cat.isVisible, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoryBySlug.set(cat.slug, created.id);
  }

  const existingProducts = await db.product.count();
  if (existingProducts > 0) {
    console.log("Proizvodi već postoje, seed proizvoda je preskočen.");
    await db.$disconnect();
    return;
  }

  type SeedProduct = {
    name: string;
    slug: string;
    categorySlug: string;
    price: number;
    oldPrice?: number;
    status: "DRAFT" | "ACTIVE" | "SOLD_OUT" | "ARCHIVED";
    featured?: boolean;
    material: string;
    description: string;
    placeholder: string;
    variants: { size: string; color: string; stock: number }[];
  };

  const products: SeedProduct[] = [
    {
      name: "Vuneni kaput Amelie",
      slug: "vuneni-kaput-amelie",
      categorySlug: "kaputi",
      price: 15990,
      status: "ACTIVE",
      featured: true,
      material: "80% vuna, 20% poliamid",
      description:
        "Kaput koji nosiš uz sve što već imaš. Mek, strukturiran kroj koji ne izlazi iz mode.",
      placeholder: "kaputi",
      variants: [
        { size: "S", color: "Bež", stock: 2 },
        { size: "M", color: "Bež", stock: 3 },
        { size: "L", color: "Crna", stock: 1 },
      ],
    },
    {
      name: "Duži kaput Noor",
      slug: "duzi-kaput-noor",
      categorySlug: "kaputi",
      price: 18990,
      oldPrice: 22990,
      status: "ACTIVE",
      material: "Vuneno-kašmirska mešavina",
      description: "Elegantan, duži kroj za sezone kada želiš da se izdvojiš bez napora.",
      placeholder: "kaputi",
      variants: [
        { size: "S", color: "Karamel", stock: 1 },
        { size: "M", color: "Karamel", stock: 2 },
      ],
    },
    {
      name: "Haljina Simone",
      slug: "haljina-simone",
      categorySlug: "haljine",
      price: 8990,
      status: "ACTIVE",
      featured: true,
      material: "Viskoza",
      description: "Haljina koja pada lako i nosi se u svim prilikama, od kancelarije do večeri.",
      placeholder: "haljine",
      variants: [
        { size: "S", color: "Crna", stock: 3 },
        { size: "M", color: "Crna", stock: 2 },
        { size: "L", color: "Bordo", stock: 2 },
      ],
    },
    {
      name: "Midi haljina Elle",
      slug: "midi-haljina-elle",
      categorySlug: "haljine",
      price: 9990,
      oldPrice: 12990,
      status: "ACTIVE",
      material: "Pamučna mešavina",
      description: "Midi dužina, struk naglašen, za dane kada želiš da se osećaš sigurno u sebe.",
      placeholder: "haljine",
      variants: [
        { size: "S", color: "Maslinasto zelena", stock: 2 },
        { size: "M", color: "Maslinasto zelena", stock: 1 },
      ],
    },
    {
      name: "Džemper Luna",
      slug: "dzemper-luna",
      categorySlug: "dzemperi",
      price: 6490,
      status: "ACTIVE",
      featured: true,
      material: "Merino vuna",
      description: "Osnova ormara — mek džemper koji ide uz pantalone, farmerke i suknje.",
      placeholder: "dzemperi",
      variants: [
        { size: "S", color: "Krem", stock: 4 },
        { size: "M", color: "Krem", stock: 3 },
        { size: "L", color: "Siva", stock: 2 },
      ],
    },
    {
      name: "Rebrasti džemper Wren",
      slug: "rebrasti-dzemper-wren",
      categorySlug: "dzemperi",
      price: 6990,
      status: "SOLD_OUT",
      material: "Pamuk, rebrasti pletenj",
      description: "Uska silueta, rebrasti pletenj — trenutno rasprodato, uskoro opet u ponudi.",
      placeholder: "dzemperi",
      variants: [
        { size: "S", color: "Crna", stock: 0 },
        { size: "M", color: "Crna", stock: 0 },
      ],
    },
    {
      name: "Pantalone Row",
      slug: "pantalone-row",
      categorySlug: "pantalone",
      price: 7490,
      status: "ACTIVE",
      featured: true,
      material: "Vunena mešavina, širok kroj",
      description: "Širok, ravan kroj koji izdužuje figuru i ide uz gotovo sve što imaš u ormaru.",
      placeholder: "pantalone",
      variants: [
        { size: "S", color: "Crna", stock: 3 },
        { size: "M", color: "Crna", stock: 2 },
        { size: "L", color: "Bež", stock: 2 },
      ],
    },
    {
      name: "Pantalone Nova",
      slug: "pantalone-nova",
      categorySlug: "pantalone",
      price: 7990,
      status: "DRAFT",
      material: "Pamučna mešavina",
      description: "Nova kolekcija u pripremi — još nije objavljeno na sajtu.",
      placeholder: "pantalone",
      variants: [{ size: "M", color: "Bež", stock: 5 }],
    },
    {
      name: "Čizme Mila",
      slug: "cizme-mila",
      categorySlug: "obuca",
      price: 12990,
      status: "ACTIVE",
      material: "Prava koža",
      description: "Čizme koje nosiš i danju i večeri, uz haljine i uz pantalone.",
      placeholder: "obuca",
      variants: [
        { size: "38", color: "Crna", stock: 2 },
        { size: "39", color: "Crna", stock: 3 },
        { size: "40", color: "Crna", stock: 1 },
      ],
    },
    {
      name: "Balerinke Noa",
      slug: "balerinke-noa",
      categorySlug: "obuca",
      price: 5990,
      status: "ACTIVE",
      material: "Koža, meko postavljene",
      description: "Udobne balerinke za svaki dan — lagane, jednostavne, uvek u modi.",
      placeholder: "obuca",
      variants: [
        { size: "37", color: "Karamel", stock: 2 },
        { size: "38", color: "Karamel", stock: 2 },
      ],
    },
  ];

  const productIdBySlug = new Map<string, string>();

  for (const p of products) {
    const categoryId = categoryBySlug.get(p.categorySlug);
    if (!categoryId) throw new Error(`Nepoznata kategorija: ${p.categorySlug}`);

    const created = await db.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        material: p.material,
        price: p.price,
        oldPrice: p.oldPrice,
        status: p.status,
        featured: p.featured ?? false,
        categoryId,
        variants: { create: p.variants },
        media: {
          create: [
            { type: "IMAGE", url: `/placeholders/${p.placeholder}.svg`, sortOrder: 0 },
            { type: "IMAGE", url: `/placeholders/look.svg`, sortOrder: 1 },
          ],
        },
      },
    });
    productIdBySlug.set(p.slug, created.id);
  }

  const recommendations: [string, string[]][] = [
    ["vuneni-kaput-amelie", ["pantalone-row", "dzemper-luna"]],
    ["haljina-simone", ["cizme-mila", "duzi-kaput-noor"]],
    ["dzemper-luna", ["pantalone-row", "cizme-mila"]],
  ];

  for (const [baseSlug, recSlugs] of recommendations) {
    const baseId = productIdBySlug.get(baseSlug);
    if (!baseId) continue;
    for (const recSlug of recSlugs) {
      const recId = productIdBySlug.get(recSlug);
      if (!recId) continue;
      await db.productRecommendation.create({
        data: { baseProductId: baseId, recommendedProductId: recId },
      });
    }
  }

  console.log(`Ubačeno ${products.length} proizvoda u ${CATEGORIES.length} kategorija.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
