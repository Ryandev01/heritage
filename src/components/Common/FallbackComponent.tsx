import Loader from './Loader';

const FallbackComponent = () => (
  <div
    style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Loader />
  </div>
);

export default FallbackComponent;
