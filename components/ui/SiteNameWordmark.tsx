interface SiteNameWordmarkProps {
  siteName: string;
  secondWordClassName?: string;
}

const CAMEL_CASE_WORD_PATTERN = /[A-Z]?[a-z]+|[A-Z]+(?![a-z])|\d+/g;

function getSiteNameParts(siteName: string) {
  const trimmedSiteName = siteName.trim();
  if (!trimmedSiteName) {
    return {
      firstWord: '',
      secondWord: null as string | null,
      remainingWords: [] as string[],
      joiner: '' as '' | ' ',
    };
  }

  const spacedWords = trimmedSiteName.split(/\s+/);
  if (spacedWords.length >= 2) {
    const [firstWord, secondWord, ...remainingWords] = spacedWords;
    return { firstWord, secondWord, remainingWords, joiner: ' ' as const };
  }

  const camelCaseWords = trimmedSiteName.match(CAMEL_CASE_WORD_PATTERN);
  if (camelCaseWords && camelCaseWords.length >= 2) {
    const [firstWord, secondWord, ...remainingWords] = camelCaseWords;
    return { firstWord, secondWord, remainingWords, joiner: '' as const };
  }

  return {
    firstWord: trimmedSiteName,
    secondWord: null as string | null,
    remainingWords: [] as string[],
    joiner: '' as '' | ' ',
  };
}

export default function SiteNameWordmark({ siteName, secondWordClassName = 'font-semibold' }: SiteNameWordmarkProps) {
  const { firstWord, secondWord, remainingWords, joiner } = getSiteNameParts(siteName);

  if (!secondWord) return <>{firstWord}</>;

  return (
    <>
      {firstWord}
      {joiner}
      <span className={secondWordClassName}>{secondWord}</span>
      {remainingWords.length > 0 ? `${joiner}${remainingWords.join(joiner)}` : ''}
    </>
  );
}
