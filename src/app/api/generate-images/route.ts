import { Citation } from '@/app/page';
import fs from 'fs';
import path from 'path';

type AugmentedCitations = Citation & { imageData: string };

// Assurez-vous que le répertoire pour les citations existe
const saveImage = (citation: AugmentedCitations) => {
  console.log('citation', citation.id);
  const dir = path.join(process.cwd(), 'public', 'citations');
  const fileName = `${citation.id}.png`; // Remplacer / par -

  // Créer le répertoire s'il n'existe pas
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Chemin complet pour le fichier
  const filePath = path.join(dir, fileName);

  // Écrire le fichier
  fs.writeFileSync(filePath, citation.imageData.replace(/^data:image\/png;base64,/, ''), 'base64');
};

export async function POST(request: Request) {
  const { citations }: { citations: AugmentedCitations[] } = await request.json();

  citations.forEach(citation => {
    saveImage(citation);
  });

  return new Response(JSON.stringify({ message: 'Images générées avec succès' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
