import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: '260px',
          padding: '2rem',
          height: '100%',
          overflowY: 'auto',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none' // IE/Edge
        }}
        className="main-content hide-scroll"
      >
        <Outlet />
      </main>
      <style>{`
                .hide-scroll::-webkit-scrollbar {
                    display: none; /* Chrome/Safari/Opera */
                }
                @media (max-width: 768px) {
                    .main-content {
                        margin-left: 0 !important;
                        padding-top: 4rem !important;
                    }
                }
            `}</style>
    </div>
  );
}
