import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { CSSTransition } from 'react-transition-group';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import style from './style.less';

const Div = (props) => {
  const [open, setOpen] = useState(false);
  const {
    content = '内容',
    desc = '描述',
    onConfirm,
    confirmText = '确认',
    onCancel,
    cancelText = '取消',
    useMask = false,
  } = props;

  function handelCancel() {
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
    setOpen(false);
  }

  function handelConfirm() {
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm();
    }
    setOpen(false);
  }

  useEffect(() => {
    setOpen(true)
  }, [])

  return (
    <div className={style.messgePosition}>
      <CSSTransition
        in={open}
        timeout={300}
        classNames="message"
        unmountOnExit

        onEnter={() => {
          if (useMask) {
            const div = document.createElement('div');
            // div.className = 'bodyMask';
            document.body.append(div);
          }
          disableBodyScroll(document.body);

        }}
        onExit={() => {
          if (useMask) {
            const div = document.getElementsByClassName('bodyMask')[0];
            document.body.removeChild(div);
          }
          enableBodyScroll(document.body);
        }}
        onExited={() => {
          MessageInstants.close()
        }}
      >
        <div className={style.messageBox}>
          <span className={style.closeBtn} onClick={() => setOpen(false)}></span>
          <div className={style.messageTitle}>{content}</div>
          {props.desc && (
            <div className={style.messageDesc}>{desc}</div>
          )}
          <div className={style.actGroups}>
            {props.cancelBtn && (
              <div>
                <button className={style.btn} onClick={handelCancel}>{cancelText}</button>
              </div>
            )}

            {onConfirm && typeof onConfirm === 'function' && (
              <div>
                <button className={style.btn} onClick={handelConfirm}>{confirmText}</button>
              </div>
            )}

          </div>
        </div>
      </CSSTransition>

    </div>
  )
};

const MessageInstants = {
  wrapper: null,
  show(options = {}) {
    this.wrapper = document.createElement('div');
    render(<Div {...options} />, this.wrapper);
    document.body.appendChild(this.wrapper);
  },
  close() {
    document.body.removeChild(this.wrapper);
  },
  info(content) {
    this.show(content);
  }
}

const message = {
  info: (options) => MessageInstants.info.call(MessageInstants, options)
}

export default message;

