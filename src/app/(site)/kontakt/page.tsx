export default function ContactPage() {
  return (
    <div className="container-page max-w-xl py-16">
      <p className="label-caps text-[var(--color-taupe)]">Kontakt</p>
      <h1 className="mt-3 font-serif-display text-3xl">Javi nam se</h1>
      <p className="mt-4 text-[var(--color-ink-soft)]">
        Za sva pitanja o porudžbini, veličinama ili dostavi, javi nam se putem:
      </p>

      <div className="mt-8 space-y-3 text-[var(--color-ink)]">
        <p>
          <span className="label-caps text-[var(--color-taupe)]">Instagram</span>
          <br />
          @conceptlaleche
        </p>
        <p>
          <span className="label-caps text-[var(--color-taupe)]">Telefon</span>
          <br />
          [dodaj broj telefona]
        </p>
        <p>
          <span className="label-caps text-[var(--color-taupe)]">Email</span>
          <br />
          [dodaj email adresu]
        </p>
      </div>

      <p className="mt-10 text-sm text-[var(--color-taupe)]">
        Porudžbine se potvrđuju telefonskim putem, a plaćanje se vrši pouzećem prilikom
        preuzimanja.
      </p>
    </div>
  );
}
