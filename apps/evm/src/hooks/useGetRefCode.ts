import { useSearchParams } from 'react-router-dom';

const isRefCodeValid = (ref: string | null) => {
  return ref && ref.length === 6;
};

const useGetRefCode = () => {
  // TODO: Move this to a useQueryParams utility in the hooks package
  const [searchParams] = useSearchParams();

  const refCode = searchParams.get('refCode');

  const isValid = isRefCodeValid(refCode);

  return isValid ? refCode : undefined;
};

export { useGetRefCode };
