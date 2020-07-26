import { CSSTransition } from 'react-transition-group';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { useEffect } from 'preact/hooks';

import style from './style.less';

export default (props) => {
  const {
    onClose,
    isShow,
    title = '标题',
    desc,
    onConfirm,
    confirmText = '确认',
    onCancel,
    cancelText = '取消'
  } = props;

  useEffect(() => {
    return () => {
      clearAllBodyScrollLocks();
    }
  }, [])

  return (
    <>
      <div className={style.alertPos}>
        <CSSTransition
          in={isShow}
          timeout={300}
          classNames="alert"
          unmountOnExit
          onEnter={() => {
            disableBodyScroll(document.body);
            const div = document.createElement('div');
            div.addEventListener('click', onClose && onClose);
            div.className = 'bodyMask';
            document.body.append(div);
          }}
          onExit={() => {
            enableBodyScroll(document.body);
            const div = document.getElementsByClassName('bodyMask')[0];
            div.removeEventListener('click', onClose && onClose);
            document.body.removeChild(div);
          }}
        >
          <div className={style.alertContainer}>
            <span className={style.closeBtn} onClick={onClose}></span>
            <div className={style.alertTitle}>{title}</div>
            {props.desc && (
              <div className={style.alertDesc}>{desc}</div>
            )}
            {(props.onCancel || props.onConfirm) && (
              <div className={style.actGroups}>
                {props.onCancel && (
                  <div>
                    <button className={style.btn} onClick={onCancel}>{cancelText}</button>
                  </div>
                )}
                {props.onConfirm && (
                  <div>
                    <button className={style.btn} onClick={onConfirm}>{confirmText}</button>
                  </div>
                )}
              </div>
            )}

          </div>
        </CSSTransition>
      </div>
    </>
  )
}