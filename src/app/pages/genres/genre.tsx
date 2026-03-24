import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import ImageHeader from '@/app/components/album/image-header'
import { AlbumGridCard } from '@/app/components/albums/album-grid-card'
import { GenreFallback } from '@/app/components/fallbacks/genre-fallbacks'
import { GenreButtons } from '@/app/components/genres/genre-buttons'
import { GridViewWrapper } from '@/app/components/grid-view-wrapper'
import { BadgesData } from '@/app/components/header-info'
import ListWrapper from '@/app/components/list-wrapper'
import ErrorPage from '@/app/pages/error-page'
import { subsonic } from '@/service/subsonic'
import { saveGridClickedItem } from '@/utils/gridTools'
import { queryKeys } from '@/utils/queryKeys'

export default function Genre() {
  const { genreName } = useParams() as { genreName: string }
  const { t } = useTranslation()

  const genre = decodeURIComponent(genreName)

  const {
    data,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: [queryKeys.genre.albums, genre],
    queryFn: () =>
      subsonic.albums.getAlbumList({ type: 'byGenre', genre, size: 500 }),
    enabled: !!genre,
    gcTime: 0,
  })

  if (isLoading) return <GenreFallback />
  if (isFetched && !data?.list) {
    return <ErrorPage status={404} statusText="Not Found" />
  }
  if (!data?.list) return <GenreFallback />

  const albums = data.list

  saveGridClickedItem({
    name: 'genre',
    offsetTop: 0,
    routeKey: location.pathname + location.search,
  })

  const coverArtId = albums[Math.floor(Math.random() * albums.length)]?.coverArt

  const badges: BadgesData = [
    {
      content: t('genres.albumCount', { count: albums.length }),
      type: 'text',
    },
  ]

  return (
    <div className="w-full">
      <ImageHeader
        type={t('genre.headline')}
        title={genre}
        coverArtId={coverArtId}
        coverArtType="album"
        coverArtSize="700"
        coverArtAlt={genre}
        badges={badges}
      />

      <ListWrapper>
        <GenreButtons genre={genre} />
      </ListWrapper>

      <ListWrapper className="px-0 pt-0">
        <GridViewWrapper list={albums} type="genre">
          {(album) => <AlbumGridCard album={album} />}
        </GridViewWrapper>
      </ListWrapper>
    </div>
  )
}
