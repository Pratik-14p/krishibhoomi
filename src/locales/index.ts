import { LanguageCode, SUPPORTED_LANGUAGES, SupportedLanguage } from './types';
import { TranslationDictionary, en } from './dictionaries/en';
import { hi } from './dictionaries/hi';
import { mr } from './dictionaries/mr';
import { bn } from './dictionaries/bn';
import { gu } from './dictionaries/gu';
import { te } from './dictionaries/te';
import { ta } from './dictionaries/ta';
import { kn } from './dictionaries/kn';
import { pa } from './dictionaries/pa';
import { ml } from './dictionaries/ml';
import { or } from './dictionaries/or';
import { as } from './dictionaries/as';
import { ur } from './dictionaries/ur';
import { sa } from './dictionaries/sa';
import { ne } from './dictionaries/ne';
import { kok } from './dictionaries/kok';
import { mai } from './dictionaries/mai';
import { ks } from './dictionaries/ks';
import { sd } from './dictionaries/sd';
import { brx } from './dictionaries/brx';
import { doi } from './dictionaries/doi';
import { mni } from './dictionaries/mni';
import { sat } from './dictionaries/sat';

export const DICTIONARIES: Record<LanguageCode, TranslationDictionary> = {
  en,
  hi,
  mr,
  bn,
  gu,
  te,
  ta,
  kn,
  pa,
  ml,
  or,
  as,
  ur,
  sa,
  ne,
  kok,
  mai,
  ks,
  sd,
  brx,
  doi,
  mni,
  sat,
};

export { SUPPORTED_LANGUAGES };
export type { LanguageCode, SupportedLanguage, TranslationDictionary };
