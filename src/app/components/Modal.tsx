"use client"
import styles from "@/styles/Modal.module.scss";
type Props = {
    title: string,
    closeText?: string,
    saveText?: string,
    frameClassName?: string,
    onClose?: () => void,
    onSave?: () => void,
} &
    React.HTMLAttributes<HTMLDivElement>

const defaultProps: Props = {
    title: "Modal",
    closeText: "Close",
    saveText: "Save",
}
export default function Modal(
    props: Props
) {
    const { 
        children, 
        title=defaultProps.title, 
        onClose,
        onSave,
        closeText=defaultProps.closeText,
        saveText=defaultProps.saveText,
        className: customClassName, 
        ...divProps } = props;

    const cls = customClassName
    const frameCls = props.frameClassName ? `${styles["modal-frame"]} ${props.frameClassName}` : styles["modal-frame"]
    return (
        <div className={styles.modal}>
            <div className={frameCls} {...divProps}>
                <h2>{props.title}</h2>
                <div className={cls}>
                    {props.children}
                </div>

                <div className={styles["modal-button-group"]}>
                    <div className={styles["modal-close"]} onClick={() => {
                        if (onClose) {
                            onClose();
                        }
                    }}>
                        <span>{closeText}</span>
                    </div>
                   {onSave && <div className={styles["modal-open"]} onClick={() => {
                        if (onSave) {
                            onSave();
                        }
                    }} >
                        <span>{saveText}</span>
                    </div>}
                </div>

            </div>
        </div >
    )
}

