import { useEffect, useRef } from 'preact/hooks';
import { CSSTransition } from 'react-transition-group';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import style from './style.less';

export default (props) => {
  const {
    onClose,
    isShow,
    title,
    children,
    contentHeight
  } = props;

  useEffect(() => {
    return () => {
      clearAllBodyScrollLocks();
    }
  }, [])

  return (
    <>
      <div className={style.drawerPos}>
        <CSSTransition
          in={isShow}
          timeout={300}
          classNames="drawer"
          unmountOnExit
          onEnter={() => {
            disableBodyScroll(document.body);
            document.body.addEventListener('touchmove', (e) => e.preventDefault(), false);
          }}
          onExit={() => {
            enableBodyScroll(document.body);
            document.body.removeEventListener('touchmove', (e) => e.preventDefault(), false);
          }}
        >
          <div className={style.drawerContainer}>
            <div className={style.drawerHeader}>
              <span className={style.closeBtn} onClick={onClose && onClose}></span>
              <div className={style.title}>{title}</div>
            </div>
            <div className={style.drawerContent} style={{ height: contentHeight ? contentHeight : '100%', overflowY: 'auto' }}>
              {children}
            </div>
          </div>
        </CSSTransition>
      </div>

    </>
  )
}