import { LANGS } from './knowledge';

export const langPaths = () => LANGS.map((lang) => ({ params: { lang } }));
