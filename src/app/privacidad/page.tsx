import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de privacidad · IRO Metrics',
  description: 'Política de privacidad y protección de datos de IRO Metrics.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-6 py-16">
      <article className="mx-auto max-w-2xl prose prose-invert prose-sm">
        <h1 className="text-3xl font-bold mb-8">Política de privacidad</h1>

        <p className="text-slate-400 text-xs mb-8">
          Última actualización: marzo 2026
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-white">
          1. Responsable del tratamiento
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Raúl Balaguer Moreno · Investigador principal · Universidad Nacional
          de Educación a Distancia (UNED) · Contacto:{' '}
          <a href="mailto:rbalaguer16@alumno.uned.es" className="text-blue-400 underline">
            rbalaguer16@alumno.uned.es
          </a>
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-white">
          2. Finalidad del tratamiento
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Los datos recogidos a través de irometrics.app se utilizan
          exclusivamente para investigación académica sobre dinámica
          organizacional y bienestar laboral en microempresas tecnológicas
          españolas, en el marco de un Trabajo Fin de Grado de Psicología
          (UNED, 2026).
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-white">
          3. Base legal
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Consentimiento explícito del participante (Art. 6.1.a del Reglamento
          General de Protección de Datos — RGPD, UE 2016/679).
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-white">
          4. Datos recogidos
        </h2>
        <ul className="text-slate-300 text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li>Respuestas a 50 ítems del cuestionario (escalas numéricas)</li>
          <li>Datos sociodemográficos agregados (sector, tamaño de empresa, rol, antigüedad, edad)</li>
          <li>Código de sesión aleatorio (UUID v4) generado en el navegador</li>
          <li>Marca temporal de inicio y fin del cuestionario</li>
        </ul>
        <p className="text-slate-300 text-sm leading-relaxed mt-3">
          <strong>NO se recogen:</strong> nombre, email, empresa, dirección IP,
          cookies de seguimiento ni ningún dato que permita la identificación
          directa o indirecta del participante.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-white">
          5. Almacenamiento y seguridad
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Los datos se almacenan en Supabase (región EU-West, Frankfurt,
          Alemania), cumpliendo con los requisitos de localización del RGPD.
          El acceso está protegido mediante Row Level Security (RLS) y claves
          de acceso restringidas.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-white">
          6. Conservación
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Los datos se conservarán durante el periodo necesario para la
          finalización de la investigación académica y un máximo de 5 años
          tras la publicación de los resultados, conforme a las políticas
          de la UNED.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-white">
          7. Derechos del participante
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Conforme a los artículos 15 a 22 del RGPD, tienes derecho de acceso,
          rectificación, supresión, limitación del tratamiento, portabilidad y
          oposición. Puedes ejercer estos derechos contactando a{' '}
          <a href="mailto:rbalaguer16@alumno.uned.es" className="text-blue-400 underline">
            rbalaguer16@alumno.uned.es
          </a>
          . También puedes presentar una reclamación ante la Agencia Española
          de Protección de Datos (AEPD).
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-white">
          8. Participación voluntaria
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          La participación es completamente voluntaria y no remunerada. Puedes
          abandonar el cuestionario en cualquier momento sin consecuencia
          alguna. Al abandonar, las respuestas parciales no se envían al
          servidor.
        </p>

        <div className="mt-12 pt-8 border-t border-slate-700">
          <Link
            href="/"
            className="text-blue-400 underline text-sm"
          >
            ← Volver al inicio
          </Link>
        </div>
      </article>
    </main>
  );
}
