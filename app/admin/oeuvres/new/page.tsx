import OeuvreForm from "../OeuvreForm";

export default function NewOeuvrePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#F7F2E8] font-light">Ajouter une œuvre</h1>
        <p className="text-[#6B6560] text-sm mt-1">Créer une nouvelle fiche tableau</p>
      </div>
      <OeuvreForm mode="create" />
    </div>
  );
}
