import { useQuery } from '@tanstack/react-query'
import { obtenerNoticias } from '../../../lib/api/noticiasApi'

/**
 * Reemplaza a `ResumenCiudad` (tarjeta "Aujourd'hui à {ciudad}", borrada a
 * pedido del usuario junto con toda la cadena que solo ella consumía:
 * `useCalidadAire`/`aireApi`/`aireService`/`aire.routes` y `lib/clima/luna.ts`
 * — sin otros usos en el código, quedaban muertos al borrar la tarjeta).
 *
 * Misma llamada a NewsData.io que el feed principal (`obtenerNoticias`), con
 * `alcance='mundo'` (sin `country`, ver `noticiasService.js`) — noticias
 * globales pero en francés, coherente con el resto del sitio. Mismo
 * `staleTime` largo que el feed de Francia: el backend ya cachea 15min de su
 * lado, no hace falta refetch más seguido.
 */
export function NoticiasMundo() {
  const { data } = useQuery({
    queryKey: ['noticias', 'mundo'],
    queryFn: () => obtenerNoticias('mundo'),
    staleTime: 15 * 60 * 1000,
  })

  if (!data?.length) return null

  return (
    <aside className="rounded-2xl bg-white p-6 md:p-9 shadow-[0_10px_32px_rgba(20,24,28,0.06),0_3px_8px_rgba(20,24,28,0.04)]">
      <p className="font-mono text-[0.8125rem] uppercase tracking-wider text-atmos-slate mb-6">Dans le monde</p>
      <div className="flex flex-col">
        {data.map((noticia, indice) => (
          <a
            key={noticia.id}
            href={noticia.enlace}
            target="_blank"
            rel="noreferrer"
            className={`group flex items-center gap-4 py-4 ${indice > 0 ? 'border-t border-atmos-slate/20' : ''}`}
          >
            {noticia.imagen && (
              // Tamaño FIJO (cuadrado, mismo que el diseño original) + `items-center`
              // en el <a>: mantiene el recorte natural de la foto (estirarla a una tira
              // angosta para llenar titulares largos se probó y se veía roto) — el
              // centrado resuelve el desbalance de alturas sin deformar la imagen.
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-atmos-slate/10">
                <img
                  src={noticia.imagen}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-[scale] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.parentElement!.style.display = 'none'
                  }}
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[0.6875rem] uppercase tracking-wider text-atmos-slate mb-1">
                {noticia.categoria}
              </p>
              <h4 className="font-display text-base font-normal text-atmos-ink leading-snug">{noticia.titular}</h4>
            </div>
          </a>
        ))}
      </div>
    </aside>
  )
}
