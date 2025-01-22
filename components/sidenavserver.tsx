import { fetchGenres } from '@/utils/fetchGenres'
import { LanguageEnum } from '@/utils/types'
import SideNav from './sidenav'

type Props = {
 params: {
   lang?: string;
 };
};

export default async function ServerSideNav({params}: Props) {
 const currentLanguage = (params?.lang?.toUpperCase() as LanguageEnum) || LanguageEnum.EN
  const data = await fetchGenres(currentLanguage);

  return (
    <SideNav genres={data.genres} />
  );
}