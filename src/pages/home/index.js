import { Link } from "preact-router/match";

export default () => {
  return (
    <div>
      <div>
        <Link href="/haha">Home</Link>
        <Link href="/hehe">Second</Link>
      </div>
      Home page
    </div>
  );
};
