import styles from "./index.module.scss";

// 组件的参数类型
interface SvgIconProps {
  name: string;
  size?: string;
}

export default function SvgIcon({ name, size = "2em", ...otherProps }: SvgIconProps) {
  // 计算是否为外链图标
  const isExternalIcon = /^(https?:|mailto:|tel:)/.test(name);

  // 计算icon名称
  const iconName = `#icon-${name}`;

  // 计算外链图标的样式
  const styleExternalIcon = {
    mask: `url(${name}) no-repeat 50% 50%`,
    WebkitMask: `url(${name}) no-repeat 50% 50%`,
  };

  // 根据isExternalIcon渲染不同的内容
  return (
    <>
      {isExternalIcon ? (
        <div
          style={{ ...styleExternalIcon, width: size, height: size }}
          className={`${styles.svgExternalIcon} ${styles.svgIcon}`}
          {...otherProps}
        />
      ) : (
        <svg
          style={{ width: size, height: size }}
          className={styles.svgIcon}
          {...otherProps}
          aria-hidden="true"
        >
          <use xlinkHref={iconName} />
        </svg>
      )}
    </>
  );
}
