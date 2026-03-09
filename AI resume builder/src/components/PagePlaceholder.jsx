function PagePlaceholder({ title, description }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8">
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
    </section>
  );
}

export default PagePlaceholder;
