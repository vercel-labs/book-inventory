import Loading from './loading';

// When there is a hard refresh, show the loading state in place of
// the root layout's `children`, which is the `page` component.
export default function Default() {
  return <Loading />;
}
