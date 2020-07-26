import { useState, useEffect } from 'preact/hooks';

export default (props) => {
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = props.src;
    img.onload = () => {
      setLoaded(false);
    }

  }, []);

  return (
    <span>
      {loaded
        ? (<span>loading...</span>)
        : (<img src={props.src} />)
      }
    </span>
  );
}